"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/useApp";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAppStore()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/signup", {
        email,
        password,
      });

      if (res.status === 200) {
        setUser(res.data)
        router.push("/");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">

      {/* Left Section (Branding) */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-black text-white">
        <h1 className="text-5xl font-bold mb-6">DoNote</h1>
        <p className="text-lg text-gray-300 max-w-md">
          Capture your thoughts and turn them into actions instantly. Simple, fast, and built for focus.
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg border rounded-2xl p-10 shadow-sm">

          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Create Account
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="text-black mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="text-black mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-900 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Signup"}
          </button>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-black font-medium"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}