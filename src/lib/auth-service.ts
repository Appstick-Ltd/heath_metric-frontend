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

// Built-in predefined Admin Account (Fixed)
export const VALID_ADMIN_ACCOUNTS = [
  {
    username: "superadmin@gmail.com",
    aliases: ["superadmin@gmail.com", "superadmin", "admin"],
    password: "healthtrackapp@123456",
    name: "Super Admin",
    email: "superadmin@gmail.com",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
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
        error: "Invalid email or password. Please verify your credentials.",
      };
    }

    const targetUser: AdminUser = {
      id: `user-${matchedAccount.username}`,
      username: matchedAccount.username,
      name: matchedAccount.name,
      email: matchedAccount.email,
      role: matchedAccount.role,
      avatar: matchedAccount.avatar,
      lastLogin: new Date().toISOString(),
    };

    const session: AuthSession = {
      user: targetUser,
      token: `auth-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    };

    // Store in browser
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        // Also set cookie so Next.js middleware and SSR can detect auth
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
          session.token
        )}; path=/; max-age=28800; SameSite=Lax`;
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
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/mc-portal/auth";
    }
  }

  /**
   * Retrieve active session from localStorage
   */
  public static getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        // Clear lingering cookie to prevent middleware redirect loops
        document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
        return null;
      }

      const session: AuthSession = JSON.parse(raw);
      if (!session || !session.expiresAt || Date.now() > session.expiresAt) {
        // Expired
        this.logout();
        return null;
      }

      // Auto-enrich existing session with avatar and updated account details if a matching account exists
      const matched = VALID_ADMIN_ACCOUNTS.find(
        (acc) => acc.username === session.user?.username || acc.email === session.user?.email
      );

      if (matched) {
        session.user.avatar = matched.avatar || session.user.avatar;
        session.user.name = matched.name || session.user.name;
        session.user.email = matched.email || session.user.email;
        session.user.role = matched.role;
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } catch {}
      }

      return session;
    } catch {
      document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
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
