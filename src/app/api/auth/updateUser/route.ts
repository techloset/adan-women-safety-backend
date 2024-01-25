import db from "@/lib/supabase/db";
import { users } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { fullName, avatarUrl, email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 422 }
      );
    }
    const Users = await db.select().from(users).where(eq(users.email, email));
    const user = Users[0] || null;

    if (!user) {
      return NextResponse.json(
        { user: null, message: "the email is not registered" },
        { status: 409 }
      );
    }

    if (!fullName || !avatarUrl) {
      return NextResponse.json(
        { user: null, message: "please fill atLeast one Input" },
        { status: 409 }
      );
    }

    const SavedUsers = await db
      .update(users)
      .set({ fullName, avatarUrl })
      .where(eq(users.email, email))
      .returning({ updatedId: users.id });
    const SavedUser = SavedUsers[0] || null;

    return NextResponse.json(
      { message: "Profile Updated", users: SavedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Profile Could Not Be Updated" },
      { status: 500 }
    );
  }
}
