import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    score: { type: Number, required: true },
    why: { type: String, default: "" },
  },
  { _id: false }
);

const RecommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: String, default: "" },
    major: { type: String, default: "" },
    level: { type: String, default: "" },
    location: { type: String, default: "" },
    results: {
      careers: { type: [ItemSchema], default: [] },
      formations: { type: [ItemSchema], default: [] },
      pfeTopics: { type: [ItemSchema], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recommendation", RecommendationSchema);
