import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";

export async function getMe(req, res, next) {
  try {
    // 1) Try find profile
    let profile = await StudentProfile.findOne({ userId: req.user.sub });

    // 2) If missing => create automatically (fix 404 forever)
    if (!profile) {
      const user = await User.findById(req.user.sub);
      if (!user) {
        res.status(404);
        return next(new Error("User not found"));
      }

      profile = await StudentProfile.create({
        userId: user._id,
        fullName: user.email.split("@")[0], // default name
        major: "",
        level: "",
        location: "",
        goal: "PFE",
        interests: [],
      });
    }

    return res.json(profile);
  } catch (e) {
    next(e);
  }
}

export async function updateMe(req, res, next) {
  try {
    const allowed = ["fullName", "major", "level", "location", "goal", "interests"];
    const patch = {};
    for (const k of allowed) if (req.body[k] !== undefined) patch[k] = req.body[k];

    let profile = await StudentProfile.findOne({ userId: req.user.sub });

    // If missing => create then update
    if (!profile) {
      profile = await StudentProfile.create({
        userId: req.user.sub,
        fullName: patch.fullName || "Student",
        major: patch.major || "",
        level: patch.level || "",
        location: patch.location || "",
        goal: patch.goal || "PFE",
        interests: patch.interests || [],
      });
      return res.json(profile);
    }

    profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.sub },
      { $set: patch },
      { new: true }
    );

    res.json(profile);
  } catch (e) {
    next(e);
  }
}
