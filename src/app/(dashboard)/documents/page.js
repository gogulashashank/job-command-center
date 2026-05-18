"use client";

import { useJcc } from '@/app/JccProvider';
import { typeClass } from '@/lib/utils';
import KpiGrid from '@/components/KpiGrid';
import { useState } from 'react';

const starterDocs = [
  { id: "DOC-001", name: "Banking CV", type: "resume", version: "v1", target: "Banking / Financial Crime", notes: "Lead with AML/KYC, sanctions, SARs, transaction monitoring, SQL reporting." },
  { id: "DOC-002", name: "Fintech CV", type: "resume", version: "v1", target: "Fintech / Fraud", notes: "Lead with fraud operations, investigations, anomaly detection, controls, analytics." },
  { id: "DOC-003", name: "Compliance CV", type: "resume", version: "v1", target: "Compliance / Risk", notes: "Lead with governance, reporting, documentation, dashboards, and operational controls." },
  { id: "DOC-004", name: "Banking Cover Letter", type: "cover-letter", version: "v1", target: "Banks / Financial Services", notes: "Positioning around AML/KYC, risk operations, reporting, and long-term finance career fit." },
  { id: "DOC-005", name: "ICA AML Notes", type: "certification", version: "in-progress", target: "ICA AML Level 2", notes: "CDD, EDD, sanctions, SARs, POCA, MLR 2017, JMLSG, typologies." }
];

export default function Documents() {
  const { docs, loading, addDoc, updateDoc, deleteDoc, clearDocs, seedDocs } = useJcc();

  const [form, setForm] = useState({ id: "", name: "", type: "resume", version: "", target: "", notes: "" });
  const [message, setMessage] = useState("");

  if (loading) return <div className="p-4">Loading documents...</div>;

  const kpis = [
    { label: "Total assets", value: docs.length, sub: "All saved documents" },
    { label: "Resume variants", value: docs.filter(d => d.type === "resume").length, sub: "Employer-specific CVs" },
    { label: "Cover letters", value: docs.filter(d => d.type === "cover-letter").length, sub: "Reusable tailored letters" },
    { label: "Certification assets", value: docs.filter(d => d.type === "certification").length, sub: "Study and exam materials" },
    { label: "Notes", value: docs.filter(d => d.type === "notes").length, sub: "Talking points and prep assets" },
    { label: "Readiness", value: docs.length ? "Active" : "Empty", sub: "Current document system state" }
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await updateDoc(form);
      setMessage("Document updated.");
    } else {
      await addDoc({ ...form, id: 'DOC-' + Date.now() });
      setMessage("Document added.");
    }
    setForm({ id: "", name: "", type: "resume", version: "", target: "", notes: "" });
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (doc) => {
    setForm(doc);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Documents</h1>
          <p>Store CV variants, cover letters, certification notes, and reusable job-search assets in one place.</p>
        </div>
        <div className="hero-tools">
          <button className="btn btn-primary" onClick={() => seedDocs(starterDocs)}>Load starter docs</button>
          <button className="btn btn-danger" onClick={() => { if(confirm('Clear all docs?')) clearDocs(); }}>Clear docs</button>
        </div>
      </section>

      <KpiGrid kpis={kpis} />

      <section className="grid two-col">
        <div className="card">
          <h2>Document library</h2>
          <div className="list">
            {!docs.length ? (
              <div className="empty">No assets saved yet. Load starter docs or add your first document.</div>
            ) : docs.map(doc => (
              <div key={doc.id} className="list-item">
                <div className="title">
                  <span className={`pill ${typeClass(doc.type)}`}>{doc.type}</span> {doc.name}
                </div>
                <div className="small"><strong>Version:</strong> {doc.version}</div>
                <div className="small"><strong>Target:</strong> {doc.target}</div>
                <div className="small" style={{ marginTop: '8px' }}>{doc.notes}</div>
                <div style={{ marginTop: '10px' }} className="actions">
                  <button className="mini-btn" onClick={() => handleEdit(doc)}>Edit</button>
                  <button className="mini-btn" onClick={() => deleteDoc(doc.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Add or update document</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div>
              <label>Document name</label>
              <input name="name" required placeholder="Banking CV v2" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="resume">Resume</option>
                <option value="cover-letter">Cover Letter</option>
                <option value="certification">Certification</option>
                <option value="notes">Notes</option>
              </select>
            </div>
            <div>
              <label>Version</label>
              <input name="version" placeholder="v1 / v2 / tailored" value={form.version} onChange={handleChange} />
            </div>
            <div>
              <label>Target use</label>
              <input name="target" placeholder="Banking / Fintech / ICA" value={form.target} onChange={handleChange} />
            </div>
            <div className="full">
              <label>Notes</label>
              <textarea name="notes" placeholder="What angle does this asset push?" value={form.notes} onChange={handleChange}></textarea>
            </div>
            <div className="full actions">
              <button className="btn btn-primary" type="submit">Save asset</button>
              <button className="btn btn-secondary" type="button" onClick={() => setForm({ id: "", name: "", type: "resume", version: "", target: "", notes: "" })}>Reset</button>
            </div>
          </form>
          {message && <div className="success" style={{ display: 'block' }}>{message}</div>}
        </div>
      </section>

      <section className="grid three-col" style={{ marginTop: '16px' }}>
        <div className="card">
          <h2>Resume angles</h2>
          <div className="list">
            <div className="list-item"><div className="title">Banking CV</div><div className="small">Lead with AML/KYC, transaction monitoring, sanctions, SARs, reporting, and controls.</div></div>
            <div className="list-item"><div className="title">Fintech CV</div><div className="small">Lead with fraud operations, investigations, anomaly detection, workflow improvements, and analytics.</div></div>
            <div className="list-item"><div className="title">Compliance CV</div><div className="small">Lead with governance, documentation, dashboards, and operational controls.</div></div>
          </div>
        </div>
        <div className="card">
          <h2>Certification tracker</h2>
          <div className="list">
            <div className="list-item">
              <div className="title">ICA AML Level 2</div>
              <div className="small">Track progress and reference it in relevant job documents.</div>
              <div className="bar"><span style={{ width: '45%' }}></span></div>
            </div>
            <div className="list-item">
              <div className="title">Study blocks</div>
              <div className="small">CDD, EDD, SARs, sanctions, POCA, MLR 2017, JMLSG, and risk indicators.</div>
            </div>
          </div>
        </div>
        <div className="card">
          <h2>Core strengths</h2>
          <div className="tag-row">
            <span className="tag">AML</span><span className="tag">KYC</span><span className="tag">CDD / EDD</span>
            <span className="tag">Transaction Monitoring</span><span className="tag">Sanctions</span><span className="tag">SAR</span>
            <span className="tag">Fraud Detection</span><span className="tag">SQL</span><span className="tag">Python</span>
            <span className="tag">Power BI</span><span className="tag">Risk Reporting</span><span className="tag">Governance</span>
          </div>
        </div>
      </section>
    </>
  );
}
