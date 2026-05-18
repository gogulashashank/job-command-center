"use client";

import { useJcc } from '@/app/JccProvider';
import { useState } from 'react';
import Link from 'next/link';

export default function PeopleCRM() {
  const { people, jobs, updatePerson, addPerson, loading } = useJcc();
  const [activePerson, setActivePerson] = useState(null);

  if (loading) return <div className="p-4">Loading Recruiter CRM...</div>;

  return (
    <>
      <section className="hero">
        <div>
          <h1>Recruiter CRM</h1>
          <p>Your direct outreach pipeline. Bypass the ATS and engage humans directly.</p>
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left Col: Recruiter List */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>Target Contacts</h2>
            <button 
              className="btn" 
              style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => {
                const newPerson = { id: "PPL-" + Date.now() + "-" + Math.floor(Math.random() * 1000), name: "New Contact", company: "", linked_in: "", email: "", status: "Not Contacted" };
                addPerson(newPerson);
                setActivePerson(newPerson);
              }}
            >+ Add</button>
          </div>
          {!people || people.length === 0 ? (
            <div className="empty">No recruiters fetched yet. Use the Contact Human tab in the War Room to find contacts.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {people.map(person => (
                <div 
                  key={person.id} 
                  onClick={() => setActivePerson(person)}
                  style={{ 
                    padding: '16px', 
                    background: activePerson?.id === person.id ? 'var(--line)' : 'var(--bg-card)', 
                    border: activePerson?.id === person.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{person.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-sec)', marginTop: '4px' }}>{person.company}</div>
                  <div style={{ marginTop: '8px' }}>
                    <span className="pill" style={{ fontSize: '11px', background: 'var(--bg)' }}>{person.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recruiter Detail & Pitch Generator */}
        <div className="card" style={{ padding: '32px' }}>
          {!activePerson ? (
            <div className="empty" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Select a recruiter to view details and draft pitch.
            </div>
          ) : (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ flexGrow: 1, marginRight: '16px' }}>
                  <input type="text" value={activePerson.name} onChange={e => { const up = {...activePerson, name: e.target.value}; setActivePerson(up); updatePerson(up); }} style={{ fontSize: '24px', fontWeight: 'bold', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', width: '100%', padding: 0, marginBottom: '8px' }} placeholder="Recruiter Name" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', color: 'var(--text-sec)' }}>Recruitment @</span>
                    <input type="text" value={activePerson.company} onChange={e => { const up = {...activePerson, company: e.target.value}; setActivePerson(up); updatePerson(up); }} style={{ fontSize: '15px', background: 'transparent', border: 'none', borderBottom: '1px dashed var(--border)', color: 'var(--text)', outline: 'none', width: '250px' }} placeholder="Company Name" />
                  </div>
                </div>
                {activePerson.linked_in && (
                  <a href={activePerson.linked_in} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
                    View LinkedIn ↗
                  </a>
                )}
              </div>

              <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>LinkedIn URL</label>
                    <input type="text" style={{ width: "100%", padding: "10px", background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={activePerson.linked_in || ''} onChange={e => { const up = {...activePerson, linked_in: e.target.value}; setActivePerson(up); updatePerson(up); }} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" style={{ width: "100%", padding: "10px", background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={activePerson.email || ''} onChange={e => { const up = {...activePerson, email: e.target.value}; setActivePerson(up); updatePerson(up); }} placeholder="name@company.com" />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>Status</label>
                  <select 
                    style={{ width: "100%", padding: "10px", background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} 
                    value={activePerson.status} 
                    onChange={e => {
                      const updated = {...activePerson, status: e.target.value};
                      setActivePerson(updated);
                      updatePerson(updated);
                    }}
                  >
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Connection Request Sent">Connection Request Sent</option>
                    <option value="Message Sent">Message Sent</option>
                    <option value="Replied">Replied 🎉</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✉️</span> Draft Outreach Pitch
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-sec)', marginBottom: '24px' }}>
                This is your high-converting Data Engineering + Compliance hybrid pitch anchored to your Stirling and Amazon experience. 
              </p>

              <div style={{ position: 'relative', background: '#1e1e1e', borderRadius: '12px', padding: '24px', border: '1px solid #333' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', fontSize: '14px', color: '#e5e5e5', lineHeight: '1.6' }} id="pitch-text">
{`Hi ${activePerson.name.split(' ')[0]},

I noticed ${activePerson.company} is expanding its Risk & Compliance team and wanted to reach out directly. I'm based locally in Stirling, Scotland (MSc Business Analytics, Univ. of Stirling) and specialize in the intersection of Risk/Compliance and Data Engineering.

${jobs.find(j => j.recruiter_id === activePerson.id && j.location && j.location.includes('Glasgow')) 
  ? "I see your Glasgow team is scaling up remediation efforts. In my previous role, I cleared a 400-profile KYC remediation backlog 3 days ahead of deadline by automating the initial triage via SQL." 
  : "At LinkedIn, I maintained a 94% case resolution rate in Trust & Safety, and I have extensive experience operating within FCA-regulated environments from my time at Amazon."} 

I'm highly technical—I use SQL and Python to automate AML workflows, similar to a recent Oracle ERP optimization project I led.

I'd love to bring this hybrid compliance/data skill set to your team. Are you open to a quick chat this week?

Best,
Shashank G.`}
                </pre>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button 
                    onClick={(e) => {
                      navigator.clipboard.writeText(document.getElementById('pitch-text').innerText);
                      const original = e.target.innerText;
                      e.target.innerText = "Copied!";
                      setTimeout(() => e.target.innerText = original, 2000);
                    }}
                    className="btn"
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Copy Pitch
                  </button>
                  
                  <a 
                    href={`mailto:` + (activePerson.email || 'recruiter@example.com') + `?subject=Quick question regarding Risk & Compliance at ${activePerson.company}&body=` + encodeURIComponent(document.getElementById('pitch-text')?.innerText || '')}
                    className="btn"
                    style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    Draft in Mail Client
                  </a>
                </div>
              </div>
              
              {/* Linked Jobs Reference */}
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Jobs Associated with {activePerson.name.split(' ')[0]}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {jobs.filter(j => j.recruiter_id === activePerson.id).map(j => (
                    <Link key={j.id} href={`/jobs/${j.id}`} style={{ display: 'block', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', textDecoration: 'none' }}>
                      <div style={{ fontWeight: 'bold' }}>{j.role}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-sec)', marginTop: '4px' }}>ATS Match: {j.match_score}%</div>
                    </Link>
                  ))}
                  {jobs.filter(j => j.recruiter_id === activePerson.id).length === 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--text-sec)' }}>No active jobs linked to this recruiter.</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.2s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}
