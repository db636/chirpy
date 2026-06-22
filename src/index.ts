import express from "express";
import { handlerReadines } from "./api/healthz.js";
import { middlewareLogResponses, middlewareMetricsInc } from './api/middleware.js';
import { handlerHits, handlerHitsReset } from './api/hits.js';
import { errorHandler } from './api/errors.js';
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from './config.js';
import { handlerCreateUser, handlerLogin, handlerRefreshToken, handlerRevokeRefreshToken, handlerUpdateUser, handlerPolkaWebhook } from './api/users.js';
import { createChirpHandler, getChirpsHandler, getChirpHandler, handlerChirpsDelete } from './api/chirps.js';

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerHitsReset);
app.get("/api/healthz", handlerReadines);

app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeRefreshToken);

app.post("/api/users", handlerCreateUser);
app.put("/api/users", handlerUpdateUser);
app.post("/api/login", handlerLogin);
app.post("/api/polka/webhooks", handlerPolkaWebhook);


app.post("/api/chirps", createChirpHandler);
app.get("/api/chirps", getChirpsHandler);
app.get("/api/chirps/:chirpId", getChirpHandler);
app.delete("/api/chirps/:chirpId", handlerChirpsDelete);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
