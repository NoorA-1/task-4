import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "./config.js";

dotenv.config();

const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
