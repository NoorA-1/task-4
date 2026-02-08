import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { router } from "./routes.js";

const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use(router);

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
