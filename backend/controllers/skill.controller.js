import Skill from "../models/Skill.js";

export async function listSkills(req, res, next) {
  try {
    const items = await Skill.find({}).sort({ name: 1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function getSkill(req, res, next) {
  try {
    const item = await Skill.findById(req.params.id);
    if (!item) { res.status(404); return next(new Error("Skill not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function createSkill(req, res, next) {
  try {
    const item = await Skill.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function updateSkill(req, res, next) {
  try {
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) { res.status(404); return next(new Error("Skill not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteSkill(req, res, next) {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404); return next(new Error("Skill not found")); }
    res.json({ ok: true });
  } catch (e) { next(e); }
}
