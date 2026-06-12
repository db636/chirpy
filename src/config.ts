import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

export function envOrThrow(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export type DBConfig = {
  migrationConfig: MigrationConfig
  url: string;
}

export type APIConfig = {
  fileserverHits: number;
  dbURL: string;
  paltform: string;
  jwtSecret: string;
}

export type Config = {
  api: APIConfig;
  db: DBConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "src/db/migrations",
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
    paltform: envOrThrow("PLATFORM"),
    jwtSecret: envOrThrow("JWT_SECRET")
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig
  }
};

