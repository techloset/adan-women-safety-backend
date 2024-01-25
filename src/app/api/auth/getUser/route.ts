import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const Users = await db.select().from(users).where(eq(users.id, id));
    const user = Users[0] || null;

    return NextResponse.json({ avatarUrl: user?.avatarUrl }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};
