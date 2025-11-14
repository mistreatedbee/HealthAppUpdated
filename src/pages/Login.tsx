import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  ShieldCheckIcon,
  UserIcon,
  StethoscopeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "lucide-react";

/* -------------------------------------------
   SAFARI FIX — SAFE LOCAL STORAGE WRAPPER
------------------------------------------- */
function safeStorage() {
  try {
    return window.localStorage;
  } catch {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
  }
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsFormVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* -------------------------------------------
     LOGIN HANDLER (FULLY PATCHED FOR SAFARI)
  ------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      // ⭐ Safari requires a delay for localStorage writes
      await new Promise(res => setTimeout(res, 150));

      const savedUser = safeStorage().getItem("health_app_current_user");

      if (!savedUser) {
        setError("Login failed. Please try again.");
        return;
      }

      const user = JSON.parse(savedUser);

      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        if (user.role === "patient") navigate("/patient/dashboard");
        else if (user.role === "doctor") navigate("/doctor/dashboard");
        else if (user.role === "admin") navigate("/admin/dashboard");
      }, 1200);

    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/30 transition-all duration-700 transform ${
        isFormVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mb-4 shadow-xl animate-pulse">
            <HeartIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            MobileHealth
          </h1>
          <p className="text-gray-600 text-sm">Your health, our priority. Sign in to continue your journey.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in mb-6">
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 rounded-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>

        {/* Registration */}
        <div className="mt-8">
          <div className="text-center text-sm text-gray-500 mb-4">New to MobileHealth?</div>

          <Link to="/register">
            <button className="w-full py-3 border-2 border-blue-200 rounded-xl text-blue-700">
              <UserIcon className="w-4 h-4 inline-block mr-2" />
              Register as Patient
            </button>
          </Link>

          <div className="mt-3">
            <Link to="/doctor/register">
              <button className="w-full py-3 border-2 border-green-200 rounded-xl text-green-700">
                <StethoscopeIcon className="w-4 h-4 inline-block mr-2" />
                Register as Doctor
              </button>
            </Link>
          </div>
        </div>

        {/* Admin Demo */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
            <p className="font-semibold text-blue-800 text-sm">Admin Login</p>
          </div>
          <p className="text-xs text-gray-600">
            <strong>Admin:</strong> admin@health.com / admin000
          </p>
        </div>
      </div>
    </div>
  );
}
