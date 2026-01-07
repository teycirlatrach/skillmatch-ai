import { Router } from "express";
import Joi from "joi";
import { protect, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { listPfe, getPfe, createPfe, updatePfe, deletePfe } from "../controllers/pfe.controller.js";

const router = Router();

const pfeSchema = Joi.object({
  title: Joi.string().min(3).max(140).required(),
  description: Joi.string().allow("").max(1500).default(""),
  careerId: Joi.string().required(),
  difficulty: Joi.string().valid("Easy", "Medium", "Hard").default("Medium"),
  suggestedStack: Joi.array().items(Joi.string().max(40)).default([]),
});

router.get("/", protect, listPfe);
router.get("/:id", protect, getPfe);

router.post("/", protect, requireAdmin, validateBody(pfeSchema), createPfe);
router.put("/:id", protect, requireAdmin, validateBody(pfeSchema), updatePfe);
router.delete("/:id", protect, requireAdmin, deletePfe);

export default router;
