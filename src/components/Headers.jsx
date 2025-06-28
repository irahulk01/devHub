import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`${import.meta.env.VITE_API}/developers?uid=${user.uid}`)
      .then((res) => {
        setDeveloper(res.data[0]);
      })
      .catch(() => {
        setDeveloper(null);
      });
  }, [user?.uid]);

  if (!user) return null;

  const name = developer?.name?.trim();
  const avatar = developer?.avatar?.trim();

  const isNamedUser = Boolean(name);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white relative">
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
              `https://ui-avatars.com/api/?name=${name || "User"}&background=random`
            }
            alt="Profile"
            className={`w-9 h-9 rounded-full border-2 ${
              isNamedUser ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => {
              if (isNamedUser) navigate(`/developers/${user.uid}`);
            }}
          />

          {/* Edit on hover for unnamed users */}
          {!isNamedUser && hovered && (
            <span
              onClick={() => navigate(`/profile/edit?uid=${user.uid}`)}
              className="absolute -bottom-6 left-0 bg-indigo-600 text-xs px-2 py-1 rounded cursor-pointer hover:bg-indigo-700 transition"
            >
              Edit
            </span>
          )}
        </div>

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