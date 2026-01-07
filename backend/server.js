import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import adminRoutes from "./routes/admin.routes.js";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import catalogRoutes from "./routes/catalog.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import careerRoutes from "./routes/career.routes.js";
import formationRoutes from "./routes/formation.routes.js";
import pfeRoutes from "./routes/pfe.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import mySkillsRoutes from "./routes/studentSkills.routes.js";
dotenv.config();
await connectDB(process.env.MONGO_URI);

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

app.get("/", (req, res) => res.json({ ok: true, name: "SkillMatch AI API" }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/pfe-topics", pfeRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/me/skills", mySkillsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use(notFound);
app.use(errorHandler);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
