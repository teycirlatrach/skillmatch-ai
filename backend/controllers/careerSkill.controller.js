import CareerSkill from "../models/CareerSkill.js";

export async function listCareerSkills(req, res, next) {
  try {
    const items = await CareerSkill.find({ careerId: req.params.careerId }).populate("skillId");
    res.json(items);
  } catch (e) { next(e); }
}

export async function addCareerSkill(req, res, next) {
  try {
    const item = await CareerSkill.create({ ...req.body, careerId: req.params.careerId });
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function updateCareerSkill(req, res, next) {
  try {
    const item = await CareerSkill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) { res.status(404); return next(new Error("CareerSkill not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteCareerSkill(req, res, next) {
  try {
    const item = await CareerSkill.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404); return next(new Error("CareerSkill not found")); }
    res.json({ ok: true });
  } catch (e) { next(e); }
}
