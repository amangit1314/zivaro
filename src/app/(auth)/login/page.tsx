"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/zustand/user-store";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, loading, error } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.3),transparent_50%)]" />
        </div>
        <div className="relative text-center space-y-6 px-12">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Welcome back to
            <br />
            <span className="text-red-500">Zivaro</span>
          </h2>
          <p className="text-gray-400 text-base max-w-sm mx-auto">
            Sign in to access your cart, orders, and exclusive deals
          </p>
          <div className="flex items-center justify-center space-x-8 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">200+</p>
              <p className="text-xs text-gray-500">Products</p>
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4.8</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-gray-500">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-red-500 font-extrabold">Z</span>ivaro
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-6">
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-500">
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <span className="text-xs text-gray-400">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-red-600 font-medium hover:text-red-700"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
