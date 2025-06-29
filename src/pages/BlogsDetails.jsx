import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CommentList = lazy(() => import("../components/CommentList"));

export default function BlogDetail() {
  const { id, authorId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [authorInfo, setAuthorInfo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  const queryClient = useQueryClient();
  const {
    data: comments = [],
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API}/comments?blogId=${id}`);
      return res.data || [];
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!id || !authorId) return;

    axios
      .get(`${import.meta.env.VITE_API}/blogs`, {
        params: { id, authorId }
      })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBlog(res.data[0]);
        } else {
          setBlog(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch blog", err);
        setBlog(null);
      })
      .finally(() => setLoading(false));
  }, [id, authorId]);

  useEffect(() => {
    if (!authorId) return;

    axios
      .get(`${import.meta.env.VITE_API}/developers?uid=${authorId}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAuthorInfo(res.data[0]);
        } else {
          setAuthorInfo(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch author info", err);
        setAuthorInfo(null);
      });
  }, [authorId]);

  if (loading) return <div className="p-6">Loading blog...</div>;
  if (!blog) return <div className="p-6 text-red-500">Blog not found.</div>;

  const loggedInUser = JSON.parse(localStorage.getItem("devhub-user"));
  const isAuthor = String(loggedInUser?.uid) === String(blog?.authorId);

  return (
    <main className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-800"
    }`}>
      <div className={`max-w-3xl mx-auto rounded-xl shadow-lg p-6 sm:p-8 border transition ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100 border-gray-700"
          : "bg-white text-gray-900 border-gray-300"
      }`}>
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back
        </button>
        {isAuthor && (
          <div className="mb-4 text-right">
            <button
              onClick={() => navigate(`/createBlogPost`, { state: { blog } })}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded shadow transition"
            >
              ✏️ Edit Blog
            </button>
          </div>
        )}
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
          {blog.title}
        </h1>
        {authorInfo && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
            <img
              src={authorInfo.avatar}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>
              By <span className="font-semibold">{authorInfo.name}</span>
            </span>
          </div>
        )}
        <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
          {blog.date}
        </p>
        <article
          className={`prose max-w-none text-base leading-relaxed ${
            theme === "dark"
              ? "prose-invert bg-gray-800 text-white"
              : "bg-gray-100 text-gray-900"
          } p-4 rounded`}
        >
          <pre className="whitespace-pre-wrap overflow-x-auto text-sm">
            <code>{blog.content}</code>
          </pre>
        </article>
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3 border-b pb-1 border-indigo-300 dark:border-pink-600">
            Comments
          </h2>
          <Suspense fallback={<p className="text-gray-500 dark:text-gray-300">Loading comments...</p>}>
            <CommentList
              comments={comments}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              commentsPerPage={commentsPerPage}
            />
          </Suspense>
        </section>
        {/* Comment Submission Form */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Leave a Comment</h3>
          <form
            onSubmit={handleSubmit(async (data) => {
              const user = JSON.parse(localStorage.getItem("devhub-user"));
              const author =
                typeof user?.name === "string" && user.name.trim()
                  ? user.name.trim()
                  : typeof user?.email === "string" && user.email.includes("@")
                  ? user.email.split("@")[0]
                  : "Anonymous";
              const avatar = user?.avatar || `https://ui-avatars.com/api/?name=${author}`;
              const message = data.message?.trim();
              if (!message) return;

              const newComment = {
                blogId: id,
                author,
                avatar,
                message,
                date: new Date().toLocaleString(),
              };

              try {
                const res = await axios.post(`${import.meta.env.VITE_API}/comments`, newComment);
                queryClient.invalidateQueries(["comments", id]);
                reset();
              } catch (error) {
                console.error("Failed to post comment:", error);
                alert("Failed to post comment.");
              }
            })}
            className="space-y-4"
          >
            <textarea
              {...register("message", { required: "Comment cannot be empty." })}
              rows="3"
              placeholder="Your comment..."
              className={`w-full px-3 py-2 border rounded transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                  : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Post Comment
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}