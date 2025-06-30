import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getFirebaseErrorMessage } from "../utils/firebaseErrorMessages";
import SkillInput from "../components/SkillInput";

const schema = yup.object({
  name: yup.string().required("Full name is required").min(3),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  skills: yup
    .array()
    .of(yup.string().required("Skill is required"))
    .min(2, "Please enter at least 2 skills"),
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      skills: [],
    },
  });

  const skills = watch("skills");

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

useEffect(() => {
  getRedirectResult(auth)
    .then(async (result) => {
      if (result?.user) {
        const isNew = await saveUserToDB(result.user);
        if (isNew) {
          navigate("/profile/edit", { state: { fromGoogle: true } });
        } else {
          navigate(`/developers/${result.user.uid}`);
        }
      }
    })
    .catch((err) => {
    });
}, []);

const saveUserToDB = async (user, name = "", skills = []) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}/developers?uid=${user.uid}`);
    if (res.data.length > 0) {
      return false; // Already exists
    }

    await axios.post(`${import.meta.env.VITE_API}/developers`, {
      uid: user.uid,
      name: name || "Anonymous",
      email: user.email,
      avatar: user.photoURL || `https://ui-avatars.com/api/?name=${name || "User"}`,
      skills,
    });

    return true; // New user added
  } catch (err) {
    return false;
  }
};

  const onSubmit = async (data) => {
    try {
      const check = await axios.get(`${import.meta.env.VITE_API}/developers?email=${data.email}`);
      if (check.data.length > 0) {
        setError("email", { type: "manual", message: "Email already exists. Please use a different one." });
        return;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const saved = await saveUserToDB(user, data.name, data.skills);
      if (saved) {
        navigate("/profile/edit", { state: { fromGoogle: true } });
      } else {
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("email", { type: "manual", message: "Email already in use." });
      } else if (err.code === "auth/weak-password") {
        setError("password", { type: "manual", message: "Password must be at least 6 characters." });
      } else {
        setError("email", { type: "manual", message: getFirebaseErrorMessage(err.code || "auth/unknown") });
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToDB(result.user, result.user.displayName || "", []);
      navigate("/");
    } catch (popupError) {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError) {
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          Create Your Account
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Your full name"
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } text-gray-800 rounded`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="your@email.com"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-gray-800 rounded`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="At least 6 characters"
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } text-gray-800 rounded`}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-2.5 right-3 cursor-pointer text-sm text-gray-500 select-none"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">Skills</label>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative group bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow"
                >
                  {skills[index]}
                  {skills.length > 2 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Skill Input */}
            <SkillInput
              skills={skills}
              append={append}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
            />

            {Array.isArray(errors.skills) &&
              errors.skills.some((e) => e?.message) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.skills.find((e) => e?.message)?.message}
                </p>
              )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignup}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
        >
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}