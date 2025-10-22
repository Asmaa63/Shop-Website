import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

interface UpdatedFields {
  name?: string;
  email?: string;
  password?: string;
}

export async function PUT(req: Request, { params }: { params: { email: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("my-shop");
    const email = decodeURIComponent(params.email);
    const body = await req.json();

    const updatedFields: UpdatedFields = {
  name: body.name,
  email: body.email,
};

    if (body.password && body.password.trim() !== "") {
  const hashed = await bcrypt.hash(body.password, 10);
  updatedFields.password = hashed;
}

    await db.collection("admin").updateOne({ email }, { $set: updatedFields });

    return NextResponse.json({ message: "Admin updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update admin" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { email: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("my-shop");
    const email = decodeURIComponent(params.email);

    await db.collection("admin").deleteOne({ email });

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete admin" }, { status: 500 });
  }
}
