import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">DevHub</h1>
      <div className="flex items-center gap-4">
        <span>{user.email}</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
}