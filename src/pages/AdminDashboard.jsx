import { useState } from 'react';
import { getUsers, saveUsers, getTasks, saveTasks } from '../store';

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState(getUsers());
  const [tasks, setTasks] = useState(getTasks());

  const delUser = (email) => {
    if (!confirm('Delete this user and their tasks?')) return;
    const u = users.filter((x) => x.email !== email);
    const t = tasks.filter((x) => x.owner !== email);
    setUsers(u); saveUsers(u); setTasks(t); saveTasks(t);
  };
  const delTask = (id) => { const t = tasks.filter((x) => x.id !== id); setTasks(t); saveTasks(t); };
  const done = tasks.filter((t) => t.status === 'done').length;
  const stats = [['Users', users.filter((u) => u.role === 'user').length], ['Tasks', tasks.length], ['Completed', done], ['Pending', tasks.length - done]];

  return (
    <div className="page">
      <header className="top">
        <h2>TaskFlow <span className="badge admin">Admin</span></h2>
        <div className="row"><span>{user.name}</span><button className="btn ghost" onClick={onLogout}>Logout</button></div>
      </header>

      <div className="stats">
        {stats.map(([k, v]) => <div key={k} className="card stat"><h1>{v}</h1><span className="muted">{k}</span></div>)}
      </div>

      <section className="card">
        <h3>Manage Users</h3>
        <div className="scroll"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th /></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u.email}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
              <td>{u.role !== 'admin' && <button className="mini red" onClick={() => delUser(u.email)}>Delete</button>}</td></tr>
          ))}</tbody>
        </table></div>
      </section>

      <section className="card">
        <h3>All Tasks</h3>
        <div className="scroll"><table>
          <thead><tr><th>Title</th><th>Project</th><th>Owner</th><th>Deadline</th><th>Status</th><th /></tr></thead>
          <tbody>
            {tasks.length === 0 && <tr><td colSpan="6" className="muted">No tasks yet.</td></tr>}
            {tasks.map((t) => (
              <tr key={t.id}><td>{t.title}</td><td>{t.project}</td><td>{t.owner}</td><td>{t.deadline || '-'}</td><td>{t.status}</td>
                <td><button className="mini red" onClick={() => delTask(t.id)}>Delete</button></td></tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}
