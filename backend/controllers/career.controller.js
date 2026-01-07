import Career from "../models/Career.js";

export async function listCareers(req, res, next) {
  try {
    const items = await Career.find({}).sort({ title: 1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function getCareer(req, res, next) {
  try {
    const item = await Career.findById(req.params.id);
    if (!item) { res.status(404); return next(new Error("Career not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function createCareer(req, res, next) {
  try {
    const item = await Career.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function updateCareer(req, res, next) {
  try {
    const item = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) { res.status(404); return next(new Error("Career not found")); }
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteCareer(req, res, next) {
  try {
    const item = await Career.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404); return next(new Error("Career not found")); }
    res.json({ ok: true });
  } catch (e) { next(e); }
}
