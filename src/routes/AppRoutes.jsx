import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoutes";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const DeveloperProfile = lazy(() => import("../pages/DeveloperProfile"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        <Route path="/developers/:id" element={
          <PrivateRoute>
            <DeveloperProfile />
          </PrivateRoute>
        } />
      </Routes>
    </Suspense>
  );
}