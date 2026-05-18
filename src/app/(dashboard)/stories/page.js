"use client";

import { useJcc } from '@/app/JccProvider';
import { useState } from 'react';

export default function Stories() {
  const { stories = [], loading, addStory, deleteStory } = useJcc();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    competency: "Leadership",
    metric: "",
    hook: "",
    pivots: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    learning: ""
  });

  if (loading) return <div className="p-4">Loading STAR stories...</div>;

  const competencies = ["All", "Leadership", "Conflict Resolution", "Analytics & Problem Solving", "Adaptability", "Communication"];

  const filteredStories = stories.filter(s => filter === "All" || s.competency === filter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addStory({ ...form, created_at: new Date().toISOString() });
    setIsAdding(false);
    setForm({ title: "", competency: "Leadership", metric: "", hook: "", pivots: "", situation: "", task: "", action: "", result: "", learning: "" });
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Top 1% Interview Engine</h1>
          <p>Master the STAR-L method, build networking hooks, and learn to pivot one story to answer multiple behavioral questions.</p>
        </div>
        <div className="hero-tools">
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Close Framework Builder" : "Build New Story"}
          </button>
        </div>
      </section>

      {isAdding && (
        <section className="card" style={{ marginBottom: "24px", borderTop: "4px solid var(--primary)", padding: "24px" }}>
          <h2 style={{ marginBottom: "20px" }}>The Framework Builder</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Story Title / Theme</label>
                <input required style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Identifying the layering scheme" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Core Competency</label>
                <select style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.competency} onChange={e => setForm({...form, competency: e.target.value})}>
                  {competencies.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px', padding: '20px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text)', marginBottom: '6px', fontWeight: '600' }}>Quantifiable Metric <span style={{ color: "var(--primary)"}}>★</span></label>
                <input required style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--primary)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.metric} onChange={e => setForm({...form, metric: e.target.value})} placeholder="e.g. £45k intercepted" />
                <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-sec)', fontSize: '12px' }}>Top 1% stories lead with hard numbers.</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text)', marginBottom: '6px', fontWeight: '600' }}>Networking Hook (1 Sentence) <span style={{ color: "var(--primary)"}}>★</span></label>
                <input required style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.hook} onChange={e => setForm({...form, hook: e.target.value})} placeholder="e.g. I recently prevented £45k in fraud by automating..." />
                <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-sec)', fontSize: '12px' }}>Copy-paste this into LinkedIn messages to grab a recruiter's attention.</small>
              </div>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Pivot Questions (Comma separated)</label>
              <input style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.pivots} onChange={e => setForm({...form, pivots: e.target.value})} placeholder="e.g. Tell me about a time you solved a complex problem, Tell me about a time you worked under pressure" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Situation <small style={{fontWeight: 'normal'}}>(Context & background)</small></label>
                <textarea required rows="4" style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.situation} onChange={e => setForm({...form, situation: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Task <small style={{fontWeight: 'normal'}}>(Your responsibility & challenge)</small></label>
                <textarea required rows="4" style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.task} onChange={e => setForm({...form, task: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Action <small style={{fontWeight: 'normal'}}>(What YOU specifically did)</small></label>
                <textarea required rows="5" style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.action} onChange={e => setForm({...form, action: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Result <small style={{fontWeight: 'normal'}}>(Quantifiable outcomes & impact)</small></label>
                <textarea required rows="5" style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.result} onChange={e => setForm({...form, result: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: '600' }}>Learning (Optional for STAR-L)</label>
              <textarea rows="3" style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px' }} value={form.learning} onChange={e => setForm({...form, learning: e.target.value})} placeholder="What did you learn? Perfect for 'Tell me about a time you failed' or 'What would you do differently' questions." />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold' }}>Save to Interview Engine</button>
          </form>
        </section>
      )}

      <section className="card">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {competencies.map(c => (
            <button 
              key={c} 
              onClick={() => setFilter(c)}
              className={`pill ${filter === c ? 'p-high' : ''}`}
              style={{ cursor: 'pointer', border: '1px solid var(--border)', background: filter === c ? 'var(--primary)' : 'transparent', color: filter === c ? 'var(--bg)' : 'var(--text)', padding: '6px 14px', fontSize: '13px' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
          {!filteredStories.length ? (
            <div className="empty" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--text-sec)' }}>
              No stories found. Build your first Top 1% story above!
            </div>
          ) : filteredStories.map(story => (
            <div key={story.id} className="card" style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              
              {story.metric && (
                <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'var(--primary)', color: 'var(--bg)', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  {story.metric}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ margin: '0', fontSize: '18px', color: 'var(--text)', paddingRight: '80px', lineHeight: '1.3' }}>{story.title}</h3>
                <button className="mini-btn" style={{ background: 'var(--border)', color: 'var(--text)' }} onClick={() => deleteStory(story.id)}>Del</button>
              </div>
              <span className="pill p-medium" style={{ marginBottom: '20px', display: 'inline-block', width: 'fit-content' }}>{story.competency}</span>
              
              {story.pivots && (
                <div style={{ marginBottom: '20px', padding: '14px', background: 'var(--bg-card)', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                  <strong style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '8px', letterSpacing: '0.5px' }}>Pivot Questions</strong>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--text-sec)', lineHeight: '1.5' }}>
                    {story.pivots.split(',').map((p, i) => <li key={i}>{p.trim()}</li>)}
                  </ul>
                </div>
              )}

              <div style={{ fontSize: '14px', color: 'var(--text-sec)', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, lineHeight: '1.5' }}>
                <div><strong style={{ color: 'var(--text)' }}>S:</strong> {story.situation}</div>
                <div><strong style={{ color: 'var(--text)' }}>T:</strong> {story.task}</div>
                <div><strong style={{ color: 'var(--text)' }}>A:</strong> {story.action}</div>
                <div><strong style={{ color: 'var(--text)' }}>R:</strong> {story.result}</div>
                {story.learning && <div><strong style={{ color: 'var(--text)' }}>L:</strong> {story.learning}</div>}
              </div>

              {story.hook && (
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                  <strong style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: '10px', letterSpacing: '0.5px' }}>Networking Hook</strong>
                  <div style={{ fontSize: '14px', background: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontStyle: 'italic', color: 'var(--text)', lineHeight: '1.4' }}>"{story.hook}"</span>
                    <button className="mini-btn" style={{ background: 'var(--primary)', color: 'var(--bg)', border: 'none' }} onClick={() => navigator.clipboard.writeText(story.hook)}>Copy</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
