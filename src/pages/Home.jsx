import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {fetchDeveloperPofile} from "../services/developerServices"

export default function Home() {
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(developers);
    const navigate = useNavigate();

  useEffect(() => {
   fetchDeveloperPofile()
      .then(res => {
        setDevelopers(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error("Error fetching developers", err));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(developers);
    } else {
      setFiltered(
        developers.filter(
          (dev) =>
            dev.skills.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            ) || dev.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

 return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Developers Hub</h1>
      <input
        type="text"
        placeholder="Search by name or skill..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Skills</th>
              <th className="px-4 py-2 text-left">GitHub</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dev) => (
              <tr
                key={dev.id}
                className="border-t hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(`/developers/${dev.id}`)}
              >
                <td className="px-4 py-2">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-4 py-2 font-medium text-black">{dev.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{dev.email}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {dev.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full hover:bg-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <a
                    href={dev.githubLink}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

