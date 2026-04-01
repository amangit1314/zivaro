"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/zustand/user-store";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register, loading, error } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await register(email, password);
    toast.success("Account created! Please sign in.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(239,68,68,0.3),transparent_50%)]" />
        </div>
        <div className="relative text-center space-y-6 px-12">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Join{" "}
            <span className="text-red-500">Zivaro</span>
            <br />
            today
          </h2>
          <p className="text-gray-400 text-base max-w-sm mx-auto">
            Create an account and get access to exclusive deals, order tracking,
            and more
          </p>
          <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-400 px-5 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span>Use code WELCOME10 for 10% off</span>
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
              Create your account
            </h1>
            <p className="text-sm text-gray-500">
              Fill in your details to get started
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
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-red-600 font-medium hover:text-red-700"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
