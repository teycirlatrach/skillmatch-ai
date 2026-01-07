import PfeTopic from "../models/PfeTopic.js";

export async function listPfe(req, res, next) {
  try {
    const items = await PfeTopic.find({}).populate("careerId").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function getPfe(req, res, next) {
  try {
    const item = await PfeTopic.findById(req.params.id).populate("careerId");
    if (!item) { res.status(404); return next(new Error("PFE topic not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function createPfe(req, res, next) {
  try {
    const item = await PfeTopic.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function updatePfe(req, res, next) {
  try {
    const item = await PfeTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) { res.status(404); return next(new Error("PFE topic not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function deletePfe(req, res, next) {
  try {
    const item = await PfeTopic.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404); return next(new Error("PFE topic not found")); }
    res.json({ ok: true });
  } catch (e) { next(e); }
}
