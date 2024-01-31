// @ts-ignore
import { NextResponse } from "next/server";
import db from "@/lib/supabase/db";
import { School } from "@/lib/supabase/schema";

export const POST = async (req: Request) => {
  try {
    const { id, message } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const result = await db.query.school.findMany({
      with: {
        users: true,
      },
    });
    if (!message) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 422 }
      );
    }

    const newMessage = await db
      .insert(School)
      .values({
        userId: id,
        message,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const savedMessage = newMessage[0];
    return NextResponse.json({ message: savedMessage }, { status: 200 });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
};
