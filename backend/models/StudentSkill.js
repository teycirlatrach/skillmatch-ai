import mongoose from "mongoose";

const studentSkillSchema = new mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile", required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    level: { type: Number, min: 1, max: 5, required: true } // 1 beginner..5 expert
  },
  { timestamps: true }
);

studentSkillSchema.index({ profileId: 1, skillId: 1 }, { unique: true });

export default mongoose.model("StudentSkill", studentSkillSchema);
