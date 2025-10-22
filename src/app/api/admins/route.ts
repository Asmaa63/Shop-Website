import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

interface UpdateData {
  name?: string;
  password?: string;
}


// 🟢 Get all admins
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("my-shop");

    const admins = await db
      .collection("admin") // نفس اسم الكولكشن عندك
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Failed to fetch admins" }, { status: 500 });
  }
}

// 🟢 Add new admin
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

    await db.collection("admin").insertOne(newAdmin);

    return NextResponse.json({ message: "Admin added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding admin:", error);
    return NextResponse.json({ message: "Failed to add admin" }, { status: 500 });
  }
}

// 🟢 Update admin (by email)
export async function PUT(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required to update admin" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("my-shop");

    const existingAdmin = await db.collection("admin").findOne({ email });
    if (!existingAdmin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const updateData: UpdateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await db.collection("admin").updateOne({ email }, { $set: updateData });

    return NextResponse.json({ message: "Admin updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ message: "Failed to update admin" }, { status: 500 });
  }
}

// 🟢 Delete admin (by email)
export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required to delete admin" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("my-shop");

    const result = await db.collection("admin").deleteOne({ email });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ message: "Failed to delete admin" }, { status: 500 });
  }
}
