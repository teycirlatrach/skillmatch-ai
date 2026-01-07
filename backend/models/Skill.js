import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "General" }, // Data, Web, Security...
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
