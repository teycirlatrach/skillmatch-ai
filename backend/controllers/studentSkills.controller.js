import StudentProfile from "../models/StudentProfile.js";
import StudentSkill from "../models/StudentSkill.js";

export async function listMySkills(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.sub });
    const items = await StudentSkill.find({ profileId: profile._id }).populate("skillId");
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function addMySkill(req, res, next) {
  try {
    const { skillId, level } = req.body;
    const profile = await StudentProfile.findOne({ userId: req.user.sub });

    const item = await StudentSkill.create({ profileId: profile._id, skillId, level });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function updateMySkill(req, res, next) {
  try {
    const { level } = req.body;
    const item = await StudentSkill.findByIdAndUpdate(req.params.id, { level }, { new: true });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function deleteMySkill(req, res, next) {
  try {
    await StudentSkill.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
