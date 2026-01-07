import StudentProfile from "../models/StudentProfile.js";
import StudentSkill from "../models/StudentSkill.js";
import Career from "../models/Career.js";
import CareerSkill from "../models/CareerSkill.js";
import Formation from "../models/Formation.js";
import FormationSkill from "../models/FormationSkill.js";
import PfeTopic from "../models/PfeTopic.js";
import Recommendation from "../models/Recommendation.js";
import { computeMatchScore } from "../utils/matching.js";

function buildWhy(missingCount, score) {
  if (score >= 80) return "Strong match based on your current skills.";
  if (score >= 60) return "Good match. Improve a few skills to become ready.";
  return missingCount > 0 ? "Needs improvement. Missing key skills." : "Low match.";
}

function getUserId(req) {
  // compatible avec plusieurs payloads JWT
  return req.user?.sub || req.user?.id || req.user?._id;
}

/**
 * POST /api/recommendations/generate
 * calcule + sauvegarde + renvoie
 */
export async function generate(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const mySkills = await StudentSkill.find({ profileId: profile._id });

    // map: skillId -> level
    const studentSkillsMap = {};
    for (const s of mySkills) studentSkillsMap[s.skillId.toString()] = s.level;

    // Careers scoring
    const careers = await Career.find({});
    const careerResults = [];
    for (const c of careers) {
      const reqSkills = await CareerSkill.find({ careerId: c._id });
      const { score, missing } = computeMatchScore(studentSkillsMap, reqSkills);
      careerResults.push({
        itemId: c._id,
        title: c.title,
        score,
        why: buildWhy(missing.length, score),
      });
    }
    careerResults.sort((a, b) => b.score - a.score);

    // Formations scoring
    const formations = await Formation.find({});
    const formationResults = [];
    for (const f of formations) {
      const reqSkills = await FormationSkill.find({ formationId: f._id });
      const { score, missing } = computeMatchScore(studentSkillsMap, reqSkills);
      formationResults.push({
        itemId: f._id,
        title: f.title,
        score,
        why: buildWhy(missing.length, score),
      });
    }
    formationResults.sort((a, b) => b.score - a.score);

    // PFE topics: based on top career
    const bestCareer = careerResults[0];
    const pfeTopics = bestCareer
      ? await PfeTopic.find({ careerId: bestCareer.itemId }).limit(10)
      : await PfeTopic.find({}).limit(10);

    const pfeResults = pfeTopics.map((t, idx) => ({
      itemId: t._id,
      title: t.title,
      score: bestCareer ? Math.max(55, bestCareer.score - idx * 2) : 50,
      why: bestCareer ? `Aligned with top career: ${bestCareer.title}` : "Suggested topic.",
    }));

    // ✅ save (history)
    const saved = await Recommendation.create({
      userId,
      profileSnapshot: profile.toObject(), // ok pour soutenance (sinon tu peux enlever)
      results: {
        careers: careerResults.slice(0, 5),
        formations: formationResults.slice(0, 5),
        pfeTopics: pfeResults.slice(0, 5),
      },
    });

    // ✅ renvoyer propre (front friendly)
    res.json({
      _id: saved._id,
      createdAt: saved.createdAt,
      results: saved.results,
    });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/recommendations/history
 */
export async function history(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const list = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(list);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/recommendations/:id
 * ✅ sécurisé: user ne voit que ses propres recommandations
 */
export async function getOne(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rec = await Recommendation.findOne({ _id: req.params.id, userId });
    if (!rec) return res.status(404).json({ message: "Not found" });

    res.json(rec);
  } catch (e) {
    next(e);
  }
}
