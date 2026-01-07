import Formation from "../models/Formation.js";

export async function listFormations(req, res, next) {
  try {
    const items = await Formation.find({}).sort({ title: 1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function getFormation(req, res, next) {
  try {
    const item = await Formation.findById(req.params.id);
    if (!item) { res.status(404); return next(new Error("Formation not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function createFormation(req, res, next) {
  try {
    const item = await Formation.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function updateFormation(req, res, next) {
  try {
    const item = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) { res.status(404); return next(new Error("Formation not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteFormation(req, res, next) {
  try {
    const item = await Formation.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404); return next(new Error("Formation not found")); }
    res.json({ ok: true });
  } catch (e) { next(e); }
}
