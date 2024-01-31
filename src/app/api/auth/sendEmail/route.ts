// @ts-ignore
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { success: false, message: "invalid credentials" },
        { status: 400 }
      );
    const Users = await db.select().from(users).where(eq(users.email, email));
    const user = Users[0] || null;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "the email is not registered",
        },
        { status: 201 }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const link = `${process.env.Link}resetlink/${user.id}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Link",
      text: `Click this link to reset your password: ${link}`,
      html: `<p>Click this link to reset your password: <a href="${link}">Reset Password</a></p>`,
    });

    return NextResponse.json(
      {
        message: "Link sent to email to reset password",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
};
