import { useState } from 'react';
import { getSession, setSession } from './store';
import Auth from './pages/Auth.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  const [user, setUser] = useState(getSession());
  const login = (u) => { setSession(u); setUser(u); };   // redirect happens by role
  const logout = () => { setSession(null); setUser(null); };

  if (!user) return <Auth onLogin={login} />;
  return user.role === 'admin'
    ? <AdminDashboard user={user} onLogout={logout} />
    : <UserDashboard user={user} onLogout={logout} />;
}
