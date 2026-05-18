export const resumeProfile = {
  keywords: [
    "aml", "kyc", "cdd", "edd", "transaction monitoring", "sanctions", "sar", "fraud",
    "financial crime", "risk", "compliance", "sql", "python", "power bi", "dashboard",
    "governance", "fca", "controls", "investigations"
  ],
  priorityKeywords: [
    "aml", "kyc", "financial crime", "transaction monitoring", "sanctions", "sar", "fraud", "sql", "power bi"
  ],
  preferredLocations: ["edinburgh", "glasgow", "scotland", "remote uk", "united kingdom"]
};

export function matchScore(job) {
  const text = [job.company || "", job.role || "", job.location || "", job.notes || ""].join(" ").toLowerCase();
  let score = 0;
  resumeProfile.keywords.forEach(k => { if (text.includes(k)) score += 4; });
  resumeProfile.priorityKeywords.forEach(k => { if (text.includes(k)) score += 6; });
  if (resumeProfile.preferredLocations.some(loc => text.includes(loc))) score += 10;
  if (/analyst|risk|compliance|fraud|aml|kyc/.test(text)) score += 12;
  return Math.min(score, 100);
}

export function priority(score) {
  if (score >= 85) return "high";
  if (score >= 65) return "medium";
  return "low";
}

export function scoreTone(score) {
  if (score >= 85) return "high";
  if (score >= 65) return "mid";
  return "low";
}

export function statusClass(status = "discovered") {
  return "s-" + String(status).replace(/\s+/g, "_");
}

export function roleFamily(role = "") {
  const r = role.toLowerCase();
  if (r.includes("financial crime")) return "Financial Crime";
  if (r.includes("transaction monitoring")) return "Transaction Monitoring";
  if (r.includes("aml")) return "AML";
  if (r.includes("kyc")) return "KYC";
  if (r.includes("fraud")) return "Fraud";
  if (r.includes("compliance")) return "Compliance";
  if (r.includes("risk")) return "Risk";
  return "Other";
}

export function salaryMid(salary = "") {
  const nums = String(salary).match(/\d[\d,]*/g);
  if (!nums || !nums.length) return null;
  const vals = nums.map(n => parseInt(n.replace(/,/g, ""), 10));
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function salaryBand(salary = "") {
  const mid = salaryMid(salary);
  if (!mid) return "Unknown";
  if (mid < 30000) return "<£30k";
  if (mid < 35000) return "£30k-35k";
  if (mid < 40000) return "£35k-40k";
  if (mid < 45000) return "£40k-45k";
  return "£45k+";
}

export function locationBucket(location = "") {
  const l = location.toLowerCase();
  if (l.includes("edinburgh")) return "Edinburgh";
  if (l.includes("glasgow")) return "Glasgow";
  if (l.includes("remote")) return "Remote UK";
  if (l.includes("scotland")) return "Scotland";
  return "Other";
}

export function isPositive(status = "") {
  return ["screening", "interview_1", "interview_2", "assessment", "offer"].includes(status);
}

export function isCountable(status = "") {
  return ["applied", "screening", "interview_1", "interview_2", "assessment", "offer", "rejected", "ghosted", "withdrawn"].includes(status);
}

export function computeRate(items) {
  const base = items.filter(j => isCountable(j.status));
  if (!base.length) return null;
  const positive = base.filter(j => isPositive(j.status)).length;
  return { total: base.length, positive, rate: Math.round((positive / base.length) * 100) };
}

export function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function summarizeJobs(jobs = []) {
  const total = jobs.length;
  const applied = jobs.filter(j => j.status && j.status !== "discovered").length;
  const active = jobs.filter(j => ["screening", "interview_1", "interview_2", "assessment"].includes(j.status)).length;
  const offers = jobs.filter(j => j.status === "offer").length;
  const rejected = jobs.filter(j => ["rejected", "ghosted", "withdrawn"].includes(j.status)).length;
  const avgMatch = total ? Math.round(jobs.reduce((s, j) => s + (+j.match_score || 0), 0) / total) : 0;
  return { total, applied, active, offers, rejected, avgMatch };
}

export function nextStatus(current) {
  const flow = ["discovered", "applied", "screening", "interview_1", "interview_2", "assessment", "offer"];
  const idx = flow.indexOf(current);
  if (idx === -1 || idx === flow.length - 1) return current;
  return flow[idx + 1];
}

export function normalizeJob(job) {
  const score = job.match_score || matchScore(job);
  return { ...job, match_score: score, priority: priority(score) };
}

export function normalizeJobs(jobs = []) {
  return jobs.map(normalizeJob);
}

export function rankTone(rate) {
  if (rate >= 60) return "good";
  if (rate >= 35) return "warn";
  return "bad";
}

export function typeClass(type) {
  if (type === "resume") return "doc-resume";
  if (type === "cover-letter") return "doc-cover-letter";
  if (type === "certification") return "doc-certification";
  return "doc-notes";
}

export function buildEntries(groups) {
  return Object.entries(groups)
    .map(([name, items]) => {
      const stats = computeRate(items);
      return stats ? { name, ...stats } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.rate - a.rate);
}
