

import React from "react";

export default function SkillInput({ skills, append, newSkill, setNewSkill }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Add skills (separate with comma or press Enter)"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && newSkill.trim()) {
            e.preventDefault();
            const entries = newSkill
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s && !skills.includes(s));
            entries.forEach((entry) => append(entry));
            setNewSkill("");
          }
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800"
      />
      <button
        type="button"
        onClick={() => {
          if (newSkill.trim()) {
            const entries = newSkill
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s && !skills.includes(s));
            entries.forEach((entry) => append(entry));
            setNewSkill("");
          }
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm cursor-pointer"
      >
        Add
      </button>
    </div>
  );
}