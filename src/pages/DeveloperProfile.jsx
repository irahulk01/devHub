import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function DeveloperProfile() {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const loggedInUid = JSON.parse(localStorage.getItem("devhub-user"))?.uid;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/developers?uid=${id}`)
      .then((res) => setDeveloper(res.data[0]))
      .catch((err) => console.error("Error loading developer", err));

    axios
      .get(`${import.meta.env.VITE_API}/blogs?authorId=${id}`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error loading blogs", err));
  }, [id]);

  if (!developer) {
    return (
      <div className="p-6 text-center text-gray-800 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  const isOwnProfile = String(developer.uid) === String(loggedInUid);

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors duration-300 ${
      theme === "dark"
        ? "bg-gray-950 text-gray-100"
        : "bg-gray-50 text-gray-800"
    }`}>
      <div className={`max-w-4xl mx-auto rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border transition ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}>
        {isOwnProfile && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/profile/edit", { state: { developer } })}
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400 transition"
            >
              ✏️ Edit Profile
            </button>
          </div>
        )}

        {/* Profile Header */}
        <section className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={developer.avatar || `https://ui-avatars.com/api/?name=${developer.name || "User"}`}
            alt={developer.name || "Developer"}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500 shadow"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-pink-400">{developer.name}</h1>
            {developer.title && (
              <p className="text-sm mt-1">{developer.title}</p>
            )}
            {developer.location && (
              <p className="text-sm mt-1">📍 {developer.location}</p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
              {developer.githubLink && (
                <a href={developer.githubLink} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  GitHub
                </a>
              )}
              {developer.portfolio && (
                <a href={developer.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Bio */}
        {developer.bio && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold border-b border-indigo-300 dark:border-pink-600 pb-1 mb-3">
              🧠 Bio
            </h2>
            <p>{developer.bio}</p>
          </section>
        )}

        {/* Skills */}
        {developer.skills?.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold border-b border-indigo-300 dark:border-pink-600 pb-1 mb-3">
              🛠 Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {developer.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 rounded-full font-medium shadow"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {developer.experience?.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold border-b border-indigo-300 dark:border-pink-600 pb-1 mb-3">
              💼 Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {developer.experience.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Blogs */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold border-b border-indigo-300 dark:border-pink-600 pb-1 mb-3">
            📝 Blogs
          </h2>
          {blogs.length === 0 ? (
            <p className="italic">No blogs written yet.</p>
          ) : (
            <div className="space-y-4 mt-4">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-gray-100 dark:bg-gray-800/60 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                    {blog.title}
                  </h3>
                  <p className="text-xs italic">{blog.date}</p>
                  <p className="mt-2 text-sm">
                    {blog.content.length > 120 ? blog.content.slice(0, 120) + "..." : blog.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}