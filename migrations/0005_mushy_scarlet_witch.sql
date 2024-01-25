CREATE TABLE IF NOT EXISTS "school" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"message" text NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
DROP TABLE " school";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "school" ADD CONSTRAINT "school_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
