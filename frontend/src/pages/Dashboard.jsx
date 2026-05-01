import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data));
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const allTasks = projects.flatMap(p => p.tasks || []);
  const myTasks = allTasks.filter(t => t.assigneeId === user?.id);
  const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');
  
  // Total task counts across all projects
  const totalTasks = allTasks.length;
  const totalTodo = allTasks.filter(t => t.status === 'TODO').length;
  const totalInProgress = allTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const totalDone = allTasks.filter(t => t.status === 'DONE').length;
  const totalOverdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <div className="header-actions">
          <span className="user-profile">Hi, {user.name}</span>
          <button onClick={logout} className="btn-danger" style={{ marginBottom: 0 }}>Logout</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{totalTasks}</div><div className="stat-label">My Tasks</div></div>
        <div className="stat-card"><div className="stat-value">{totalTodo}</div><div className="stat-label">TODO</div></div>
        <div className="stat-card"><div className="stat-value">{totalInProgress}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card"><div className="stat-value">{totalDone}</div><div className="stat-label">Done</div></div>
        <div className="stat-card"><div className="stat-value danger">{totalOverdue}</div><div className="stat-label">Overdue</div></div>
      </div>

      <Link to="/projects"><button className="btn-primary-inline">View Projects →</button></Link>
    </div>
  );
}

