"use client";

import { useJcc } from '@/app/JccProvider';
import { summarizeJobs, scoreTone, statusClass, nextStatus } from '@/lib/utils';
import KpiGrid from '@/components/KpiGrid';
import { useState } from 'react';

export default function Applications() {
  const { jobs, loading, addJob, updateJob, deleteJob, clearJobs } = useJcc();
  
  const [form, setForm] = useState({
    id: "", company: "", role: "", salary: "", location: "", status: "discovered",
    source: "Manual", deadline: "", applied_date: "", follow_up_date: "", source_url: "", notes: ""
  });
  const [message, setMessage] = useState("");

  if (loading) return <div className="p-4">Loading applications...</div>;

  const summary = summarizeJobs(jobs);
  const due = jobs.filter(j => j.follow_up_date && new Date(j.follow_up_date) <= new Date(Date.now() + 86400000)).length;

  const kpis = [
    { label: "Tracked applications", value: summary.total, sub: "Current rows in the store" },
    { label: "Submitted", value: summary.applied, sub: "Moved beyond discovery" },
    { label: "Active stages", value: summary.active, sub: "Screening or interviews" },
    { label: "Offers", value: summary.offers, sub: "Offer-stage outcomes" },
    { label: "Closed / lost", value: summary.rejected, sub: "Rejected, ghosted, or withdrawn" },
    { label: "Follow-ups due", value: due, sub: "Actions due by tomorrow" }
  ];

  const followUps = jobs
    .filter(j => j.follow_up_date)
    .filter(j => new Date(j.follow_up_date) <= new Date(Date.now() + 86400000))
    .sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date));

  const rows = [...jobs].sort((a, b) => (a.applied_date || "9999-99-99").localeCompare(b.applied_date || "9999-99-99"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = { ...form };
    if (jobData.status !== "discovered" && !jobData.applied_date) {
      jobData.applied_date = new Date().toISOString().slice(0, 10);
    }
    
    if (jobData.id) {
      await updateJob(jobData);
      setMessage("Application updated.");
    } else {
      await addJob(jobData);
      setMessage("Application added.");
    }
    setForm({ id: "", company: "", role: "", salary: "", location: "", status: "discovered", source: "Manual", deadline: "", applied_date: "", follow_up_date: "", source_url: "", notes: "" });
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (job) => {
    setForm({
      id: job.id || "", company: job.company || "", role: job.role || "", salary: job.salary || "", location: job.location || "",
      status: job.status || "discovered", source: job.source || "Manual", deadline: job.deadline || "", applied_date: job.applied_date || "",
      follow_up_date: job.follow_up_date || "", source_url: job.source_url || "", notes: job.notes || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdvance = (job) => {
    const next = nextStatus(job.status || "discovered");
    updateJob({
      ...job,
      status: next,
      applied_date: (job.status === "discovered" && !job.applied_date) ? new Date().toISOString().slice(0, 10) : job.applied_date
    });
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Applications</h1>
          <p>Add, edit, move, and review jobs through discovery, application, interviews, and outcomes.</p>
        </div>
        <div className="hero-tools">
          <button className="btn btn-danger" onClick={() => { if(confirm('Clear all jobs?')) clearJobs(); }}>Clear all jobs</button>
        </div>
      </section>

      <KpiGrid kpis={kpis} />

      <section className="grid two-col">
        <div className="card">
          <h2>Add or update application</h2>
          <div className="meta">This writes into the same job store used by every other module.</div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div>
              <label>Company</label>
              <input name="company" required placeholder="NatWest" value={form.company} onChange={handleChange} />
            </div>
            <div>
              <label>Role</label>
              <input name="role" required placeholder="Financial Crime Analyst" value={form.role} onChange={handleChange} />
            </div>
            <div>
              <label>Salary</label>
              <input name="salary" placeholder="£35,000-£42,000" value={form.salary} onChange={handleChange} />
            </div>
            <div>
              <label>Location</label>
              <input name="location" placeholder="Edinburgh / Glasgow / Remote UK" value={form.location} onChange={handleChange} />
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
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
            </div>
            <div>
              <label>Source</label>
              <select name="source" value={form.source} onChange={handleChange}>
                <option value="Manual">Manual</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Reed">Reed</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
            </div>
            <div>
              <label>Applied date</label>
              <input name="applied_date" type="date" value={form.applied_date} onChange={handleChange} />
            </div>
            <div>
              <label>Follow-up date</label>
              <input name="follow_up_date" type="date" value={form.follow_up_date} onChange={handleChange} />
            </div>
            <div>
              <label>Source URL</label>
              <input name="source_url" type="url" placeholder="https://..." value={form.source_url} onChange={handleChange} />
            </div>
            <div className="full">
              <label>Notes</label>
              <textarea name="notes" placeholder="JD keywords, recruiter notes, sponsorship hints, interview notes..." value={form.notes} onChange={handleChange}></textarea>
            </div>
            <div className="full actions">
              <button className="btn btn-primary" type="submit">Save application</button>
              <button className="btn btn-secondary" type="button" onClick={() => setForm({ id: "", company: "", role: "", salary: "", location: "", status: "discovered", source: "Manual", deadline: "", applied_date: "", follow_up_date: "", source_url: "", notes: "" })}>Reset form</button>
            </div>
          </form>
          {message && <div className="success" style={{ display: 'block' }}>{message}</div>}
        </div>

        <div className="grid">
          <div className="card">
            <h2>Follow-ups due</h2>
            <div className="list">
              {!followUps.length ? (
                <div className="empty">No follow-ups due right now.</div>
              ) : followUps.map(job => (
                <div key={job.id} className="list-item">
                  <div className="title">{job.company} — {job.role}</div>
                  <div className="small">Follow up by {job.follow_up_date}</div>
                  <div className="small">Status: {job.status}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>Pipeline rules</h2>
            <div className="list">
              <div className="list-item"><div className="title">Use one source of truth</div><div className="small">Every page reads the same store.</div></div>
              <div className="list-item"><div className="title">Advance stage fast</div><div className="small">Push serious roles forward immediately after each employer touchpoint.</div></div>
              <div className="list-item"><div className="title">Keep notes practical</div><div className="small">Track recruiter names, deadlines, interview signals, and why the role matters.</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: '16px' }}>
        <h2>Application log</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Match</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Follow-up</th>
                <th>Deadline</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length ? (
                <tr><td colSpan="9"><div className="empty">No applications tracked yet.</div></td></tr>
              ) : rows.map(job => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>
                    <a href={job.source_url || "#"} target="_blank" rel="noreferrer">{job.role}</a>
                    <div className="notes">{job.location} · {job.salary}</div>
                  </td>
                  <td className={`score ${scoreTone(job.match_score || 0)}`}>{job.match_score || 0}%</td>
                  <td><span className={`pill ${statusClass(job.status || 'discovered')}`}>{job.status || 'discovered'}</span></td>
                  <td>{job.applied_date}</td>
                  <td>{job.follow_up_date}</td>
                  <td>{job.deadline}</td>
                  <td>{job.source || 'Manual'}</td>
                  <td>
                    <div className="actions">
                      <button className="mini-btn" onClick={() => handleEdit(job)}>Edit</button>
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
