"use client";

import { useJcc } from '@/app/JccProvider';
import { useState } from 'react';
import { scoreTone } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function JobRadar() {
  const { addJob } = useJcc();
  const router = useRouter();
  
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [searchForm, setSearchForm] = useState({
    keywords: "AML Analyst",
    location: "Remote UK"
  });

  const handleScan = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    setResults([]);

    try {
      const res = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchForm)
      });
      const data = await res.json();
      if (data.jobs) {
        setResults(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToTracker = async (job) => {
    // Remove temporary radar fields before saving
    const { keyword_hits, missing_keywords, ...cleanJob } = job;
    cleanJob.id = `APP-${Date.now()}`; // Assign a fresh local DB ID
    cleanJob.status = "discovered";
    
    await addJob(cleanJob);
    
    // Remove from radar view
    setResults(results.filter(r => r.id !== job.id));
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Job Radar (Auto-Discovery)</h1>
          <p>Ping external APIs to find live roles. The radar auto-scores them against your ATS keywords, so you only see the highest-probability matches.</p>
        </div>
      </section>

      <section className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Configure Radar Sweep</h2>
        <form onSubmit={handleScan} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: 'bold' }}>Target Keywords</label>
            <input required style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={searchForm.keywords} onChange={e => setSearchForm({...searchForm, keywords: e.target.value})} placeholder="e.g. Financial Crime Analyst" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '6px', fontWeight: 'bold' }}>Location</label>
            <input required style={{ width: "100%", padding: "12px", background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} value={searchForm.location} onChange={e => setSearchForm({...searchForm, location: e.target.value})} placeholder="e.g. London or Remote UK" />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={isScanning} style={{ padding: '12px 24px', fontWeight: 'bold' }}>
              {isScanning ? 'Scanning Network...' : 'Run Radar Sweep'}
            </button>
          </div>
        </form>
      </section>

      {isScanning && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--primary)' }}>
          <div style={{ display: 'inline-block', animation: 'spin 2s linear infinite', fontSize: '32px' }}>⎋</div>
          <p style={{ marginTop: '16px', color: 'var(--text-sec)' }}>Fetching live jobs from API and running ATS matrix...</p>
        </div>
      )}

      {!isScanning && results.length > 0 && (
        <section className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0 }}>Radar Hits ({results.length})</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-sec)' }}>Sorted by Base ATS Match Score</span>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {results.map((job) => (
              <div key={job.id} style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary)' }}>{job.role}</h3>
                    <span style={{ fontSize: '14px', color: 'var(--text-sec)' }}>at {job.company}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-sec)', marginBottom: '16px' }}>
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>⏱ Deadline: {job.deadline}</span>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', marginBottom: '16px' }}>
                    {job.jd}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {job.keyword_hits.map(k => (
                      <span key={k} style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', border: '1px solid rgba(74, 222, 128, 0.2)', fontWeight: 'bold' }}>{k}</span>
                    ))}
                  </div>
                </div>

                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`score ${scoreTone(job.match_score)}`} style={{ fontSize: '24px', padding: '12px', borderRadius: '8px', marginBottom: '8px', display: 'inline-block' }}>
                      {job.match_score}% Match
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleSaveToTracker(job)} style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                    + Save to Command Center
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}
