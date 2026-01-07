import { Router } from "express";
import Joi from "joi";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { getMe, updateMe } from "../controllers/profile.controller.js";

const router = Router();

const updateSchema = Joi.object({
  fullName: Joi.string().min(2).max(80),
  major: Joi.string().allow("").max(80),
  level: Joi.string().allow("").max(40),
  location: Joi.string().allow("").max(60),
  goal: Joi.string().allow("").max(60),
  interests: Joi.array().items(Joi.string().max(40)).default([]),
});

router.get("/me", protect, getMe);
router.put("/me", protect, validateBody(updateSchema), updateMe);

export default router;
