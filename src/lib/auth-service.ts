export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

// Built-in predefined Admin Accounts
export const VALID_ADMIN_ACCOUNTS = [
  {
    username: "admin",
    aliases: ["admin@nutrihealth.com", "administrator"],
    password: "admin123",
    name: "System Administrator",
    email: "admin@nutrihealth.com",
    role: "Super Admin",
  },
  {
    username: "nutritionist",
    aliases: ["clinical@nutrihealth.com"],
    password: "nutri123",
    name: "Dr. Sarah Chen",
    email: "clinical@nutrihealth.com",
    role: "Clinical Specialist",
  }
];

const SESSION_STORAGE_KEY = "nutri_admin_session";
const COOKIE_NAME = "admin_session";

export class AuthService {
  /**
   * Authenticate with username/email and password
   */
  public static async login(
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: "Please enter both username and password." };
    }

    // Find matching admin account
    const matchedAccount = VALID_ADMIN_ACCOUNTS.find((acc) => {
      const isIdMatch =
        acc.username.toLowerCase() === cleanId ||
        acc.aliases.some((alias) => alias.toLowerCase() === cleanId);
      return isIdMatch && acc.password === cleanPass;
    });

    if (!matchedAccount) {
      return {
        success: false,
        error: "Invalid username or password. (Default: username: admin / password: admin123)",
      };
    }

    const session: AuthSession = {
      user: {
        id: `admin-${matchedAccount.username}`,
        username: matchedAccount.username,
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role,
        lastLogin: new Date().toISOString(),
      },
      token: `admin-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Store in browser
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        // Also set cookie so Next.js middleware and SSR can detect auth
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
          session.token
        )}; path=/; max-age=604800; SameSite=Lax`;
      } catch (err) {
        console.error("Failed to persist admin session:", err);
      }
    }

    return { success: true, session };
  }

  /**
   * Clear session and log out
   */
  public static logout(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
      } catch (err) {
        console.error("Failed to clear admin session:", err);
      }
      window.location.href = "/login";
    }
  }

  /**
   * Retrieve active session from localStorage
   */
  public static getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      if (!session || !session.expiresAt || Date.now() > session.expiresAt) {
        // Expired
        this.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  /**
   * Check if current user is authenticated
   */
  public static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Get current admin profile
   */
  public static getCurrentAdmin(): AdminUser | null {
    const session = this.getSession();
    return session ? session.user : null;
  }
}
