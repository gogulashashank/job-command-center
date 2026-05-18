"use client";

import { useJcc } from '@/app/JccProvider';
import { summarizeJobs, scoreTone, statusClass, resumeProfile } from '@/lib/utils';
import KpiGrid from '@/components/KpiGrid';
import { useState } from 'react';

const starterJobs = [
  { company: "NatWest", role: "Financial Crime Analyst", salary: "£36,000-£44,000", location: "Edinburgh", status: "applied", deadline: "2026-05-12", applied_date: "2026-04-28", follow_up_date: "2026-05-05", source_url: "https://example.com/natwest-fc", source: "LinkedIn", notes: "Financial crime investigations, SQL reporting, controls.", match_score: 91 },
  { company: "Standard Chartered", role: "KYC Analyst", salary: "£34,000-£40,000", location: "Glasgow", status: "screening", deadline: "2026-05-09", applied_date: "2026-04-26", follow_up_date: "2026-05-03", source_url: "https://example.com/sc-kyc", source: "Reed", notes: "CDD, EDD, client due diligence, governance reporting.", match_score: 88 }
];

export default function Dashboard() {
  const { jobs, loading, seedJobs } = useJcc();
  const [seeding, setSeeding] = useState(false);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  const summary = summarizeJobs(jobs);
  const due = jobs.filter(j => j.follow_up_date && new Date(j.follow_up_date) <= new Date(Date.now() + 86400000)).length;

  const kpis = [
    { label: "Tracked roles", value: summary.total, sub: "Current jobs in your system" },
    { label: "Applications sent", value: summary.applied, sub: "Moved beyond discovery" },
    { label: "Active interviews", value: summary.active, sub: "Screening and interview-stage roles" },
    { label: "Offers", value: summary.offers, sub: "Live offer count" },
    { label: "Follow-ups due", value: due, sub: "Actions due by tomorrow" },
    { label: "Average match", value: `${summary.avgMatch}%`, sub: "Resume-to-job alignment average" }
  ];

  // Top ranked roles - Ensure unique companies
  const uniqueCompanies = new Set();
  const top = [];
  const sortedJobs = [...jobs].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  for (const j of sortedJobs) {
    if (!uniqueCompanies.has(j.company)) {
      top.push(j);
      uniqueCompanies.add(j.company);
      if (top.length === 6) break;
    }
  }

  let queue = [];
  const followUps = [...jobs].filter(j => j.follow_up_date).sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date)).slice(0, 3);
  const deadlines = [...jobs].filter(j => j.deadline).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);
  
  followUps.forEach(j => queue.push(`Follow up with ${j.company} for ${j.role} on ${j.follow_up_date}.`));
  deadlines.forEach(j => queue.push(`Review deadline for ${j.company} — ${j.role} by ${j.deadline}.`));
  if (!jobs.length) queue.push("Seed starter data so the dashboard can begin ranking live opportunities.");
  queue.push("Prioritise roles scoring 85+ unless brand value or stability justifies an exception.");
  
  // Deduplicate queue messages
  queue = [...new Set(queue)];

  const stages = [
    ["discovered", "Jobs identified but not yet submitted"],
    ["applied", "Applications sent and waiting"],
    ["screening", "Recruiter or first screening active"],
    ["interview_1", "First interview stage"],
    ["interview_2", "Second interview stage"],
    ["assessment", "Task or technical round"],
    ["offer", "Offer received"],
    ["rejected", "Rejected by employer"],
    ["ghosted", "No reply after reasonable follow-up"],
    ["withdrawn", "Manually withdrawn"]
  ];

  const handleSeed = async () => {
    setSeeding(true);
    await seedJobs(starterJobs);
    setSeeding(false);
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Dashboard</h1>
          <p>Unified snapshot of your pipeline, top-fit jobs, action queue, keywords, and stage distribution.</p>
        </div>
        <div className="hero-tools">
          <button className="btn btn-primary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Loading...' : 'Load starter data'}
          </button>
        </div>
      </section>

      <KpiGrid kpis={kpis} />

      <section className="grid two-col">
        <div className="card">
          <h2>Top ranked roles</h2>
          <div className="meta">Best-fit jobs based on keyword alignment, preferred locations, and role relevance.</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Match</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {!top.length ? (
                  <tr><td colSpan="6"><div className="empty">No jobs loaded yet. Click <strong>Load starter data</strong>.</div></td></tr>
                ) : top.map(j => (
                  <tr key={j.id}>
                    <td>{j.company}</td>
                    <td>
                      <a href={j.source_url || "#"} target="_blank" rel="noreferrer">{j.role}</a>
                      <div className="notes">{j.salary}</div>
                    </td>
                    <td className={`score ${scoreTone(j.match_score || 0)}`}>{j.match_score || 0}%</td>
                    <td><span className={`pill ${statusClass(j.status)}`}>{j.status || 'discovered'}</span></td>
                    <td>{j.location}</td>
                    <td>{j.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Action queue</h2>
            <div className="list">
              {queue.slice(0, 6).map((item, idx) => (
                <div key={idx} className="list-item">
                  <div className="title">{item}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>Keyword engine</h2>
            <div className="meta">Priority keywords used by the scoring model.</div>
            <div className="tag-row">
              {resumeProfile.priorityKeywords.map(k => (
                <span key={k} className="tag">{k.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid two-col" style={{ marginTop: '16px' }}>
        <div className="card">
          <h2>Pipeline snapshot</h2>
          <div className="list">
            {stages.map(([stage, desc]) => (
              <div key={stage} className="list-item">
                <div className="title">
                  <span className={`pill ${statusClass(stage)}`}>{stage}</span> 
                  <span style={{ marginLeft: '8px' }}>{jobs.filter(j => j.status === stage).length}</span>
                </div>
                <div className="small">{desc}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h2>Career fit profile</h2>
          <div className="list">
            <div className="list-item">
              <div className="title">AML / KYC / Financial Crime</div>
              <div className="bar"><span style={{ width: '93%' }}></span></div>
            </div>
            <div className="list-item">
              <div className="title">Fraud / Investigations / Risk Ops</div>
              <div className="bar"><span style={{ width: '89%' }}></span></div>
            </div>
            <div className="list-item">
              <div className="title">SQL / Power BI / Analytics</div>
              <div className="bar"><span style={{ width: '84%' }}></span></div>
            </div>
            <div className="list-item">
              <div className="title">Scotland / Remote UK targeting</div>
              <div className="bar"><span style={{ width: '86%' }}></span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
