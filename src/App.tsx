import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import GuideRegister from './pages/auth/GuideRegister'; // 1. Import the new page
import LandingPage from './pages/Landing';
import AdminDashboard from './pages/admin/Dashboard';
import UserExplore from './pages/user/Explore';
import ProtectedRoute from './components/ProtectedRoute';
import GuideDashboard from './guide/GuideDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 2. Added the Guide Registration Route */}
        <Route path="/register-guide" element={<GuideRegister />} />
        
        {/* Admin Routes - Protected */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* User Routes - Protected */}
        <Route 
          path="/userdashboard" 
          element={
            <ProtectedRoute roleRequired="user">
              <UserExplore />
            </ProtectedRoute>
          } 
        />

        {/* Guide Routes - Protected */}
        <Route 
          path="/guide-dashboard" 
          element={
            <ProtectedRoute roleRequired="guide">
              <GuideDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: redirect unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;