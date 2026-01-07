import Favorite from "../models/Favorite.js";

function getUserId(req) {
  return req.user?.sub || req.user?.id || req.user?._id;
}

export async function listFavorites(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const list = await Favorite.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { kind, itemId, title } = req.body;
    if (!kind || !itemId) return res.status(400).json({ message: "kind and itemId are required" });

    const doc = await Favorite.create({
      userId,
      kind,
      itemId,
      title: title || "",
    });

    res.status(201).json(doc);
  } catch (e) {
    // si doublon (déjà favori) => renvoyer ok au lieu crash
    if (e?.code === 11000) return res.status(200).json({ message: "Already in favorites" });
    next(e);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { kind, itemId } = req.query;
    if (!kind || !itemId) return res.status(400).json({ message: "kind and itemId are required" });

    await Favorite.deleteOne({ userId, kind, itemId });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
