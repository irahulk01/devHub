import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DeveloperProfile() {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const loggedInUid = JSON.parse(localStorage.getItem("devhub-user"))?.uid;
  

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/developers?uid=${id}`)
      .then((res) => setDeveloper(res.data[0]))
      .catch((err) => console.error("Error loading developer", err));

    axios.get(`${import.meta.env.VITE_API}/blogs?authorId=${id}`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error loading blogs", err));
  }, [id]);

  if (!developer) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const isOwnProfile = String(developer.uid) === String(loggedInUid);

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 transition">
        {isOwnProfile && (
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/profile/edit", { state: { developer } })}
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Edit Profile ✏️
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
          <img
            src={developer.avatar}
            alt={developer.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500 shadow"
          />
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-3xl font-bold text-indigo-700 dark:text-pink-400">{developer.name}</h1>
            {developer.title && (
              <p className="text-sm text-gray-500 dark:text-gray-300">{developer.title}</p>
            )}
            {developer.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">📍 {developer.location}</p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
              {developer.githubLink && (
                <a href={developer.githubLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                  GitHub
                </a>
              )}
              {developer.portfolio && (
                <a href={developer.portfolio} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {developer.bio && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold border-b border-indigo-200 dark:border-indigo-600 mb-2 pb-1">
              🧠 Bio
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{developer.bio}</p>
          </section>
        )}

        {/* Skills */}
        {developer.skills?.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold border-b border-indigo-200 dark:border-indigo-600 mb-2 pb-1">
              🛠 Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {developer.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-sm"
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
            <h2 className="text-xl font-semibold border-b border-indigo-200 dark:border-indigo-600 mb-2 pb-1">
              💼 Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {developer.experience.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Blogs */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold border-b border-indigo-200 dark:border-indigo-600 mb-2 pb-1">
            📝 Blogs
          </h2>
          {blogs.length === 0 ? (
            <p className="text-gray-400 italic mt-2">No blogs written yet.</p>
          ) : (
            <div className="space-y-4 mt-4">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {blog.date}
                  </p>
                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-sm">
                    {blog.content.length > 120 ? blog.content.slice(0, 120) + "..." : blog.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}