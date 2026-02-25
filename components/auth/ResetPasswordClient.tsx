"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");

  useEffect(() => {
    if (!email || !code) {
      router.push("/auth/forgot-password");
    }
  }, [email, code, router]);

  const calculatePasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return "weak";
    if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return "strong";
    return "medium";
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = resetPassword(email, password);
      setLoading(false);

      if (success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }, 500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-green-700 flex-col justify-between p-12">
          <div>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
              <span className="text-green-600 font-bold text-xl">T</span>
            </div>
            <h1 className="text-white text-4xl font-bold mb-3">TransitHub</h1>
            <p className="text-green-100 text-lg">Password reset successful</p>
          </div>

          <div className="pt-6 border-t border-green-500/30">
            <p className="text-green-50 text-xs">
              © 2026 TransitHub. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 flex-col justify-between p-12">
        <div>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
            <span className="text-blue-600 font-bold text-xl">T</span>
          </div>
          <h1 className="text-white text-4xl font-bold mb-3">TransitHub</h1>
          <p className="text-blue-100 text-lg">Create a new password</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">
              Password Requirements
            </h3>
            <div className="space-y-2 text-sm text-blue-50">
              <p>✓ At least 6 characters long</p>
              <p>
                ✓ For stronger security, use uppercase, numbers, and symbols
              </p>
              <p>✓ Don't reuse old passwords</p>
            </div>
          </div>

          <div className="pt-6 border-t border-blue-500/30">
            <p className="text-blue-50 text-xs">
              © 2026 TransitHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16">
        <div className="max-w-sm w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Password
            </h2>
            <p className="text-gray-600">
              Enter a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      passwordStrength === "weak"
                        ? "bg-red-400"
                        : passwordStrength === "medium"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                    }`}
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength === "weak"
                      ? "Weak"
                      : passwordStrength === "medium"
                        ? "Medium"
                        : "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {password && confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    password === confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {password === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
