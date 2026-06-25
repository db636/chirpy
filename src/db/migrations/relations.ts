import { relations } from "drizzle-orm/relations";
import { users, chirps, refreshTokens } from "./schema";

export const chirpsRelations = relations(chirps, ({one}) => ({
	user: one(users, {
		fields: [chirps.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	chirps: many(chirps),
	refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));