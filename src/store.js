// All data lives in localStorage (no backend).
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const getUsers = () => {
  let u = get('tms_users', null);
  if (!u) { // seed a default admin account
    u = [{ name: 'Admin', email: 'admin@tms.com', password: 'admin123', role: 'admin' }];
    set('tms_users', u);
  }
  return u;
};
export const saveUsers = (u) => set('tms_users', u);
export const getTasks = () => get('tms_tasks', []);
export const saveTasks = (t) => set('tms_tasks', t);
export const getSession = () => get('tms_session', null);
export const setSession = (s) => (s ? set('tms_session', s) : localStorage.removeItem('tms_session'));
