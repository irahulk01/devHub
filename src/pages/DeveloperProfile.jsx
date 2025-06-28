import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DeveloperProfile() {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/developers?id=${id}`)
      .then((res) => {
        const dev = res.data[0];
        setDeveloper(dev);
      })
      .catch((err) => console.error("Error loading developer data", err));

    axios
      .get(`${import.meta.env.VITE_API}/blogs?authorId=${id}`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error loading blogs", err));
  }, [id]);

  if (!developer) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen text-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <img
            src={developer.avatar}
            alt={developer.name}
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-pink-400 shadow-md"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 dark:text-pink-400 drop-shadow-md">
              {developer.name}
            </h1>
            <p className="text-sm sm:text-md mt-1 text-gray-600 dark:text-gray-300">
              {developer.title || "Developer"} • {developer.location || "Unknown"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 justify-center sm:justify-start">
              <a
                href={developer.githubLink}
                target="_blank"
                className="text-blue-400 hover:text-blue-600 underline"
                rel="noreferrer"
              >
                GitHub
              </a>
              {developer.portfolio && (
                <a
                  href={developer.portfolio}
                  target="_blank"
                  className="text-blue-400 hover:text-blue-600 underline"
                  rel="noreferrer"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 border-b border-indigo-300 pb-1">
            🧠 Bio
          </h2>
          <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
            {developer.bio}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 border-b border-indigo-300 pb-1">
            🛠 Skills
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {developer.skills.map((skill) => (
              <span
                key={skill}
                className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow hover:scale-105 transition-transform"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 border-b border-indigo-300 pb-1">
            📝 Blogs
          </h2>
          {blogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">No blogs written by this developer yet.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 dark:text-indigo-300">
                    {blog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic">
                    {blog.date}
                  </p>
                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                    {blog.content.length > 120
                      ? blog.content.slice(0, 120) + "..."
                      : blog.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}