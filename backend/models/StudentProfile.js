import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    fullName: { type: String, required: true },
    major: { type: String, default: "" },          // e.g. BI, CS
    level: { type: String, default: "" },          // e.g. 3rd year
    location: { type: String, default: "" },       // e.g. Sousse
    goal: { type: String, default: "PFE" },        // PFE / JOB / MASTER
    interests: [{ type: String }],                 // ["cyber","data"]
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
