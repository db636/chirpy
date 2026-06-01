import express from "express";
import { handlerReadines } from "./api/handlerReadines.js";
import { middlewareLogResponses, middlewareMetricsInc } from './api/middleware.js';
import { handlerHits } from './api/handlerHits.js';
import { handlerHitsReset } from './api/handlerHitsReset.js';

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerHits);
app.get("/admin/reset", handlerHitsReset);
app.get("/api/healthz", handlerReadines);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
