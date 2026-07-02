import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ManagerLayout from './components/ManagerLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCourses from './pages/ManageCourses';
import ManageProducts from './pages/ManageProducts';
import ManageBlog from './pages/ManageBlog';
import ManageTutorials from './pages/ManageTutorials';
import ManagePartners from './pages/ManagePartners';
import ManageCompany from './pages/ManageCompany';
import Inquiries from './pages/Inquiries';
import Enrollments from './pages/Enrollments';
import Profile from './pages/Profile';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<Protected><ManagerLayout /></Protected>}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="blog" element={<ManageBlog />} />
        <Route path="tutorials" element={<ManageTutorials />} />
        <Route path="partners" element={<ManagePartners />} />
        <Route path="company" element={<ManageCompany />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
