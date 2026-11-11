import { useState } from 'react';
import { getUsers, saveUsers } from '../store';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const ch = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const users = getUsers();
    const email = f.email.trim().toLowerCase();
    if (mode === 'signup') {
      if (!f.name.trim() || f.password.length < 6) return setErr('Enter a name and a password of 6+ characters.');
      if (users.some((u) => u.email === email)) return setErr('Email already registered.');
      const u = { name: f.name.trim(), email, password: f.password, role: 'user' };
      saveUsers([...users, u]);
      onLogin(u);
    } else {
      const u = users.find((x) => x.email === email && x.password === f.password);
      if (!u) return setErr('Invalid email or password.');
      onLogin(u);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth" onSubmit={submit}>
        <h1>TaskFlow</h1>
        <p className="muted">{mode === 'login' ? 'Log in to manage your tasks' : 'Create your account'}</p>
        {mode === 'signup' && <input name="name" placeholder="Full name" value={f.name} onChange={ch} />}
        <input name="email" type="email" placeholder="Email" value={f.email} onChange={ch} required />
        <input name="password" type="password" placeholder="Password" value={f.password} onChange={ch} required />
        {err && <div className="error">{err}</div>}
        <button className="btn">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        <p className="muted small">
          {mode === 'login' ? 'New here? ' : 'Already registered? '}
          <a href="#" onClick={(e) => { e.preventDefault(); setErr(''); setMode(mode === 'login' ? 'signup' : 'login'); }}>
            {mode === 'login' ? 'Sign up' : 'Login'}
          </a>
        </p>
        <p className="muted small">Demo admin: admin@tms.com / admin123</p>
      </form>
    </div>
  );
}
