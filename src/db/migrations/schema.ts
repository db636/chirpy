import { pgTable, foreignKey, uuid, timestamp, text, unique, varchar, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const chirps = pgTable("chirps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	body: text().notNull(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_id_fk"
		}).onDelete("cascade"),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	token: text().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	email: varchar({ length: 256 }).notNull(),
	hashedPassword: varchar("hashed_password").default('unset').notNull(),
	isChirpyRed: boolean("is_chirpy_red").default(false),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
