import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "data", "users.json");

function getUsers() {
  try {
    const data = readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data).users || [];
  } catch (error) {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get users
    const users = getUsers();

    // Find user by email
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}