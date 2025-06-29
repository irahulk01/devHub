import React, { useEffect, useState } from "react";
import { fetchBlogsByAuthorId } from "../services/apiServices";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function BlogList({ authorId }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorId) return;

    fetchBlogsByAuthorId(authorId)
      .then((res) => {
        const blogData = Array.isArray(res.data) ? res.data : [];
        setBlogs(blogData.reverse());
      })
      .catch((err) => {
        console.error("Failed to fetch blogs", err);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, [authorId]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading)
    return <p className="text-gray-500 dark:text-gray-300">Loading blogs...</p>;

  if (!Array.isArray(blogs) || blogs.length === 0) {
    return <p className="italic text-gray-400">No blogs found.</p>;
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold border-b border-indigo-300 dark:border-pink-600 pb-1 mb-3">
        📝 Blogs
      </h2>
      <div className="space-y-4 mt-4">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className={`p-5 rounded-xl shadow-sm hover:shadow-md transition duration-200 border ${
              isDark
                ? 'bg-gray-800/60 border-gray-700 text-gray-100'
                : 'bg-gray-100 border-gray-200 text-gray-800'
            }`}
          >
            <Link to={`/developers/${authorId}/blogs/${blog.id}`}>
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 hover:underline">
                {blog.title}
              </h3>
            </Link>
            <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {blog.date}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              {blog.content.length > 120
                ? blog.content.slice(0, 120) + "..."
                : blog.content}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
