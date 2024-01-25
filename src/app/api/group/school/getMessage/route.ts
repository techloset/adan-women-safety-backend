import db from "@/lib/supabase/db";
// import { School, users } from "@/lib/supabase/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { DrizzleQueryClient } from "drizzle-react";
import { School, schoolRelations } from "@/lib/supabase/schema";

export const GET = async (req: Request) => {
  try {
    const db: DrizzleQueryClient<typeof schoolRelations> = useDrizzle().db;
    const messagesWithUsers = await db.query.School.findMany();

    return NextResponse.json({ messagesWithUsers }, { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return an error response
  }
};
