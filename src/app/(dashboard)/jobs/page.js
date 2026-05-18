"use client";

import { useJcc } from '@/app/JccProvider';
import { summarizeJobs, scoreTone, statusClass, locationBucket, salaryMid, nextStatus } from '@/lib/utils';
import KpiGrid from '@/components/KpiGrid';
import { useState } from 'react';
import Link from 'next/link';

export default function Jobs() {
  const { jobs, loading, updateJob, deleteJob } = useJcc();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [priority, setPriority] = useState("all");
  const [source, setSource] = useState("all");
  const [sortKey, setSortKey] = useState("match_score");
  const [sortDir, setSortDir] = useState("desc");

  if (loading) return <div className="p-4">Loading jobs...</div>;

  const summary = summarizeJobs(jobs);

  const kpis = [
    { label: "Roles loaded", value: summary.total, sub: "Current jobs in store" },
    { label: "High priority", value: jobs.filter(j => j.priority === "high").length, sub: "Strong-fit roles first" },
    { label: "Applied", value: summary.applied, sub: "Moved beyond discovery" },
    { label: "Active pipeline", value: summary.active, sub: "Screening or interviews" },
    { label: "Remote UK", value: jobs.filter(j => locationBucket(j.location) === "Remote UK").length, sub: "Flexible opportunity pool" },
    { label: "Average match", value: `${summary.avgMatch}%`, sub: "Shared scoring average" }
  ];

  const filteredJobs = jobs.filter(job => {
    const hay = JSON.stringify(job).toLowerCase();
    const bucket = locationBucket(job.location);
    return (status === "all" || job.status === status)
      && (location === "all" || bucket === location || job.location === location)
      && (priority === "all" || job.priority === priority)
      && (source === "all" || (job.source || "Manual") === source)
      && (!search || hay.includes(search.toLowerCase()));
  });

  filteredJobs.sort((a, b) => {
    let x, y;
    if (sortKey === "salary") {
      x = salaryMid(a.salary) || 0; y = salaryMid(b.salary) || 0;
    } else if (sortKey === "priority") {
      const rank = { high: 3, medium: 2, low: 1 };
      x = rank[a.priority] || 0; y = rank[b.priority] || 0;
    } else if (sortKey === "deadline") {
      x = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      y = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    } else {
      x = a[sortKey] || ""; y = b[sortKey] || "";
    }
    
    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();
    if (x < y) return sortDir === "asc" ? -1 : 1;
    if (x > y) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "match_score" ? "desc" : "asc");
    }
  };

  const handleAdvance = (job) => {
    const next = nextStatus(job.status || "discovered");
    const updated = {
      ...job,
      status: next,
      applied_date: (!job.applied_date && (job.status === "discovered" || next === "applied"))
        ? new Date().toISOString().slice(0, 10)
        : job.applied_date
    };
    updateJob(updated);
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Live Jobs</h1>
          <p>Search, sort, filter, and rank your tracked jobs from the same shared store.</p>
        </div>
      </section>

      <KpiGrid kpis={kpis} />

      <section className="card">
        <h2>Search and filters</h2>
        <div className="controls">
          <input type="text" placeholder="Search company, role, location..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="discovered">Discovered</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview_1">Interview 1</option>
            <option value="interview_2">Interview 2</option>
            <option value="assessment">Assessment</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="ghosted">Ghosted</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <select value={location} onChange={e => setLocation(e.target.value)}>
            <option value="all">All locations</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="Glasgow">Glasgow</option>
            <option value="Scotland">Scotland</option>
            <option value="Remote UK">Remote UK</option>
            <option value="Other">Other</option>
          </select>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
          <select value={source} onChange={e => setSource(e.target.value)}>
            <option value="all">All sources</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Indeed">Indeed</option>
            <option value="Reed">Reed</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </section>

      <section className="card" style={{ marginTop: '16px' }}>
        <h2>Ranked job flow</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('company')}>Company</th>
                <th className="sortable" onClick={() => handleSort('role')}>Role</th>
                <th className="sortable" onClick={() => handleSort('salary')}>Salary</th>
                <th className="sortable" onClick={() => handleSort('location')}>Location</th>
                <th className="sortable" onClick={() => handleSort('match_score')}>Match</th>
                <th className="sortable" onClick={() => handleSort('priority')}>Priority</th>
                <th className="sortable" onClick={() => handleSort('status')}>Status</th>
                <th className="sortable" onClick={() => handleSort('deadline')}>Deadline</th>
                <th className="sortable" onClick={() => handleSort('source')}>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!filteredJobs.length ? (
                <tr><td colSpan="10"><div className="empty">No jobs match the current filters.</div></td></tr>
              ) : filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>
                    <Link href={`/jobs/${job.id}`} style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{job.role}</Link>
                    <div className="notes" style={{ marginTop: '4px' }}>{job.notes}</div>
                  </td>
                  <td>{job.salary}</td>
                  <td>{job.location}</td>
                  <td className={`score ${scoreTone(job.match_score || 0)}`}>{job.match_score || 0}%</td>
                  <td><span className={`priority ${job.priority==='high'?'p-high':job.priority==='medium'?'p-medium':'p-low'}`}>{job.priority}</span></td>
                  <td><span className={`pill ${statusClass(job.status || 'discovered')}`}>{job.status || 'discovered'}</span></td>
                  <td>{job.deadline}</td>
                  <td>{job.source || 'Manual'}</td>
                  <td>
                    <div className="actions">
                      <button className="mini-btn" onClick={() => updateJob({ ...job, status: 'applied', applied_date: job.applied_date || new Date().toISOString().slice(0,10) })}>Set applied</button>
                      <button className="mini-btn" onClick={() => handleAdvance(job)}>Advance</button>
                      <button className="mini-btn" onClick={() => deleteJob(job.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
