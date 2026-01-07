import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind: { type: String, enum: ["CAREER", "FORMATION", "PFE"], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, default: "" }, // pour affichage rapide
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, kind: 1, itemId: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);
