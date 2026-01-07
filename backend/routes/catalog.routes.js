import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listCareers, listFormations, listPfe } from "../controllers/catalog.controller.js";

const router = Router();

// student-only (tu peux enlever requireRole si tu veux public)
router.get("/careers", requireAuth, requireRole("STUDENT"), listCareers);
router.get("/formations", requireAuth, requireRole("STUDENT"), listFormations);
router.get("/pfe", requireAuth, requireRole("STUDENT"), listPfe);

export default router;
