import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';

const isAuthenticated = () => localStorage.getItem('token') !== null;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/projects" element={isAuthenticated() ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/projects/:id" element={isAuthenticated() ? <ProjectDetail /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}