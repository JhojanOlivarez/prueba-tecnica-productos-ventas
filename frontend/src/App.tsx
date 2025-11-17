import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import SalesCreatePage from "./pages/sales/SalesCreatePage";
import SalesListPage from "./pages/sales/SalesListPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element=
        {(
          <ProtectedRoute>
            <Layout>
              <CategoriesPage />
            </Layout>
          </ProtectedRoute>
        )}
      />

      <Route
        path="/sales/new"
        element=
        {(
          <ProtectedRoute>
            <Layout>
              <SalesCreatePage />
            </Layout>
          </ProtectedRoute>
        )}
      />

      <Route
        path="/sales"
        element=
        {(
          <ProtectedRoute>
            <Layout>
              <SalesListPage />
            </Layout>
          </ProtectedRoute>
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
