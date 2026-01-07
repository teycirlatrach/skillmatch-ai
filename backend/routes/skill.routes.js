import { Router } from "express";
import Joi from "joi";
import { protect, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { listSkills, getSkill, createSkill, updateSkill, deleteSkill } from "../controllers/skill.controller.js";

const router = Router();

const skillSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  category: Joi.string().max(40).default("General"),
});

router.get("/", protect, listSkills);
router.get("/:id", protect, getSkill);

router.post("/", protect, requireAdmin, validateBody(skillSchema), createSkill);
router.put("/:id", protect, requireAdmin, validateBody(skillSchema), updateSkill);
router.delete("/:id", protect, requireAdmin, deleteSkill);

export default router;
