// Converts the quarters + later structure from buildRoadmap() into a
// downloadable CSV with every field, in ranked order.
export function generateRoadmapCSV(quarters, later) {
  const header = ["title", "theme", "quarter", "reach", "impact", "confidence", "effort", "score"]
  const rows = []

  quarters.forEach((quarter) => {
    quarter.items.forEach(({ feature, score }) => {
      rows.push([
        feature.title,
        feature.theme || "",
        quarter.label,
        feature.reach,
        feature.impact,
        Math.round(feature.confidence * 100),
        feature.effort,
        score.toFixed(1),
      ])
    })
  })

  later.forEach(({ feature, score }) => {
    rows.push([
      feature.title,
      feature.theme || "",
      "Later",
      feature.reach,
      feature.impact,
      Math.round(feature.confidence * 100),
      feature.effort,
      score.toFixed(1),
    ])
  })

  const escapeCell = (cell) => {
    const str = String(cell)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }

  const csvLines = [header, ...rows].map((row) => row.map(escapeCell).join(","))
  return csvLines.join("\n")
}

export function downloadRoadmapCSV(quarters, later) {
  const csv = generateRoadmapCSV(quarters, later)
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "ranked_roadmap.csv"
  a.click()
  URL.revokeObjectURL(url)
}