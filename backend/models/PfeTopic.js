import mongoose from "mongoose";

const pfeTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    careerId: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true }, // 1 career -> many topics
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    suggestedStack: [{ type: String }] // ["MERN","Python","PowerBI"]
  },
  { timestamps: true }
);

export default mongoose.model("PfeTopic", pfeTopicSchema);
