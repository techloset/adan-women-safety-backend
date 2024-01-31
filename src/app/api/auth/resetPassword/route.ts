// @ts-ignore
import nodemailer from "nodemailer";
// @ts-ignore
import { hash } from "bcrypt";

import { NextResponse } from "next/server";
import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";

export const PUT = async (req: Request) => {
  try {
    const { id, password } = await req.json();

    if (!id || !password) {
      return NextResponse.json(
        { success: false, message: "invalid credentials" },
        { status: 400 }
      );
    }
    const existingUsers: any[] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    const existingUser = existingUsers[0] || null;
    console.log(existingUsers);

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "the email is not registered",
        },
        { status: 201 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, existingUser.id))
      .returning();
    const user = newUser[0];
    return NextResponse.json(
      {
        message: "password has been updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { message: "Error reset password" },
      { status: 500 }
    );
  }
};
