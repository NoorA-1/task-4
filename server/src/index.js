import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { router } from "./routes.js";

const app = express();

const allowedOrigins = [
  config.clientOrigin,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use(router);

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
