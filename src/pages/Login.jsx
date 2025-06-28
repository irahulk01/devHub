import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { getFirebaseErrorMessage } from "../utils/firebaseErrorMessages";
import axios from "axios";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  //  Only handle redirect once on page load
useEffect(() => {
  getRedirectResult(auth)
    .then(async (result) => {
      if (result?.user) {
        const uid = result.user.uid;
        const res = await axios.get(`${import.meta.env.VITE_API}/developers?uid=${uid}`);
        if (res.data.length > 0) {
          navigate("/");
        } else {
          navigate("/profile/edit", { state: { fromGoogle: true } });
        }
      }
    })
    .catch((err) => {
      const message = getFirebaseErrorMessage(err.code);
      setFirebaseError(message);
    });
}, []);

  const onSubmit = async (data) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (err) {
      const message = getFirebaseErrorMessage(err.code);
      setFirebaseError(message);
    }
  };

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const uid = result.user.uid;

    const res = await axios.get(`${import.meta.env.VITE_API}/developers?uid=${uid}`);
    if (res.data.length > 0) {
      navigate("/"); // Profile exists
    } else {
      // First time login, collect profile info
      navigate("/profile/edit", { state: { fromGoogle: true } });
    }
  } catch (popupError) {
    // fallback
    await signInWithRedirect(auth, googleProvider);
  }
};

  const clearFirebaseError = () => {
    if (firebaseError) setFirebaseError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          Login to DevHub
        </h2>

        {firebaseError && (
          <div
            className="bg-red-100 text-red-700 p-2 rounded text-sm text-center mb-4"
            title={firebaseError}
          >
            {firebaseError.length > 100
              ? `${firebaseError.slice(0, 100)}...`
              : firebaseError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              onFocus={clearFirebaseError}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                {...register("password")}
                onFocus={clearFirebaseError}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-2.5 right-3 cursor-pointer text-sm text-gray-500 select-none"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}