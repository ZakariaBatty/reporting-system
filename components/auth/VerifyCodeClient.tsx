"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, AlertCircle } from "lucide-react";

export function VerifyCodeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    if (code.length < 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // In demo, any 6-digit code is valid
      router.push(
        `/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`
      );
    }, 500);
  };

  const handleBack = () => {
    router.push(`/auth/forgot-password`);
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
          <p className="text-blue-100 text-lg">Verify your identity</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Verification Code</h3>
            <p className="text-blue-50 text-sm">
              We've sent a 6-digit verification code to your registered email
              address. This code will help us confirm your identity and secure
              your account recovery process.
            </p>
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
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Code
            </h2>
            <p className="text-gray-600">
              Enter the 6-digit code sent to
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-5">
            {/* Code Input */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-lg tracking-widest"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Check your email for the code
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
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>

          {/* Demo Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Demo Mode:</span> Enter any 6
              digits as the verification code.
            </p>
          </div>

          {/* Resend Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={() => setError("Code resent to " + email)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
