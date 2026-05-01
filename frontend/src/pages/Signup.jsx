import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Signup</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="form-input" required autoComplete="name" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required autoComplete="username" />
          <input type="password" placeholder="Password (min 6)" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required autoComplete="new-password" />
          <button type="submit" className="btn-primary">Signup</button>
        </form>
        <p className="auth-link">Have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

