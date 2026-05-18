import { login, signup } from './actions';

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>Welcome Back</h1>
        <p className="meta" style={{ marginBottom: '24px' }}>Sign in to access your Job Command Center</p>

        {error && (
          <div className="bad" style={{ padding: '12px', background: 'rgba(255,123,123,0.1)', border: '1px solid rgba(255,123,123,0.25)', borderRadius: '12px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {(!process.env.NEXT_PUBLIC_SUPABASE_URL) && (
          <div className="warn" style={{ padding: '12px', background: 'rgba(255,188,92,0.1)', border: '1px solid rgba(255,188,92,0.25)', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
            <strong>Local Mode:</strong> Supabase is not configured. Authentication will not work until you add your .env variables.
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--muted)' }}>Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--muted)' }}>Password</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button formAction={login} className="btn btn-primary" style={{ flex: 1 }}>Sign In</button>
            <button formAction={signup} className="btn btn-secondary" style={{ flex: 1 }}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
