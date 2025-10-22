import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface User {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ استخدمي قاعدة البيانات الصحيحة
    const client = await clientPromise;
    const db = client.db("ecommerce");
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ احذفي الباسورد من الرد
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      image: user.image || "",
      address: user.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("ecommerce"); 
    const usersCollection = db.collection<User>("users");

    const updateData: Partial<User> = {
      updatedAt: new Date(),
    };

    if (body.name) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address) updateData.address = body.address;
    if (body.image) updateData.image = body.image;

    const result = await usersCollection.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.value;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        image: user.image || "",
        address: user.address || {},
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
