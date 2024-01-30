import db from "@/lib/supabase/db";
// import { School, users } from "@/lib/supabase/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { School, schoolRelations } from "@/lib/supabase/schema";

export const GET = async (req: Request) => {
  try {
    // const messagesWithUsers = await db.query.school.findmany({
    //   users: true,
    // });
    // const result = await db
    //   .select()
    //   .from(yourTable)
    //   .where(eq(yourTable.school, "test"))
    //   .all();
    // return NextResponse.json({ messagesWithUsers }, { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 }); // Return an error response
  }
};
