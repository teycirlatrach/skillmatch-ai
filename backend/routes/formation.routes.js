import { Router } from "express";
import Joi from "joi";
import { protect, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

import { listFormations, getFormation, createFormation, updateFormation, deleteFormation } from "../controllers/formation.controller.js";
import { listFormationSkills, addFormationSkill, updateFormationSkill, deleteFormationSkill } from "../controllers/formationSkill.controller.js";

const router = Router();

const formationSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  provider: Joi.string().allow("").max(80).default(""),
  durationWeeks: Joi.number().min(1).max(200).default(4),
  level: Joi.string().max(30).default("Beginner"),
  url: Joi.string().allow("").max(300).default(""),
});

const formationSkillSchema = Joi.object({
  skillId: Joi.string().required(),
  weight: Joi.number().min(0).max(1).default(0.5),
  minLevel: Joi.number().min(1).max(5).default(1),
});

router.get("/", protect, listFormations);
router.get("/:id", protect, getFormation);

router.post("/", protect, requireAdmin, validateBody(formationSchema), createFormation);
router.put("/:id", protect, requireAdmin, validateBody(formationSchema), updateFormation);
router.delete("/:id", protect, requireAdmin, deleteFormation);

// Nested: /api/formations/:formationId/skills
router.get("/:formationId/skills", protect, listFormationSkills);
router.post("/:formationId/skills", protect, requireAdmin, validateBody(formationSkillSchema), addFormationSkill);

router.put("/:formationId/skills/:id", protect, requireAdmin, validateBody(formationSkillSchema), updateFormationSkill);
router.delete("/:formationId/skills/:id", protect, requireAdmin, deleteFormationSkill);

export default router;
