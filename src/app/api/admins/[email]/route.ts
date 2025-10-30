import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

interface UpdatedFields {
  name?: string;
  password?: string;
}

const SUPER_ADMIN_EMAIL = "asmaasharf123@gmail.com";

export async function PUT(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("my-shop");
    const email = decodeURIComponent(params.email);
    const body = await req.json();

    const admin = await db.collection("admin").findOne({ email });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const updatedFields: UpdatedFields = {};

    if (body.name) {
      updatedFields.name = body.name;
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        body.currentPassword,
        admin.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      updatedFields.password = hashedPassword;
    }

    await db.collection("admin").updateOne(
      { email },
      { $set: updatedFields }
    );

    return NextResponse.json(
      { message: "Admin updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { message: "Failed to update admin" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);

    // 🔒 Protect Super Admin from deletion
    if (email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { message: "Cannot delete Super Admin account. This account is protected." },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("my-shop");

    const result = await db.collection("admin").deleteOne({ email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { message: "Failed to delete admin" },
      { status: 500 }
    );
  }
}