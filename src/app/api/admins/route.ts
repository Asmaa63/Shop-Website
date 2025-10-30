import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

interface UpdateData {
  name?: string;
  password?: string;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("my-shop");

    const admins = await db
      .collection("admin")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("my-shop");

    const existingAdmin = await db.collection("admin").findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db.collection("admin").insertOne(newAdmin);

    return NextResponse.json({ 
      message: "Admin added successfully",
      admin: { ...newAdmin, _id: result.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding admin:", error);
    return NextResponse.json({ message: "Failed to add admin" }, { status: 500 });
  }
}