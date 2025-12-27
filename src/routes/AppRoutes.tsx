import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InventoryPage } from '../pages/InventoryPage';
import { DashboardLayout } from '../components/Layout/DashboardLayout'; // Import the layout

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route (No Sidebar) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Layout Routes (With Sidebar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};