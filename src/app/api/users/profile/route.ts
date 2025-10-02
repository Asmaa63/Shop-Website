import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "data", "users.json");

// GET - Get user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!existsSync(USERS_FILE)) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    const data = readFileSync(USERS_FILE, "utf-8");
    const users = JSON.parse(data).users || [];
    const user = users.find((u: any) => u.email === session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!existsSync(USERS_FILE)) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    const data = readFileSync(USERS_FILE, "utf-8");
    const usersData = JSON.parse(data);
    const userIndex = usersData.users.findIndex(
      (u: any) => u.email === session.user.email
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user data (keep password unchanged)
    usersData.users[userIndex] = {
      ...usersData.users[userIndex],
      name: body.name || usersData.users[userIndex].name,
      phone: body.phone || usersData.users[userIndex].phone,
      address: body.address || usersData.users[userIndex].address,
      updatedAt: new Date().toISOString(),
    };

    writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));

    const { password, ...userWithoutPassword } = usersData.users[userIndex];
    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}