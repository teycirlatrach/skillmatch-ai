import mongoose from "mongoose";

const careerSkillSchema = new mongoose.Schema(
  {
    careerId: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    weight: { type: Number, min: 0, max: 1, default: 0.5 },
    minLevel: { type: Number, min: 1, max: 5, default: 2 }
  },
  { timestamps: true }
);

careerSkillSchema.index({ careerId: 1, skillId: 1 }, { unique: true });

export default mongoose.model("CareerSkill", careerSkillSchema);
