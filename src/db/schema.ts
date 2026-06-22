import { foreignKey, pgTable, timestamp, varchar, text, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").default("unset").notNull(),
  isChirpyRed: boolean("is_chirpy_red").default(false)
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("body").notNull(),
  userId: uuid("user_id").notNull(),
}, (table) => [
  foreignKey({
    name: "user_id_fk",
    columns: [table.userId],
    foreignColumns: [users.id]
  }).onDelete('cascade')
])

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
}, (table) => [
  foreignKey({
    name: "user_id_fk",
    columns: [table.userId],
    foreignColumns: [users.id]
  }).onDelete('cascade')
])

export type NewChirp = typeof chirps.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
export type UserResponse = Omit<NewUser, "hashedPassword">