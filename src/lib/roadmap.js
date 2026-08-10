export const CAPACITY_PER_QUARTER = 8;
export const QUARTER_LABELS = ["Q1", "Q2", "Q3", "Q4"];

export function riceScore({ reach, impact, confidence, effort }) {
  if (!effort) return 0;
  return (reach * impact * confidence) / effort;
}

// Ranks features by RICE score, then greedily packs them into fixed-capacity
// quarters in rank order. A quarter always accepts at least one item even if
// that item alone exceeds capacity; anything that doesn't fit once all four
// quarters are occupied spills into the "Later" bucket.
export function buildRoadmap(features, capacityPerQuarter = CAPACITY_PER_QUARTER) {
  const ranked = features
    .map((feature) => ({ feature, score: riceScore(feature) }))
    .sort((a, b) => b.score - a.score);

  const quarters = QUARTER_LABELS.map((label) => ({
    label,
    items: [],
    usedEffort: 0,
    capacity: capacityPerQuarter,
  }));
  const later = [];

  let quarterIndex = 0;

  for (const entry of ranked) {
    const effort = entry.feature.effort;

    while (
      quarterIndex < quarters.length - 1 &&
      quarters[quarterIndex].items.length > 0 &&
      quarters[quarterIndex].usedEffort + effort > capacityPerQuarter
    ) {
      quarterIndex += 1;
    }

    const quarter = quarters[quarterIndex];
    const fitsCurrentQuarter =
      quarter.items.length === 0 || quarter.usedEffort + effort <= capacityPerQuarter;

    if (fitsCurrentQuarter) {
      quarter.items.push(entry);
      quarter.usedEffort += effort;
    } else {
      later.push(entry);
    }
  }

  return { quarters, later };
}
