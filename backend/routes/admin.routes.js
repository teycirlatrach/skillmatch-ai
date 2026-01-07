import { Router } from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/stats", requireAuth, requireRole("ADMIN"), getAdminStats);

export default router;
