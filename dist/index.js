import express from "express";
import { handlerReadines } from "./api/handlerReadines.js";
import { middlewareLogResponses } from './api/middlewareLogResponses.js';
import { middlewareMetricsInc } from './api/middlewareMetricsInc.js';
import { handlerHits } from './api/handlerHits.js';
import { handlerHitsReset } from './api/handlerHitsReset.js';
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadines);
app.get("/api/metrics", handlerHits);
app.get("/api/reset", handlerHitsReset);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
