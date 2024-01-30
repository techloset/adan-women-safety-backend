// @ts-ignore
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";
export const POST = async (req: Request) => {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 422 }
      );
    }

    const exist = await db
      .selectDistinct()
      .from(users)
      .where(eq(users.email, email));

    const existingUser = exist[0] || null;

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 201 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db
      .insert(users)
      .values({
        email,
        fullName,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      })
      .returning();
    const user = newUser[0];
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
};
