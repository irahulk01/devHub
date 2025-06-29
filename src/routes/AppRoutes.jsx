import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoutes";
import FullPageLoader from "../components/FullPageLoader";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const DeveloperProfile = lazy(() => import("../pages/DeveloperProfile"));
const DeveloperEditProfile = lazy(() =>
  import("../pages/DeveloperEditProfile")
);
const BlogsByAuthor = lazy(() => import("../pages/BlogsDetails"));
const CreateBlogPost = lazy(() => import("../components/CreateBlogPost"));

const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/developers/:id"
          element={
            <PrivateRoute>
              <DeveloperProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <DeveloperEditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/developers/:authorId/blogs/:id"
          element={
            <PrivateRoute>
              <BlogsByAuthor />
            </PrivateRoute>
          }
        />
        <Route
          path="/createBlogPost"
          element={
            <PrivateRoute>
              <CreateBlogPost />
            </PrivateRoute>
          }
        />
        {/* 404 fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
