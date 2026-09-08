import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

import LoginPage from './pages/auth/loginPage';
import StaffDashboard from './pages/dashboard/staffDashboard';
import ParentDashboardPage from './parent-portal/pages/dashboad';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<StaffDashboard />} />
            <Route path="/school-admin/dashboard" element={<StaffDashboard />} />
            <Route path="/parent-portal/dashboard" element={<ParentDashboardPage />} />
          </Route>

          {/* Fallback: unknown paths -> login (or dashboard, once ProtectedRoute exists) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;