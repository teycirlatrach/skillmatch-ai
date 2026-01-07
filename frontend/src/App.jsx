import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import MySkills from "./pages/MySkills";
import Favorites from "./pages/Favorites";
import RecommendationsHistory from "./pages/RecommendationsHistory";
import RecommendationDetails from "./pages/RecommendationDetails";

import AdminHome from "./pages/admin/AdminHome";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminCareers from "./pages/admin/AdminCareers";
import AdminFormations from "./pages/admin/AdminFormations";
import AdminPfe from "./pages/admin/AdminPfe";
import History from "./pages/History";
import CatalogCareers from "./pages/catalog/CatalogCareers";
import CatalogFormations from "./pages/catalog/CatalogFormations";
import CatalogPfe from "./pages/catalog/CatalogPfe";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

function StudentRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "STUDENT") return <Navigate to="/admin" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Default */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomeRedirect />
          </PrivateRoute>
        }
      />

      {/* STUDENT */}
      <Route
        path="/dashboard"
        element={
          <StudentRoute>
            <Dashboard />
          </StudentRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <StudentRoute>
            <MyProfile />
          </StudentRoute>
        }
      />
      <Route
        path="/my-skills"
        element={
          <StudentRoute>
            <MySkills />
          </StudentRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <AdminRoute>
            <AdminSkills />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/careers"
        element={
          <AdminRoute>
            <AdminCareers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/formations"
        element={
          <AdminRoute>
            <AdminFormations />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pfe"
        element={
          <AdminRoute>
            <AdminPfe />
          </AdminRoute>
        }
      />
      <Route path="/catalog/careers" element={<StudentRoute><CatalogCareers /></StudentRoute>} />
<Route path="/catalog/formations" element={<StudentRoute><CatalogFormations /></StudentRoute>} />
<Route path="/catalog/pfe" element={<StudentRoute><CatalogPfe /></StudentRoute>} />

      <Route path="/history" 
      element={
      <StudentRoute>
        <History />
        </StudentRoute>
      } />
      <Route path="/favorites" element={<StudentRoute><Favorites /></StudentRoute>} />

<Route path="/recommendations/history" element={<StudentRoute><RecommendationsHistory /></StudentRoute>} />
<Route path="/recommendations/:id" element={<StudentRoute><RecommendationDetails /></StudentRoute>} />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
