import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState('MEMBER');
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get(`/tasks/project/${id}`),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      const project = projectsRes.data.find(p => p.id === id);
      setMembers(project?.members || []);
      const me = project?.members?.find(m => m.userId === user.id);
      setMyRole(me?.role || 'MEMBER');
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post('/tasks', { title, projectId: id, assigneeId: assigneeId || null });
      setTitle('');
      setAssigneeId('');
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateAssignee = async (taskId, newAssigneeId) => {
    try {
      await api.patch(`/tasks/${taskId}`, { assigneeId: newAssigneeId });
      loadData();
    } catch (error) {
      console.error('Error updating assignee:', error);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        loadData();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Only admins can delete tasks');
      }
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setMemberEmail('');
      loadData();
    } catch (error) {
      console.error('Error adding member:', error);
      alert(error.response?.data?.error || 'Failed to add member');
    }
  };

  return (
    <div className="page-container-wide">
      <div className="page-header">
        <h2 className="page-title">Project Tasks</h2>
        <div className="header-actions">
          <span className="user-profile">Hi, {user.name}</span>
          <button onClick={() => navigate('/projects')} className="btn-secondary" style={{ marginBottom: 0 }}>← Back to Projects</button>
        </div>
      </div>

      <form onSubmit={createTask} className="form-inline">
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="New task title" 
          className="form-input-small" 
          required
        />
        {myRole === 'ADMIN' && (
          <select 
            value={assigneeId} 
            onChange={e => setAssigneeId(e.target.value)} 
            className="form-input-small"
          >
            <option value="">Assign to...</option>
            {members.map(m => (
              <option key={m.userId} value={m.userId}>{m.user.name}</option>
            ))}
          </select>
        )}
        <button type="submit" className="btn-primary-inline">Add Task</button>
      </form>

      <div className="kanban-board">
        {STATUSES.map(status => (
          <div key={status} className="kanban-column">
            <h3 className="kanban-column-title">{status.replace('_', ' ')}</h3>
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className="task-card">
                <div className="task-title">{task.title}</div>
                <div className="task-assignee">👤 {task.assignee?.name || 'Unassigned'}</div>
                <div className="task-controls">
                  <select 
                    value={task.status} 
                    onChange={e => updateStatus(task.id, e.target.value)} 
                    className="task-select"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {myRole === 'ADMIN' && (
                    <select 
                      value={task.assigneeId || ''} 
                      onChange={e => updateAssignee(task.id, e.target.value || null)} 
                      className="task-select"
                    >
                      <option value="">Unassigned</option>
                      {members.map(m => (
                        <option key={m.userId} value={m.userId}>{m.user.name}</option>
                      ))}
                    </select>
                  )}
                  {myRole === 'ADMIN' && (
                    <button onClick={() => deleteTask(task.id)} className="btn-danger-small" style={{ marginTop: 0 }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="members-section">
        <h3>Members ({members.length})</h3>
        {members.map(m => (
          <div key={m.id} className="member-item">
            <span className="member-name">{m.user.name}</span>
            <span className={`member-role ${m.role.toLowerCase()}`}>{m.role}</span>
          </div>
        ))}
        
        {myRole === 'ADMIN' && (
          <form onSubmit={addMember} className="form-inline add-member-form">
            <input 
              value={memberEmail} 
              onChange={e => setMemberEmail(e.target.value)} 
              placeholder="Enter member email" 
              className="form-input-small" 
              style={{ marginBottom: 0 }}
            />
            <button type="submit" className="btn-primary-inline">Add Member</button>
          </form>
        )}
      </div>
    </div>
  );
}

