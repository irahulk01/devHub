import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function CommentList({ comments, currentPage, commentsPerPage }) {
  const { theme } = useTheme();
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = comments.slice(startIndex, startIndex + commentsPerPage);

  return (
    <ul className="space-y-4">
      {paginatedComments.map((comment) => (
        <li
          key={comment.id}
          className={`p-3 rounded shadow border ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300 dark:border-gray-600"
              />
              <p
                className={
                  theme === "dark"
                    ? "text-sm font-semibold text-gray-200"
                    : "text-sm font-semibold text-gray-900"
                }
              >
                {comment.author}
              </p>
            </div>
            <p
              className={
                theme === "dark"
                  ? "text-xs text-gray-400"
                  : "text-xs text-gray-500"
              }
            >
              {comment.date || comment.time}
            </p>
          </div>
          <p
            className={
              theme === "dark"
                ? "mt-1 text-sm text-white"
                : "mt-1 text-sm text-black"
            }
          >
            {comment.message}
          </p>
        </li>
      ))}
    </ul>
  );
}