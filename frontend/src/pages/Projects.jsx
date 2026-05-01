import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadProjects = () => api.get('/projects').then(res => setProjects(res.data));
  useEffect(() => { loadProjects(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/projects', { name });
    setName('');
    loadProjects();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Projects</h2>
        <div className="header-actions">
          <span className="user-profile">Hi, {user.name}</span>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: 0 }}>Back to Dashboard</button>
        </div>
      </div>
      
      <form onSubmit={createProject} className="form-inline">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" className="form-input-small" />
        <button type="submit" className="btn-primary-inline">Create Project</button>
      </form>

      <div className="projects-list">
        {projects.map(p => (
          <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="project-card">
            <span className="project-card-title">{p.name}</span>
            <span className="project-card-meta">{p.tasks?.length || 0} tasks · {p.members?.length || 0} members</span>
          </div>
        ))}
      </div>
    </div>
  );
}
