import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    const cleanId = String(identifier || "").trim().toLowerCase();
    const cleanPass = String(password || "").trim();

    if (!cleanId || !cleanPass) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const envAdminEmail = (process.env.ADMIN_EMAIL || "superadmin@gmail.com").trim().toLowerCase();
    const envAdminPass = (process.env.ADMIN_PASSWORD || "healthtrackapp@123456").trim();

    // Check against server-side secret environment variables
    const isIdMatch =
      cleanId === envAdminEmail ||
      cleanId === "superadmin" ||
      cleanId === "admin";

    const isPassMatch = cleanPass === envAdminPass;

    if (!isIdMatch || !isPassMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    // Authenticated admin user profile (password is never exposed)
    const user = {
      id: "admin-superadmin",
      username: envAdminEmail,
      name: "Super Admin",
      email: envAdminEmail,
      role: "Super Admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      lastLogin: new Date().toISOString(),
    };

    const token = `auth-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours

    const session = {
      user,
      token,
      expiresAt,
    };

    const response = NextResponse.json({
      success: true,
      session,
    });

    // Set cookie on response for middleware / SSR detection
    response.cookies.set("admin_session", encodeURIComponent(token), {
      path: "/",
      maxAge: 28800, // 8 hours
      sameSite: "lax",
      httpOnly: false, // Accessible by proxy middleware & client sync
    });

    return response;
  } catch (error) {
    console.error("Authentication API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
