import mongoose from "mongoose";

const formationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    provider: { type: String, default: "" }, // Coursera, Udemy, Local...
    durationWeeks: { type: Number, default: 4 },
    level: { type: String, default: "Beginner" },
    url: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Formation", formationSchema);
