import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    domain: { type: String, default: "General" } // Cyber, BI, Web...
  },
  { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
