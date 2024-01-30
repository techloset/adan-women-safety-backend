// @ts-ignore
import { NextResponse } from "next/server";
import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { sql } from "drizzle-orm";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 422 }
      );
    }
    const Users = await db
      .select()
      .from(users)
      .where(sql`not ${users.id} = ${id}`);

    Users.forEach((user: any) => {
      delete user.password;
      delete user.avatarUrl;
    });

    return NextResponse.json({ Users }, { status: 200 });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
};
