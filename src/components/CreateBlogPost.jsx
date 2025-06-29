import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateBlogPost() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const author = location.state?.author;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    const newBlog = {
      ...data,
      authorId: author?.uid,
      date: new Date().toLocaleString()
    };

    try {
      await axios.post(`${import.meta.env.VITE_API}/blogs`, newBlog);
      reset();
      toast.success("Blog posted successfully!");
      navigate(`/developers/${author?.uid}`);
    } catch (err) {
      toast.error("Failed to create blog. Please try again.");
    }
  };

  const inputBaseClass = "w-full px-4 py-2 border rounded";
  const lightInput = "bg-white text-black border-gray-300";
  const darkInput = "bg-gray-800 text-white border-gray-600";

  return (
    <div
      className={`max-w-2xl mx-auto mt-10 p-6 rounded-lg shadow-lg border transition ${
        theme === "dark"
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-300"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-300">
        Create Blog Post
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`${inputBaseClass} ${
              theme === "dark" ? darkInput : lightInput
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            rows="6"
            {...register("content", { required: "Content is required" })}
            className={`${inputBaseClass} ${
              theme === "dark" ? darkInput : lightInput
            }`}
            placeholder="Write your blog content here..."
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-medium transition"
        >
          Publish
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
}
