import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listFavorites, addFavorite, removeFavorite } from "../controllers/favorites.controller.js";

const router = Router();

router.get("/", requireAuth, requireRole("STUDENT"), listFavorites);
router.post("/", requireAuth, requireRole("STUDENT"), addFavorite);
router.delete("/", requireAuth, requireRole("STUDENT"), removeFavorite);

export default router;
