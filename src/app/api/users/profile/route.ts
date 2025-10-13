import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "data", "users.json");

// ✅ Define user type
interface User {
  email: string;
  name: string;
  phone?: string;
  password?: string;
  updatedAt?: string;
}

// ✅ Get current user data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!existsSync(USERS_FILE)) {
      return NextResponse.json({ error: "Users file not found" }, { status: 404 });
    }

    const data = JSON.parse(readFileSync(USERS_FILE, "utf-8"));
    const user = data.users?.find((u: User) => u.email === session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
