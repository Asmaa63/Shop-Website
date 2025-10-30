import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Contact from "@/models/Contact";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { status } = await req.json();

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { message: "Error updating message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { message: "Error deleting message" },
      { status: 500 }
    );
  }
}