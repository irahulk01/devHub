import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import DeveloperProfile from "../pages/DeveloperProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/developers" element={<DeveloperProfile />} />
    </Routes>
  );
}
