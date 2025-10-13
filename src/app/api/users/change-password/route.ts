import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { compare, hash } from "bcryptjs";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "data", "users.json");
interface User {
  email: string;
  password: string;
  updatedAt?: string;
}


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!existsSync(USERS_FILE)) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    const data = readFileSync(USERS_FILE, "utf-8");
    const usersData = JSON.parse(data);
    const userIndex = usersData.users.findIndex((u: User) => u.email === session.user.email);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = usersData.users[userIndex];
    const isValidPassword = await compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);
    usersData.users[userIndex].password = hashedPassword;
    usersData.users[userIndex].updatedAt = new Date().toISOString();

    writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}