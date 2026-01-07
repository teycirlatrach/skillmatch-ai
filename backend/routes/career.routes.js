import { Router } from "express";
import Joi from "joi";
import { protect, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

import { listCareers, getCareer, createCareer, updateCareer, deleteCareer } from "../controllers/career.controller.js";
import { listCareerSkills, addCareerSkill, updateCareerSkill, deleteCareerSkill } from "../controllers/careerSkill.controller.js";

const router = Router();

const careerSchema = Joi.object({
  title: Joi.string().min(2).max(80).required(),
  description: Joi.string().allow("").max(1000).default(""),
  domain: Joi.string().max(40).default("General"),
});

const careerSkillSchema = Joi.object({
  skillId: Joi.string().required(),
  weight: Joi.number().min(0).max(1).default(0.5),
  minLevel: Joi.number().min(1).max(5).default(2),
});

router.get("/", protect, listCareers);
router.get("/:id", protect, getCareer);

router.post("/", protect, requireAdmin, validateBody(careerSchema), createCareer);
router.put("/:id", protect, requireAdmin, validateBody(careerSchema), updateCareer);
router.delete("/:id", protect, requireAdmin, deleteCareer);

// Nested: /api/careers/:careerId/skills
router.get("/:careerId/skills", protect, listCareerSkills);
router.post("/:careerId/skills", protect, requireAdmin, validateBody(careerSkillSchema), addCareerSkill);

router.put("/:careerId/skills/:id", protect, requireAdmin, validateBody(careerSkillSchema), updateCareerSkill);
router.delete("/:careerId/skills/:id", protect, requireAdmin, deleteCareerSkill);

export default router;
