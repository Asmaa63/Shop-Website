import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { Collection } from "mongodb";

interface User {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid input: Name, email, and password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const usersCollection: Collection<User> = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: result.insertedId,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
