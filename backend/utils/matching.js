export function computeMatchScore(studentSkillsMap, requiredSkills) {
  // studentSkillsMap: { skillId: level }
  // requiredSkills: [{ skillId, weight, minLevel }]
  let totalWeight = 0;
  let score = 0;
  let missing = [];

  for (const r of requiredSkills) {
    totalWeight += r.weight;
    const haveLevel = studentSkillsMap[r.skillId.toString()] || 0;

    if (haveLevel >= r.minLevel) {
      score += r.weight * (haveLevel / 5); // normalize
    } else {
      missing.push({ skillId: r.skillId.toString(), need: r.minLevel, have: haveLevel });
    }
  }

  if (totalWeight === 0) return { score: 0, missing };
  return { score: Math.round((score / totalWeight) * 100), missing }; // 0..100
}
