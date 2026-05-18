"use client";

import { useJcc } from '@/app/JccProvider';
import { isCountable, isPositive, groupBy, roleFamily, salaryBand, locationBucket, buildEntries, rankTone, normalizeJob } from '@/lib/utils';
import KpiGrid from '@/components/KpiGrid';

export default function Patterns() {
  const { jobs, loading, addJob } = useJcc();

  if (loading) return <div className="p-4">Loading patterns...</div>;

  const countable = jobs.filter(j => isCountable(j.status));
  const responded = countable.filter(j => isPositive(j.status));
  const offers = jobs.filter(j => j.status === "offer");
  const avgMatch = jobs.length ? Math.round(jobs.reduce((s, j) => s + (+j.match_score || 0), 0) / jobs.length) : 0;
  const responseRate = countable.length ? Math.round((responded.length / countable.length) * 100) + "%" : "0%";

  const kpis = [
    { label: "Tracked roles", value: jobs.length, sub: "Total roles in store" },
    { label: "Analysable roles", value: countable.length, sub: "Applications with countable outcomes" },
    { label: "Responses", value: responded.length, sub: "Moved beyond simple submission" },
    { label: "Response rate", value: responseRate, sub: "Overall conversion signal" },
    { label: "Offers", value: offers.length, sub: "Offer-stage outcomes" },
    { label: "Average match", value: `${avgMatch}%`, sub: "Normalized scoring average" }
  ];

  const roleEntries = buildEntries(groupBy(jobs, j => roleFamily(j.role)));
  const salaryEntries = buildEntries(groupBy(jobs, j => salaryBand(j.salary)));
  const locationEntries = buildEntries(groupBy(jobs, j => locationBucket(j.location)));
  const sourceEntries = buildEntries(groupBy(jobs.filter(j => j.source), j => j.source || "Manual"));

  // Outreach Analytics
  const contactedJobs = jobs.filter(j => j.outreach_status && j.outreach_status !== "Not Contacted");
  const outreachCompanyGroups = groupBy(contactedJobs, j => j.company);
  const outreachEntries = Object.keys(outreachCompanyGroups).map(company => {
    const group = outreachCompanyGroups[company];
    const replied = group.filter(j => j.outreach_status === "Replied").length;
    return {
      name: company,
      total: group.length,
      positive: replied,
      rate: Math.round((replied / group.length) * 100)
    };
  }).sort((a, b) => b.rate - a.rate || b.total - a.total);

  const renderBarList = (entries) => {
    if (!entries.length) return <div className="empty">Not enough application history yet.</div>;
    return entries.map(entry => (
      <div key={entry.name} className="list-item">
        <div className="title">{entry.name}</div>
        <div className="small">{entry.positive} positive outcomes from {entry.total} tracked applications</div>
        <div className="bar"><span style={{ width: `${entry.rate}%` }}></span></div>
        <div className="small" style={{ marginTop: '8px' }}><span className={rankTone(entry.rate)}>{entry.rate}% response rate</span></div>
      </div>
    ));
  };

  const handleSimulate = async () => {
    const roles = ["AML Analyst", "KYC Analyst", "Financial Crime Analyst", "Compliance Analyst", "Fraud Analyst", "Risk Analyst", "Transaction Monitoring Analyst"];
    const locations = ["Edinburgh", "Glasgow", "Remote UK", "Scotland"];
    const sources = ["LinkedIn", "Indeed", "Reed", "Manual"];
    const statuses = ["applied", "screening", "rejected", "ghosted", "interview_1", "assessment"];
    const salaries = ["£30,000-£35,000", "£35,000-£40,000", "£40,000-£45,000", "£45,000-£50,000"];
    
    for (let i = 0; i < 30; i++) {
      const role = roles[i % roles.length];
      const location = locations[i % locations.length];
      const source = sources[i % sources.length];
      let status = statuses[i % statuses.length];
      if ((role === "AML Analyst" || role === "Financial Crime Analyst") && i % 3 === 0) status = "screening";
      if ((role === "AML Analyst" || role === "Financial Crime Analyst") && i % 7 === 0) status = "interview_1";
      if ((location === "Edinburgh" || location === "Remote UK") && i % 5 === 0) status = "screening";
      
      const job = normalizeJob({
        id: "SIM-" + Date.now() + "-" + i,
        company: "Simulated Co " + (i + 1),
        role, salary: salaries[i % salaries.length], location, status,
        deadline: "", applied_date: "2026-04-" + String((i % 28) + 1).padStart(2, "0"),
        follow_up_date: "", source_url: "https://example.com/sim-" + i, source,
        notes: "Simulated application for pattern analysis."
      });
      await addJob(job);
    }
  };

  const recommendations = [];
  if (roleEntries.length) recommendations.push(`Prioritise ${roleEntries[0].name} roles first because they show your best conversion pattern.`);
  if (salaryEntries.length) recommendations.push(`Your strongest salary band right now is ${salaryEntries[0].name}.`);
  if (locationEntries.length) recommendations.push(`The best-performing location bucket so far is ${locationEntries[0].name}.`);
  if (sourceEntries.length) recommendations.push(`Your best-performing source at the moment is ${sourceEntries[0].name}.`);
  const lowScoreApplied = jobs.filter(j => (+j.match_score || 0) < 55 && isCountable(j.status)).length;
  if (lowScoreApplied > 0) recommendations.push(`You still have ${lowScoreApplied} lower-fit tracked roles, so tighten your threshold unless upside is strong.`);
  if (!recommendations.length) recommendations.push("More tracked applications are needed before the engine can produce confident recommendations.");

  return (
    <>
      <section className="hero">
        <div>
          <h1>Pattern Lab</h1>
          <p>See where your applications convert best by role family, salary band, location, and source.</p>
        </div>
        <div className="hero-tools">
          <button className="btn btn-primary" onClick={handleSimulate}>Simulate 30 applications</button>
        </div>
      </section>

      <KpiGrid kpis={kpis} />

      <section className="grid three-col">
        <div className="card">
          <h2>Role family response</h2>
          <div className="list">
            {renderBarList(roleEntries)}
          </div>
        </div>
        <div className="card">
          <h2>Salary band response</h2>
          <div className="list">
            {renderBarList(salaryEntries)}
          </div>
        </div>
        <div className="card">
          <h2>Location response</h2>
          <div className="list">
            {renderBarList(locationEntries)}
          </div>
        </div>
      </section>

      <section className="grid two-col" style={{ marginTop: '16px' }}>
        <div className="card">
          <h2>Source performance</h2>
          {!sourceEntries.length ? (
            <div className="empty">Source-level analysis is not ready yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Source</th><th>Tracked</th><th>Positive</th><th>Response Rate</th></tr></thead>
                <tbody>
                  {sourceEntries.map(entry => (
                    <tr key={entry.name}>
                      <td>{entry.name}</td>
                      <td>{entry.total}</td>
                      <td>{entry.positive}</td>
                      <td><span className={rankTone(entry.rate)}>{entry.rate}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card">
          <h2>Recommendations</h2>
          <div className="list">
            {recommendations.map((item, idx) => (
              <div key={idx} className="list-item"><div className="small">{item}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two-col" style={{ marginTop: '16px' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2>Outreach Performance</h2>
          {!outreachEntries.length ? (
            <div className="empty">No direct outreach data yet. Start messaging recruiters in the War Room!</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Contacted</th><th>Replied</th><th>Response Rate</th></tr></thead>
                <tbody>
                  {outreachEntries.map(entry => (
                    <tr key={entry.name}>
                      <td>{entry.name}</td>
                      <td>{entry.total}</td>
                      <td>{entry.positive}</td>
                      <td><span className={rankTone(entry.rate)}>{entry.rate}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
