import React, { useEffect, useState, useRef } from "react";
import { fetchBlogsByAuthorId, deleteBlog } from "../services/apiServices";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function BlogList({ authorId }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, blogId: null });

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

  const navigate = useNavigate();

  const handleDelete = (blogId) => {
    setConfirmDialog({ open: true, blogId });
  };

  const confirmDelete = async () => {
    try {
      await deleteBlog(confirmDialog.blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== confirmDialog.blogId));
    } catch (err) {
      console.error("Failed to delete blog", err);
    } finally {
      setConfirmDialog({ open: false, blogId: null });
    }
  };

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setConfirmDialog({ open: false, blogId: null });
      }
    };

    if (confirmDialog.open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [confirmDialog]);

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
            className={`p-6 rounded-xl shadow-md transition duration-300 border relative ${
              isDark
                ? 'bg-gray-900 border-gray-700 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <div className="flex justify-between items-start">
              <Link to={`/developers/${authorId}/blogs/${blog.id}`}>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 hover:underline">
                  {blog.title}
                </h3>
              </Link>
              <div className="relative">
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                >
                  🗑
                </button>
                {confirmDialog.open && confirmDialog.blogId === blog.id && (
                  <div
                    ref={popupRef}
                    className={`absolute right-0 mt-2 z-50 p-4 rounded shadow-lg border ${
                      isDark
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Confirm Deletion</h3>
                    <p className={`text-xs mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Are you sure you want to delete this blog?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setConfirmDialog({ open: false, blogId: null })}
                        className={`px-3 py-1 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600 ${
                          isDark
                            ? "bg-gray-700 text-gray-200"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {blog.date}
            </p>
            <p className={`text-sm mt-1 leading-relaxed ${
              isDark
                ? 'text-gray-200'
                : 'text-gray-800'
            }`}>
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
