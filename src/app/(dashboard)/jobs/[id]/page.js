"use client";

import { useJcc } from '@/app/JccProvider';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { statusClass, scoreTone } from '@/lib/utils';
import Link from 'next/link';

export default function JobWarRoom() {
  const { id } = useParams();
  const router = useRouter();
  const { jobs, stories, loading, updateJob } = useJcc();
  const [activeTab, setActiveTab] = useState("ats");

  // Job specific states
  const [jdText, setJdText] = useState("");
  const [newCriterion, setNewCriterion] = useState({ name: "", score: 3 });

  if (loading) return <div className="p-4">Loading War Room...</div>;

  const job = jobs.find(j => j.id === id);
  if (!job) return <div className="p-4" style={{ textAlign: 'center', marginTop: '40px' }}><h2 style={{marginBottom: '16px'}}>Job not found.</h2> <button className="btn btn-primary" onClick={() => router.push('/jobs')}>Go Back to Tracker</button></div>;

  // ATS Logic
  const targetKeywords = ["aml", "kyc", "edd", "sql", "sanctions", "fraud", "investigations", "compliance", "sars", "transaction monitoring", "cdd", "risk", "python", "excel", "power bi", "fca"];
  const currentJd = job.jd || jdText || "";
  const jdLower = currentJd.toLowerCase();
  const matchedKeywords = targetKeywords.filter(k => jdLower.includes(k));
  const missingKeywords = targetKeywords.filter(k => !jdLower.includes(k));

  const saveJd = () => updateJob({ ...job, jd: jdText });

  // Criteria Logic
  const jobCriteria = job.criteria || [];
  const handleAddCriterion = () => {
    if (!newCriterion.name) return;
    const updated = [...jobCriteria, newCriterion];
    updateJob({ ...job, criteria: updated });
    setNewCriterion({ name: "", score: 3 });
  };
  const handleRemoveCriterion = (idx) => {
    const updated = jobCriteria.filter((_, i) => i !== idx);
    updateJob({ ...job, criteria: updated });
  };

  // Stories Logic
  const linkedStoryIds = job.linked_stories || [];
  const toggleStory = (storyId) => {
    let updated;
    if (linkedStoryIds.includes(storyId)) {
      updated = linkedStoryIds.filter(sid => sid !== storyId);
    } else {
      updated = [...linkedStoryIds, storyId];
    }
    updateJob({ ...job, linked_stories: updated });
  };

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/jobs" style={{ color: 'var(--text-sec)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>←</span> Back to Live Jobs Tracker
        </Link>
      </div>

      <section className="hero" style={{ paddingBottom: '0', borderBottom: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {job.role}
              <span style={{ color: 'var(--text-sec)', fontWeight: 'normal', fontSize: '20px' }}>at {job.company}</span>
            </h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', flexWrap: 'wrap' }}>
              <span className={`pill ${statusClass(job.status || 'discovered')}`}>{job.status || 'discovered'}</span>
              {job.location && <span style={{ color: 'var(--text-sec)', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {job.location}</span>}
              {job.salary && <span style={{ color: 'var(--text-sec)', display: 'flex', alignItems: 'center', gap: '4px' }}>💰 {job.salary}</span>}
              {job.source_url && <a href={job.source_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>View Original Posting ↗</a>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={`score ${scoreTone(job.match_score || 0)}`} style={{ fontSize: '28px', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {job.match_score || 0}% <span style={{ fontSize: '14px', display: 'block', color: 'var(--bg)', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Base Match</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', marginTop: '40px', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setActiveTab('ats')} style={{ background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', color: activeTab === 'ats' ? 'var(--primary)' : 'var(--text-sec)', borderBottom: activeTab === 'ats' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: activeTab === 'ats' ? 'bold' : 'normal', fontSize: '15px', transition: 'all 0.2s' }}>ATS Matcher</button>
          <button onClick={() => setActiveTab('criteria')} style={{ background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', color: activeTab === 'criteria' ? 'var(--primary)' : 'var(--text-sec)', borderBottom: activeTab === 'criteria' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: activeTab === 'criteria' ? 'bold' : 'normal', fontSize: '15px', transition: 'all 0.2s' }}>Hiring Criteria Scorecard</button>
          <button onClick={() => setActiveTab('stories')} style={{ background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', color: activeTab === 'stories' ? 'var(--primary)' : 'var(--text-sec)', borderBottom: activeTab === 'stories' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: activeTab === 'stories' ? 'bold' : 'normal', fontSize: '15px', transition: 'all 0.2s' }}>Linked STAR Stories <span style={{ background: linkedStoryIds.length > 0 ? 'var(--primary)' : 'var(--border)', color: linkedStoryIds.length > 0 ? 'var(--bg)' : 'var(--text-sec)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '6px' }}>{linkedStoryIds.length}</span></button>
          <button onClick={() => setActiveTab('prompt')} style={{ background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', color: activeTab === 'prompt' ? '#a855f7' : 'var(--text-sec)', borderBottom: activeTab === 'prompt' ? '3px solid #a855f7' : '3px solid transparent', fontWeight: activeTab === 'prompt' ? 'bold' : 'normal', fontSize: '15px', transition: 'all 0.2s' }}>✨ Prompt Engineer</button>
          <button onClick={() => setActiveTab('outreach')} style={{ background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', color: activeTab === 'outreach' ? '#3b82f6' : 'var(--text-sec)', borderBottom: activeTab === 'outreach' ? '3px solid #3b82f6' : '3px solid transparent', fontWeight: activeTab === 'outreach' ? 'bold' : 'normal', fontSize: '15px', transition: 'all 0.2s' }}>🤝 Contact Human</button>
        </div>
      </section>

      <section className="card" style={{ marginTop: '24px', padding: '32px', borderTop: 'none' }}>
        {activeTab === 'ats' && (
          <div className="fade-in">
            <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>ATS Keyword Matching</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-sec)', marginBottom: '16px', lineHeight: '1.5' }}>Paste the raw Job Description here. We will analyze it against your target profile keywords to see what the ATS filter will flag.</p>
                <textarea rows="16" style={{ width: '100%', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', outline: 'none' }} value={currentJd} onChange={e => { setJdText(e.target.value); if (job.jd !== undefined) updateJob({...job, jd: e.target.value}); }} placeholder="Paste the full job description here..." />
                {job.jd === undefined && currentJd.length > 0 && <button className="btn btn-primary" onClick={saveJd} style={{ marginTop: '16px' }}>Save Analysis</button>}
              </div>
              
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '24px', color: 'var(--text)' }}>Analysis Results</h3>
                <div style={{ marginBottom: '32px' }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4ade80', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}><span style={{ fontSize: '16px' }}>✓</span> Hits ({matchedKeywords.length})</strong>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {matchedKeywords.map(k => <span key={k} style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(74, 222, 128, 0.2)', fontWeight: '500' }}>{k}</span>)}
                    {!matchedKeywords.length && currentJd.length > 0 && <span style={{ fontSize: '13px', color: 'var(--text-sec)' }}>No matching keywords detected.</span>}
                    {!currentJd.length && <span style={{ fontSize: '13px', color: 'var(--text-sec)' }}>Waiting for Job Description...</span>}
                  </div>
                </div>
                <div>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f87171', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}><span style={{ fontSize: '16px' }}>✗</span> Missing ({missingKeywords.length})</strong>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {missingKeywords.map(k => <span key={k} style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(248, 113, 113, 0.2)', fontWeight: '500' }}>{k}</span>)}
                  </div>
                  {currentJd.length > 0 && <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(248, 113, 113, 0.05)', borderRadius: '6px', borderLeft: '3px solid #f87171' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-sec)', lineHeight: '1.5' }}><strong>Action Required:</strong> Weave these missing keywords naturally into your resume bullet points or cover letter to bypass the ATS filter.</p>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'criteria' && (
          <div className="fade-in">
            <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Hiring Criteria Scorecard</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-sec)', marginBottom: '32px', lineHeight: '1.5', maxWidth: '800px' }}>Deconstruct the job requirements. Rate yourself honestly against the core criteria so you know exactly where the interviewers will probe for weaknesses.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', maxWidth: '800px' }}>
              {!jobCriteria.length ? (
                <div className="empty" style={{ padding: '40px', border: '1px dashed var(--border)' }}>No criteria added. Review the JD and identify 3-5 core requirements.</div>
              ) : jobCriteria.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', transition: 'all 0.2s', ':hover': { borderColor: 'var(--primary)' } }}>
                  <div style={{ fontWeight: '500', fontSize: '15px' }}>{c.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ fontSize: '20px', color: star <= c.score ? '#fbbf24' : 'var(--bg)' }}>★</span>
                      ))}
                    </div>
                    <div style={{ width: '40px', fontSize: '14px', color: 'var(--text-sec)', textAlign: 'right', fontWeight: 'bold' }}>{c.score}/5</div>
                    <button onClick={() => handleRemoveCriterion(idx)} style={{ background: 'rgba(248, 113, 113, 0.1)', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-sec)' }}>Add Requirement</h3>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px', background: 'var(--bg)', border: '1px dashed var(--primary)', borderRadius: '8px' }}>
                <input type="text" value={newCriterion.name} onChange={e => setNewCriterion({...newCriterion, name: e.target.value})} placeholder="e.g. 5+ years AML investigations" style={{ flexGrow: 1, padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                <select value={newCriterion.score} onChange={e => setNewCriterion({...newCriterion, score: parseInt(e.target.value)})} style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', fontSize: '14px', width: '160px', outline: 'none' }}>
                  <option value={5}>5 - Expert</option>
                  <option value={4}>4 - Strong</option>
                  <option value={3}>3 - Capable</option>
                  <option value={2}>2 - Learning</option>
                  <option value={1}>1 - Weakness</option>
                </select>
                <button className="btn btn-primary" onClick={handleAddCriterion} style={{ padding: '12px 24px', fontWeight: 'bold' }}>Add</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="fade-in">
            <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Linked STAR Stories</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-sec)', marginBottom: '32px', lineHeight: '1.5', maxWidth: '800px' }}>Click to select 3 or 4 high-impact stories from your bank that perfectly align with this role's challenges. Review these right before the interview.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {stories.map(story => {
                const isLinked = linkedStoryIds.includes(story.id);
                return (
                  <div key={story.id} onClick={() => toggleStory(story.id)} style={{ padding: '24px', background: isLinked ? 'rgba(56, 189, 248, 0.05)' : 'var(--bg-card)', border: isLinked ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', boxShadow: isLinked ? '0 4px 12px rgba(56, 189, 248, 0.1)' : 'none' }}>
                    
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '20px', height: '20px', borderRadius: '50%', border: isLinked ? 'none' : '2px solid var(--border)', background: isLinked ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isLinked && <span style={{ color: 'var(--bg)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                    </div>

                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: isLinked ? 'var(--primary)' : 'var(--text)', paddingRight: '32px', lineHeight: '1.4' }}>{story.title}</h3>
                    <span className="pill p-medium" style={{ marginBottom: '16px', display: 'inline-block', fontSize: '11px', background: isLinked ? 'var(--bg)' : 'var(--bg)', border: '1px solid var(--border)' }}>{story.competency}</span>
                    
                    {story.metric && (
                      <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 'bold', color: 'var(--text)' }}>
                        ★ {story.metric}
                      </div>
                    )}
                    
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-sec)', lineHeight: '1.5' }}>"{story.hook}"</p>
                  </div>
                )
              })}
            </div>
            {!stories.length && <div className="empty" style={{ padding: '40px' }}>No stories in your bank yet. Go to STAR Stories to build some!</div>}
          </div>
        )}
        {activeTab === 'prompt' && (
          <div className="fade-in">
            <h2 style={{ marginBottom: '16px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>✨</span> AI Cover Letter Engineer
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-sec)', marginBottom: '32px', lineHeight: '1.5', maxWidth: '800px' }}>
              Copy this mega-prompt and paste it into ChatGPT or Claude. It combines your raw Job Description, forces the AI to weave in your missing ATS keywords, and injects your selected STAR stories to create a hyper-personalized cover letter.
            </p>

            <div style={{ position: 'relative', background: '#1e1e1e', borderRadius: '12px', padding: '24px', border: '1px solid #333' }}>
              <button 
                onClick={(e) => {
                  navigator.clipboard.writeText(e.target.nextSibling.innerText);
                  const original = e.target.innerText;
                  e.target.innerText = "Copied!";
                  setTimeout(() => e.target.innerText = original, 2000);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: '#a855f7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Copy Full Prompt
              </button>
              
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', color: '#e5e5e5', lineHeight: '1.6', maxWidth: '90%' }}>
{`Act as an expert career coach and executive resume writer. 
I am applying for the role of ${job.role} at ${job.company}.

Below is the raw Job Description:
---
${currentJd || "[You have not pasted the JD in the ATS Matcher tab yet.]"}
---

I have run an ATS keyword scan, and I am currently missing these core keywords. You MUST naturally weave these exact keywords into the cover letter:
${missingKeywords.length > 0 ? missingKeywords.join(', ') : 'None! I hit them all.'}

To prove my competency, please use the following highly specific STAR stories from my career. Do not invent new metrics; use the ones provided here:

${linkedStoryIds.map((id, index) => {
  const s = stories.find(st => st.id === id);
  if (!s) return '';
  return `STORY ${index + 1} (${s.competency}):
- Situation: ${s.situation}
- Task: ${s.task}
- Action: ${s.action}
- Result: ${s.result}
`;
}).join('\n') || "[You have not linked any STAR stories yet. Go to the Linked Stories tab!]"}

Instructions:
1. Write a punchy, 3-paragraph cover letter.
2. Do not use generic corporate jargon (e.g., "I am writing to express my interest", "I am a seasoned professional"). Start with a strong hook.
3. Map my STAR stories directly to the pain points mentioned in the JD.
4. Keep it under 350 words.`}
              </pre>
            </div>
          </div>
        )}
        {activeTab === 'outreach' && (
          <div className="fade-in">
            <h2 style={{ marginBottom: '16px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🤝</span> Direct Outreach Pipeline
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-sec)', marginBottom: '32px', lineHeight: '1.5', maxWidth: '800px' }}>
              Bypass the ATS. Find the human behind the role and send a surgical, Data Engineering + Compliance hybrid pitch.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
              {/* Recruiter Recon Settings */}
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Recruiter Recon</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>Target Search</label>
                  <a 
                    href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.company + ' (Recruiter OR Talent Acquisition OR "Financial Crime" OR Compliance)')}&network=%5B%22S%22%2C%22O%22%5D&origin=GLOBAL_SEARCH_HEADER`}
                    target="_blank" rel="noreferrer"
                    className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none', padding: '10px' }}
                  >
                    🔍 Search LinkedIn for Humans
                  </a>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>Recruiter Name</label>
                  <input type="text" style={{ width: "100%", padding: "10px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={job.recruiter_name || ''} onChange={e => updateJob({...job, recruiter_name: e.target.value})} placeholder="e.g. Sarah Jenkins" />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>LinkedIn Profile URL</label>
                  <input type="text" style={{ width: "100%", padding: "10px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={job.recruiter_url || ''} onChange={e => updateJob({...job, recruiter_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px' }}>Outreach Status</label>
                  <select style={{ width: "100%", padding: "10px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={job.outreach_status || 'Not Contacted'} onChange={e => updateJob({...job, outreach_status: e.target.value})}>
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Connection Request Sent">Connection Request Sent</option>
                    <option value="Message Sent">Message Sent</option>
                    <option value="Replied">Replied 🎉</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Pitch Generator */}
              <div style={{ position: 'relative', background: '#1e1e1e', borderRadius: '12px', padding: '24px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>Straightforward Pitch</h3>
                  <button 
                    onClick={(e) => {
                      navigator.clipboard.writeText(e.target.parentNode.nextSibling.innerText);
                      const original = e.target.innerText;
                      e.target.innerText = "Copied!";
                      setTimeout(() => e.target.innerText = original, 2000);
                    }}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                  >
                    Copy Pitch
                  </button>
                </div>
                
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', fontSize: '14px', color: '#e5e5e5', lineHeight: '1.6' }}>
{`Hi ${job.recruiter_name ? job.recruiter_name.split(' ')[0] : '[Name]'},

I saw ${job.company} is hiring a ${job.role} and wanted to reach out directly. I'm based in Stirling, Scotland (MSc Business Analytics, Univ. of Stirling) and specialize in the intersection of Risk/Compliance and Data Engineering.

At LinkedIn, I maintained a 94% case resolution rate in Trust & Safety, and I have extensive experience operating within FCA-regulated environments from my time at Amazon. 

I'm highly technical—I use SQL and Python to automate AML/KYC workflows, similar to a recent Oracle ERP optimization project I led.

I'd love to bring this hybrid compliance/data skill set to your Risk team. Are you open to a quick chat this week?

Best,
Shashank G.`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </section>
      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}
