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

const SESSION_STORAGE_KEY = "nutri_admin_session";
const COOKIE_NAME = "admin_session";

export class AuthService {
  /**
   * Authenticate securely via server-side endpoint.
   * Credentials and passwords are verified strictly on the server and never exposed in client bundles.
   */
  public static async login(
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const cleanId = identifier.trim();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: "Please enter both email and password." };
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: cleanId,
          password: cleanPass,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Invalid email or password. Please verify your credentials.",
        };
      }

      const session: AuthSession = data.session;

      // Store in browser localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          // Redundant fallback cookie setter in case response cookie didn't attach
          document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
            session.token
          )}; path=/; max-age=28800; SameSite=Lax`;
        } catch (err) {
          console.error("Failed to persist admin session in localStorage:", err);
        }
      }

      return { success: true, session };
    } catch (err) {
      console.error("Network or authentication error:", err);
      return {
        success: false,
        error: "Unable to connect to the authentication server. Please check your connection.",
      };
    }
  }

  /**
   * Clear session and log out
   */
  public static async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
