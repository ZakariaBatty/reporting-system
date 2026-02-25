"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";

export function ForgotPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to verification code page with email as query param
      router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 flex-col justify-between p-12">
        <div>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
            <span className="text-blue-600 font-bold text-xl">T</span>
          </div>
          <h1 className="text-white text-4xl font-bold mb-3">TransitHub</h1>
          <p className="text-blue-100 text-lg">
            Recover your account access
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Password Recovery Steps</h3>
            <div className="space-y-3 text-sm text-blue-50">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p>Enter your registered email address</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p>Verify your identity with a code</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p>Create a new password</p>
              </div>
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
          {/* Back Button */}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">
              Enter your email address and we'll help you recover your account.
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification code to this address
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Next Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Demo Mode:</span> Use any registered email from the login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
