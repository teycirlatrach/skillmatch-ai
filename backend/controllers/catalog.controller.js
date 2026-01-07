import Career from "../models/Career.js";
import Formation from "../models/Formation.js";
import PfeTopic from "../models/PfeTopic.js";

export async function listCareers(req, res) {
  const rows = await Career.find({}).sort({ title: 1 });
  res.json(rows);
}

export async function listFormations(req, res) {
  const rows = await Formation.find({}).sort({ title: 1 });
  res.json(rows);
}

export async function listPfe(req, res) {
  // populate optional si ton PfeTopic a careerId
  const rows = await PfeTopic.find({}).populate("careerId").sort({ title: 1 });
  res.json(rows);
}
