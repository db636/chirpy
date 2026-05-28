import express from "express";
import { handlerReadines } from "./handlers/handlerReadines.js";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadines);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
