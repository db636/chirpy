import express from "express";
import { handlerReadines } from "./api/handlerReadines.js";
import { middlewareLogResponses } from './api/middlewareLogResponses.js';

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadines);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
