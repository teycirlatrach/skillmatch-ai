import mongoose from "mongoose";

const formationSkillSchema = new mongoose.Schema(
  {
    formationId: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    weight: { type: Number, min: 0, max: 1, default: 0.5 },
    minLevel: { type: Number, min: 1, max: 5, default: 1 }
  },
  { timestamps: true }
);

formationSkillSchema.index({ formationId: 1, skillId: 1 }, { unique: true });

export default mongoose.model("FormationSkill", formationSkillSchema);
