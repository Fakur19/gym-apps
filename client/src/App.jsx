import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import MembersView from './views/MembersView';
import TransactionsView from './views/TransactionsView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';


function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(user),
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
      // Redirect to login if not authenticated and not already on login page
      if (location.pathname !== '/' && location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  // Axios Interceptor for handling token expiration or invalid tokens
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, log out user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ isAuthenticated: false, user: null });
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null });
    navigate('/login');
  };

  // Simple ProtectedRoute component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!auth.isAuthenticated) {
      return <LoginView setAuth={setAuth} />;
    }
    if (allowedRoles && !allowedRoles.includes(auth.user?.role)) {
      return <div className="text-center text-red-500 mt-20">Access Denied: You do not have the necessary permissions.</div>;
    }
    return children;
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      {auth.isAuthenticated && (
        <Sidebar
          activeView={location.pathname.substring(1) || 'dashboard'}
          setActiveView={(view) => navigate(`/${view}`)}
          isCollapsed={false} // You can manage this state if needed
          setIsCollapsed={() => {}} // You can manage this state if needed
          handleLogout={handleLogout}
          userRole={auth.user?.role}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {auth.isAuthenticated && (
          <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6">
            {/* Header content can go here */}
          </header>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/login" element={<LoginView setAuth={setAuth} />} />
            <Route path="/" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
            <Route path="/members" element={<ProtectedRoute><MembersView /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsView /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminView /></ProtectedRoute>} />
            {/* Redirect any unmatched routes to dashboard or login */}
            <Route path="*" element={auth.isAuthenticated ? <DashboardView /> : <LoginView setAuth={setAuth} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;