"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/jobs', label: 'Live Jobs' },
    { href: '/radar', label: 'Job Radar (Auto)' },
    { href: '/people', label: 'Recruiter CRM' },
    { href: '/applications', label: 'Applications' },
    { href: '/patterns', label: 'Pattern Lab' },
    { href: '/documents', label: 'Documents' },
    { href: '/stories', label: 'STAR Stories' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        Job Command Center
        <small>
          Production-ready OS for AML, KYC, financial crime, fraud, risk, compliance, analytics, applications, and document tracking.
        </small>
      </div>

      <div className="badge">Next.js Full-Stack</div>

      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-btn ${pathname === link.href ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <strong>Auth Mode</strong><br/>
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <form action="/login/actions" method="POST" style={{ marginTop: '10px' }}>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={async (e) => {
              e.preventDefault();
              await fetch('/login', { method: 'POST' }); // The form action handles logout if we write it right. Let's use a standard logout approach
              window.location.href = '/login';
            }}>
              Logout
            </button>
          </form>
        ) : (
          <span style={{ color: 'var(--warn)' }}>Local JSON fallback active.</span>
        )}
      </div>
    </aside>
  );
}
