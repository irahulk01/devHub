import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {fetchDeveloperPofile} from "../services/apiServices"
import ReactPaginate from "react-paginate";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
   fetchDeveloperPofile()
      .then(res => {
        setDevelopers(res.data);
        setFiltered(res.data.slice(0, itemsPerPage));
        setCurrentPage(0);
      })
      .catch(err => console.error("Error fetching developers", err));
  }, []);

  const debounceRef = useRef(null);

  const fetchFilteredDevelopers = useCallback((term) => {
    const query = term.trim() ? `?q=${encodeURIComponent(term.trim())}` : "";
    fetch(`${import.meta.env.VITE_API}/developers${query}`)
      .then((res) => res.json())
      .then((data) => {
        const filteredBySkills = data.filter(dev =>
          dev.skills.some(skill =>
            skill.toLowerCase().includes(term.toLowerCase())
          )
        );
        setDevelopers(filteredBySkills);
        setFiltered(
          filteredBySkills.slice(
            currentPage * itemsPerPage,
            (currentPage + 1) * itemsPerPage
          )
        );
      })
      .catch((err) => console.error("Error searching developers", err));
  }, [currentPage]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchFilteredDevelopers(searchTerm);
    }, 500);
  }, [searchTerm, currentPage, fetchFilteredDevelopers]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

 return (
    <div className={`p-6 max-w-7xl mx-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-4">Developers Hub</h1>
      <input
        type="text"
        placeholder="Search by name or skill..."
        className={`w-full p-3 mb-6 border rounded-md shadow-sm transition-colors duration-200 ${
          theme === 'dark'
            ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
        }`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg">
          <thead className={`text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
            <tr>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Skills</th>
              <th className="px-4 py-2 text-left">GitHub</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((dev) => (
                <tr
                  key={dev.id}
                  className={`border-t transition-colors duration-200 cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'
                  }`}
                  onClick={() => navigate(`/developers/${dev.uid}`)}
                >
                  <td className="px-4 py-2">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className={`px-4 py-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{dev.name}</td>
                  <td className={`px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{dev.email}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {dev.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-indigo-800 text-white hover:bg-indigo-700'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={dev.githubLink}
                      className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No developers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(searchTerm.trim() ? developers.filter(
        (dev) =>
          dev.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) || dev.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).length : developers.length) > itemsPerPage && (
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={Math.ceil(
            (!searchTerm.trim() ? developers.length : developers.filter(
              (dev) =>
                dev.skills.some((skill) =>
                  skill.toLowerCase().includes(searchTerm.toLowerCase())
                ) || dev.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length) / itemsPerPage
          )}
          onPageChange={handlePageClick}
          containerClassName={`flex justify-center gap-2 mt-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          pageClassName={"px-3 py-1 border border-gray-300 rounded"}
          activeClassName={"bg-indigo-600 text-white"}
          previousClassName={"px-3 py-1 border border-gray-300 rounded"}
          nextClassName={"px-3 py-1 border border-gray-300 rounded"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      )}
    </div>
  );
}
