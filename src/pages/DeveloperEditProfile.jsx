import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../firebase";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function DeveloperEditProfile() {
  const storedUser = JSON.parse(localStorage.getItem("devhub-user"));
  const uid = auth.currentUser?.uid || storedUser?.uid;
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  useEffect(() => {
    const isDarkClassPresent = document.documentElement.classList.contains("dark");
  }, [theme]);
  const developerFromState = location.state?.developer;
  const fromGoogle = location.state?.fromGoogle || false;

  const inputClass = theme === "dark"
    ? "w-full px-4 py-2 border rounded bg-gray-900 text-white border-gray-700"
    : "w-full px-4 py-2 border rounded bg-white text-black border-gray-300";

  const textareaClass = theme === "dark"
    ? "w-full px-4 py-2 border rounded bg-gray-800 text-white border-gray-600"
    : "w-full px-4 py-2 border rounded bg-white text-black border-gray-300";

  const skillInputClass = theme === "dark"
    ? "flex-1 px-3 py-2 border rounded bg-gray-900 text-white border-gray-600"
    : "flex-1 px-3 py-2 border rounded bg-white text-black border-gray-300";

  const validationSchema = yup.object({
    name: yup
  .string()
  .required("Full name is required")
  .test("has-last-name", "Please include both first and last name", (value) => {
    return value?.trim().split(" ").length >= 2;
  }),
    avatar: yup
      .string()
      .url("Invalid image URL")
      .required("Avatar is required"),
    githubLink: yup.string().url("Invalid GitHub URL").nullable(),
    location: fromGoogle
      ? yup.string().required("Location is required")
      : yup.string().nullable(),
    title: fromGoogle
      ? yup.string().required("Professional Title is required")
      : yup.string().nullable(),
    bio: yup.string().max(300, "Bio can't exceed 300 characters"),
    skills: yup
      .array()
      .of(yup.string().required("Skill required"))
      .min(2, "At least 2 skills"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      avatar: "",
      githubLink: "",
      location: "",
      title: "",
      bio: "",
      skills: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });
  const values = watch("skills");
const nameWatch = watch("name");
const lastName = nameWatch?.trim().split(" ").slice(-1)[0] || "";
  const avatarWatch = watch("avatar");

  useEffect(() => {
    if (
      nameWatch &&
      (!avatarWatch || avatarWatch.includes("ui-avatars.com/api"))
    ) {
      const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nameWatch
      )}`;
      setValue("avatar", url);
    }
  }, [nameWatch]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    if (developerFromState) {
      Object.entries(developerFromState).forEach(([key, value]) => {
        if (key !== "skills") setValue(key, value || "");
      });
      setValue(
        "skills",
        developerFromState.skills?.length ? developerFromState.skills : []
      );
      setLoading(false);
    } else {
      axios
        .get(`${import.meta.env.VITE_API}/developers?uid=${uid}`)
        .then((res) => {
          const user = res.data[0];
          if (!user) return toast.error("User not found, please fill the details");
          Object.entries(user).forEach(([key, value]) => {
            if (key !== "skills") setValue(key, value || "");
          });
          setValue("skills", user.skills?.length ? user.skills : []);
        })
        .catch(() => toast.error("Failed to load profile"))
        .finally(() => setLoading(false));
      // Fill fields from localStorage if developerFromState is missing and UID is available
      if (!developerFromState && storedUser) {
        if (storedUser.displayName) {
          setValue("name", storedUser.displayName);
          const autoAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(storedUser.displayName)}`;
          setValue("avatar", autoAvatar);
        }
        if (storedUser.email) {
          setValue("githubLink", `https://github.com/${storedUser.email.split("@")[0]}`);
        }
      }
    }
  }, [uid]);

const onSubmit = async (data) => {
  try {
    data.skills = data.skills.filter(Boolean);

    const response = await axios.get(`${import.meta.env.VITE_API}/developers?uid=${uid}`);
    const user = response.data[0];

    if (user) {
      await axios.put(`${import.meta.env.VITE_API}/developers/${user.id}`, {
        ...user,
        ...data,
      });
    } else {
      await axios.post(`${import.meta.env.VITE_API}/developers`, {
        uid,
        email: auth.currentUser?.email,
        ...data,
      });
    }

    toast.success("Profile saved!");
    navigate("/");
  } catch (err) {
    toast.error("Failed to save profile");
  }
};

  if (loading)
    return (
      <div className="p-6 text-center text-gray-400 dark:text-gray-500">
        Loading...
      </div>
    );

  return (
  <div
    className={`max-w-2xl mx-auto mt-8 p-4 sm:p-6 rounded-xl shadow-md border transition-colors duration-300 ${
      theme === "dark"
        ? "bg-gray-900 text-gray-100 border-gray-700"
        : "bg-white text-gray-900 border-gray-300"
    }`}
  >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
        Edit Profile
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {[
          { name: "name", label: "Full Name" },
          { name: "avatar", label: "Avatar URL" },
          { name: "githubLink", label: "GitHub Link" },
          { name: "location", label: "Location" },
          { name: "title", label: "Professional Title" },
        ].map(({ name, label }) => (
          <div key={name} className="col-span-1">
            <label className={`block mb-1 text-sm font-medium ${
              theme === "dark" ? "text-gray-300" : "text-black"
            }`}>
              {label}
            </label>
            <input
              type="text"
              {...register(name)}
              className={inputClass}
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
            )}
          </div>
        ))}

        {/* Bio */}
        <div className="md:col-span-2">
          <label className={`block mb-1 text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-black"
          }`}>
            Bio
          </label>
         <textarea
            rows={3}
            {...register("bio")}
            className={textareaClass}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <label className={`block mb-1 text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-black"
          }`}>
            Skills
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative group bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-lg font-semibold shadow-md"
              >
                {values?.[index] || ""}
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-opacity duration-200 ease-in-out cursor-pointer"
                    title="Remove skill">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Skill Input */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Add a skill and press Enter"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newSkill.trim()) {
                  e.preventDefault();
                  if (!values.includes(newSkill.trim())) {
                    append(newSkill.trim());
                    setNewSkill("");
                  }
                }
              }}
              className={skillInputClass}
            />
            <button
              type="button"
              onClick={() => {
                if (newSkill.trim() && !values.includes(newSkill.trim())) {
                  append(newSkill.trim());
                  setNewSkill("");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Error below skills */}
          {errors.skills && typeof errors.skills.message === "string" && (
            <p className="text-red-500 text-sm mt-2">{errors.skills.message}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}