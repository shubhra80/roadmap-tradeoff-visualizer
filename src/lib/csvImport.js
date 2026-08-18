import Papa from 'papaparse'

const REQUIRED_COLUMNS = ['title', 'reach', 'impact', 'confidence', 'effort']
const MAX_ROWS = 100

export function parseBacklogCSV(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })

  if (result.data.length === 0) {
    return { features: [], errors: [{ row: null, message: 'No rows found in this file.' }] }
  }

  if (result.data.length > MAX_ROWS) {
    return {
      features: [],
      errors: [
        {
          row: null,
          message: `This file has ${result.data.length} rows, which exceeds the ${MAX_ROWS}-row limit. Please split it into smaller batches or trim it to your most important items.`,
        },
      ],
    }
  }

  const headers = result.meta.fields || []
  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col))
  if (missing.length > 0) {
    return {
      features: [],
      errors: [{ row: null, message: `Missing required column(s): ${missing.join(', ')}` }],
    }
  }

  const features = []
  const errors = []

  result.data.forEach((row, index) => {
    const rowNum = index + 2 // +2 accounts for the header row and 1-indexing
    const title = (row.title || '').trim()
    const reach = Number(row.reach)
    const impact = Number(row.impact)
    const confidencePct = Number(row.confidence)
    const effort = Number(row.effort)

    if (!title) {
      errors.push({ row: rowNum, message: 'Missing title' })
      return
    }
    if (!Number.isFinite(reach) || reach < 0) {
      errors.push({ row: rowNum, message: `Invalid reach: "${row.reach}"` })
      return
    }
    if (!Number.isFinite(impact) || impact <= 0) {
      errors.push({ row: rowNum, message: `Invalid impact: "${row.impact}"` })
      return
    }
    if (!Number.isFinite(confidencePct) || confidencePct < 0 || confidencePct > 100) {
      errors.push({ row: rowNum, message: `Invalid confidence, must be 0-100: "${row.confidence}"` })
      return
    }
    if (!Number.isFinite(effort) || effort <= 0) {
      errors.push({ row: rowNum, message: `Invalid effort: "${row.effort}"` })
      return
    }

    features.push({
      id: features.length + 1,
      title,
      theme: (row.theme || '').trim(),
      blurb: (row.blurb || '').trim(),
      reach,
      impact,
      confidence: confidencePct / 100,
      effort,
    })
  })

  return { features, errors }
}

export function generateSampleCSV() {
  const header = 'title,theme,blurb,reach,impact,confidence,effort'
  const rows = [
    'AI Meeting Summarizer,AI/Automation,Auto-generates action items from call transcripts,40,2,80,2',
    'Smart Notification Digest,Retention,Bundles alerts into one daily digest to cut noise,60,1,100,1',
    'SSO / SCIM Provisioning,Enterprise/Compliance,Enterprise login + automated user provisioning,15,3,100,3',
  ]
  return [header, ...rows].join('\n')
}