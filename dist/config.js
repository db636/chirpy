process.loadEnvFile();
export function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
const migrationConfig = {
    migrationsFolder: "src/db/migrations",
};
export const config = {
    api: {
        fileserverHits: 0,
        dbURL: envOrThrow("DB_URL"),
        paltform: envOrThrow("PLATFORM")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig
    }
};
