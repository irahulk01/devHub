import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [hovered, setHovered] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { data: developerData } = useQuery({
    queryKey: ["developer", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const res = await axios.get(`${import.meta.env.VITE_API}/developers?uid=${user.uid}`);
      return res.data[0];
    },
    enabled: !!user?.uid,
    retry: 1,
  });

  useEffect(() => {
    setDeveloper(developerData);
  }, [developerData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!user) return null;

  const name = developer?.name?.trim();
  const avatar = developer?.avatar?.trim();
  const isNamedUser = Boolean(name);

  return (
    <header
      className={`flex justify-between items-center p-4 border-b relative transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-black border-gray-200"
      }`}
    >
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        DevHub
      </h1>

      <div
        className="relative flex items-center gap-4"
        onMouseEnter={() => !isNamedUser && setHovered(true)}
        onMouseLeave={() => !isNamedUser && setHovered(false)}
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${
                name || "User"
              }&background=random`
            }
            alt="Profile"
            className={`w-9 h-9 rounded-full border-2 ${
              isNamedUser ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => {
              if (isNamedUser) navigate(`/developers/${user.uid}`);
            }}
          />
          {!isNamedUser && hovered && (
            <span
              onClick={() => navigate(`/profile/edit?uid=${user.uid}`)}
              className="absolute -bottom-6 left-0 bg-indigo-600 text-xs px-2 py-1 rounded cursor-pointer hover:bg-indigo-700 transition"
            >
              Edit
            </span>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            toggleTheme();
          }}
          className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-xl px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
