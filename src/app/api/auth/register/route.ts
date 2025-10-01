// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // التحقق من البيانات
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // التحقق من صحة الـ email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // التحقق من قوة الـ password
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // هنا هتتأكدي إن الـ email مش موجود قبل كده في الـ database
    // const existingUser = await prisma.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: "User already exists" },
    //     { status: 400 }
    //   );
    // }

    // تشفير الـ password
    const hashedPassword = await bcrypt.hash(password, 12);

    // حفظ المستخدم الجديد في الـ database
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   },
    // });

    // مثال للرد
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          name,
          email,
          // لا ترجعي الـ password أبداً!
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}