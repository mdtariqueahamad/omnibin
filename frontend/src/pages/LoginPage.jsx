import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 400));

    const result = login(userId, password);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-eco-deep" id="login-page">
      {/* Animated Liquid Blob Background */}
      <div className="liquid-blob liquid-blob-1 animate-liquid-1" aria-hidden="true" />
      <div className="liquid-blob liquid-blob-2 animate-liquid-2" aria-hidden="true" />
      <div className="liquid-blob liquid-blob-3 animate-liquid-3" aria-hidden="true" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(52,211,153,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-slide-up">
        <div className="glass-login rounded-3xl p-8 sm:p-10">

          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-eco-emerald via-eco-teal to-eco-aqua mb-5 shadow-lg shadow-emerald-500/20 eco-glow">
              <Leaf className="w-8 h-8 text-eco-deep stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1.5">
              OmniBin
            </h1>
            <p className="text-sm text-emerald-300/70 font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Waste Intelligence Platform
            </p>
          </div>

          {/* Admin Login Form */}
          <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
            <div className="space-y-1.5">
              <label htmlFor="userId" className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider pl-1">
                User ID
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 pointer-events-none" />
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  className="glass-input pl-11"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass-input pl-11 pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/40 hover:text-emerald-400 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2 animate-fade-in" id="login-error">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 animate-pulse" />
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button-primary w-full flex items-center justify-center gap-2.5 mt-2"
              id="login-button"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 glass-divider !my-0" />
            <span className="text-[11px] font-semibold text-emerald-500/40 uppercase tracking-widest">or</span>
            <div className="flex-1 glass-divider !my-0" />
          </div>

          {/* Guest Access */}
          <button
            onClick={handleGuestAccess}
            className="glass-button-secondary w-full flex items-center justify-center gap-2.5"
            id="guest-access-button"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Continue without login</span>
          </button>

          {/* Footer Note */}
          <p className="text-center text-[11px] text-emerald-500/30 mt-6 leading-relaxed">
            Guest access provides read-only monitoring.<br />
            Admin login required for route optimization & fleet management.
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="mt-6 flex justify-center">
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-eco-emerald/40 via-eco-teal/40 to-eco-aqua/40" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
