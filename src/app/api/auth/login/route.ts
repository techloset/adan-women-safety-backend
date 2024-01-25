// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 422 }
      );
    const Users = await db.select().from(users).where(eq(users.email, email));
    const user = Users[0] || null;

    if (!user) {
      return NextResponse.json(
        { user: null, message: "the email is not registered" },
        { status: 409 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Email or Password is incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    const savedUser = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      profilePic: user.avatarUrl,
    };

    return NextResponse.json(
      {
        success: true,
        message: "login successfully",
        user: savedUser,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { message: "Error finding user" },
      { status: 500 }
    );
  }
};
