import FormationSkill from "../models/FormationSkill.js";

export async function listFormationSkills(req, res, next) {
  try {
    const items = await FormationSkill.find({ formationId: req.params.formationId }).populate("skillId");
    res.json(items);
  } catch (e) { next(e); }
}

export async function addFormationSkill(req, res, next) {
  try {
    const item = await FormationSkill.create({ ...req.body, formationId: req.params.formationId });
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function updateFormationSkill(req, res, next) {
  try {
    const item = await FormationSkill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) { res.status(404); return next(new Error("FormationSkill not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteFormationSkill(req, res, next) {
  try {
    const item = await FormationSkill.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404); return next(new Error("FormationSkill not found")); }
    res.json({ ok: true });
  } catch (e) { next(e); }
}
