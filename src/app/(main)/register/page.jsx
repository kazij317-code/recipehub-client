"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { authClient, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import GoogleLogin from "@/components/GoogleLogin";

const RegisterPage = () => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const image = form.image.value.trim();
    const role = "user";
    const password = form.password.value;
    const userInfo = {
      name,
      email,
      image,
      password,
      plan: "free",
      role,
    };
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    let newErrors = {};
    if (!name) {
      newErrors.name = "Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    }
    if (!image) {
      newErrors.image = "Image URL is required";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number & special character";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        ...userInfo,
      });

      // console.log("res", { error, data });

      if (data) {
        signOut();
        toast.success("Register successfully");
        router.push("/login");
      }

      if (error) {
        toast.error(error.message || "Register failed");
      }
    } catch (error) {
      toast.error("Something went wrong" || error.message);
      // console.log("error form catch block", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a] px-4 transition-all duration-300 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-cyan-600 dark:text-cyan-400 mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Join with us today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2937] text-black dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2937] text-black dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2937] text-black dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>


          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2937] text-black dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shadow-md hover:shadow-cyan-500/20 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>

          <p className="text-sm text-gray-500 dark:text-gray-400">OR</p>

          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* <button className="w-full border border-gray-300 dark:border-gray-600 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-[#1f2937] transition-all duration-300 text-gray-700 dark:text-white font-medium">
          <FcGoogle />
          Continue with Google
        </button> */}
        {/* Google */}
        <div className="border rounded-xl p-1 hover:shadow-md transition">
          <GoogleLogin />
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
