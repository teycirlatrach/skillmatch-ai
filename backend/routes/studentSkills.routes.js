import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { listMySkills, addMySkill, updateMySkill, deleteMySkill } from "../controllers/studentSkills.controller.js";

const router = Router();

router.get("/", protect, listMySkills);
router.post("/", protect, addMySkill);
router.patch("/:id", protect, updateMySkill);
router.delete("/:id", protect, deleteMySkill);

export default router;
