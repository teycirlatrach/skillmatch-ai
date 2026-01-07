import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { generate, history, getOne } from "../controllers/recommendation.controller.js";

const router = Router();

router.post("/generate", requireAuth, generate);
router.get("/history", requireAuth, history);
router.get("/:id", requireAuth, getOne);

export default router;
