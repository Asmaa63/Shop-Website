import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      status: "unread",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Message sent successfully", contact: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}