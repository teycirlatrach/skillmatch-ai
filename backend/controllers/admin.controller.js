import User from "../models/User.js";
import Recommendation from "../models/Recommendation.js";

export async function getAdminStats(req, res) {
  const studentsCount = await User.countDocuments({ role: "STUDENT" });
  const recommendationsCount = await Recommendation.countDocuments();

  res.json({
    studentsCount,
    recommendationsCount,
  });
}
