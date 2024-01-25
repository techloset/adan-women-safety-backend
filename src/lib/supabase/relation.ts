import { relations } from "drizzle-orm";
import { School, users } from "./schema";

export const schoolRelations = relations(School, ({ one }) => ({
  author: one(users, {
    fields: [School.userId],
    references: [users.id],
  }),
}));
