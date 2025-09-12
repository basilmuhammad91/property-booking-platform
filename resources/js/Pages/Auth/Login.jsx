import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "basilmuhammad91@gmail.com",
    password: "",
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-background sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Property Account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
                placeholder="Enter your email"
                className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.email && (
                <div className="mt-1 text-sm text-red-500">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
                placeholder="Enter your password"
                className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.password && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData("remember", e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="block ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/password/reset"
                className="font-medium transition-colors duration-200 text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={processing}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-200 border border-transparent rounded-md bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              href="/register"
              className="font-medium transition-colors duration-200 text-primary hover:text-primary/80"
            >
              Don&apos;t have an account?{" "}
              <span className="underline">Sign up</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
