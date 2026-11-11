import { useState } from 'react';
import { getTasks, saveTasks, getUsers } from '../store';

const COLS = [['todo', 'To Do'], ['progress', 'In Progress'], ['done', 'Done']];
const daysLeft = (d) => Math.ceil((new Date(d) - new Date(new Date().toDateString())) / 864e5);

export default function UserDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(getTasks());
  const [f, setF] = useState({ title: '', project: 'General', deadline: '', priority: 'Medium' });
  const [proj, setProj] = useState('All');
  const [dragId, setDragId] = useState(null);

  const update = (t) => { setTasks(t); saveTasks(t); };
  const mine = tasks.filter((t) => t.owner === user.email || t.sharedWith.includes(user.email));
  const projects = ['All', ...new Set(mine.map((t) => t.project))];
  const shown = mine.filter((t) => proj === 'All' || t.project === proj);
  const due = mine.filter((t) => t.status !== 'done' && t.deadline && daysLeft(t.deadline) <= 2);
  const pct = mine.length ? Math.round((mine.filter((t) => t.status === 'done').length / mine.length) * 100) : 0;

  const add = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    update([...tasks, { id: Date.now(), ...f, project: f.project.trim() || 'General', status: 'todo', owner: user.email, sharedWith: [] }]);
    setF({ ...f, title: '' });
  };
  const move = (id, status) => update(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  const del = (id) => update(tasks.filter((t) => t.id !== id));
  const share = (t) => {
    const email = (prompt('Share with (registered email):') || '').trim().toLowerCase();
    if (!email) return;
    if (!getUsers().some((u) => u.email === email)) return alert('No user with that email.');
    if (email === user.email || t.sharedWith.includes(email)) return alert('Already has access.');
    update(tasks.map((x) => (x.id === t.id ? { ...x, sharedWith: [...x.sharedWith, email] } : x)));
  };

  return (
    <div className="page">
      <header className="top">
        <h2>TaskFlow <span className="badge">User</span></h2>
        <div className="row"><span>Hi, {user.name}</span><button className="btn ghost" onClick={onLogout}>Logout</button></div>
      </header>

      {due.length > 0 && (
        <div className="alert">
          🔔 {due.length} task(s) due soon: {due.map((t) => `${t.title} (${daysLeft(t.deadline) < 0 ? 'overdue' : daysLeft(t.deadline) === 0 ? 'today' : daysLeft(t.deadline) + 'd'})`).join(', ')}
        </div>
      )}

      <section className="card">
        <div className="row between"><b>Progress</b><span>{pct}% complete</span></div>
        <div className="bar"><div style={{ width: pct + '%' }} /></div>
      </section>

      <form className="card form-grid" onSubmit={add}>
        <input placeholder="New task title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input placeholder="Project" value={f.project} onChange={(e) => setF({ ...f, project: e.target.value })} />
        <input type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} />
        <select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <button className="btn">Add Task</button>
      </form>

      <div className="chips">
        {projects.map((p) => <button key={p} className={'chip' + (p === proj ? ' on' : '')} onClick={() => setProj(p)}>{p}</button>)}
      </div>

      <div className="board">
        {COLS.map(([key, label]) => (
          <div key={key} className="col" onDragOver={(e) => e.preventDefault()} onDrop={() => dragId && move(dragId, key)}>
            <h3>{label} ({shown.filter((t) => t.status === key).length})</h3>
            {shown.filter((t) => t.status === key).map((t) => (
              <div key={t.id} className={'task ' + t.priority} draggable onDragStart={() => setDragId(t.id)}>
                <b>{t.title}</b>
                <div className="muted small">📁 {t.project} · {t.priority}{t.deadline && ` · 📅 ${t.deadline}`}</div>
                {t.owner !== user.email && <div className="small">Shared by {t.owner}</div>}
                {t.sharedWith.length > 0 && <div className="small">👥 {t.sharedWith.join(', ')}</div>}
                <div className="row wrap">
                  {t.status !== 'done' && <button className="mini" onClick={() => move(t.id, 'done')}>✔ Complete</button>}
                  {t.owner === user.email && <button className="mini" onClick={() => share(t)}>Share</button>}
                  {t.owner === user.email && <button className="mini red" onClick={() => del(t.id)}>Delete</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="muted small">Tip: drag and drop cards between columns to reschedule their status.</p>
    </div>
  );
}
