import React, { useState } from 'react';
import { X, Mail, Lock, User, Store, ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  /** Message shown at top of modal to explain why login was requested */
  promptMessage?: string;
}

type Tab = 'login' | 'signup';

const DEMO_ACCOUNTS = [
  { role: 'Customer',         email: 'customer@genericmed.app',  password: 'Demo1234!', icon: User,        color: 'text-sky-600',    bg: 'bg-sky-50',    border: 'border-sky-200'  },
  { role: 'Chemist Partner',  email: 'chemist@genericmed.app',   password: 'Demo1234!', icon: Store,       color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { role: 'Admin',            email: 'admin@genericmed.app',     password: 'Demo1234!', icon: ShieldCheck, color: 'text-purple-600',  bg: 'bg-purple-50', border: 'border-purple-200' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  promptMessage,
}) => {
  const { login, signup } = useAuth();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setSelectedRole('customer');
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setIsLoading(true);
    setError(null);
    const { error: err } = await login(email, password);
    setIsLoading(false);
    if (err) { setError(err); return; }
    onClose();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setIsLoading(true);
    setError(null);
    const { error: err } = await signup(email, password, selectedRole, fullName);
    setIsLoading(false);
    if (err) { setError(err); return; }
    setSuccess('Account created! Check your email to confirm, then sign in.');
    setTab('login');
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    setError(null);
    const { error: err } = await login(demoEmail, demoPassword);
    setIsLoading(false);
    if (err) {
      setError('Demo account not found. Please sign up first or run npm run seed to populate the database.');
      setEmail(demoEmail);
      setPassword(demoPassword);
      return;
    }
    onClose();
  };

  const roleOptions: { value: UserRole; label: string; desc: string; icon: React.ElementType; color: string; bg: string }[] = [
    { value: 'customer', label: 'Customer',        desc: 'Search & reserve medicines',  icon: User,        color: 'text-sky-700',    bg: 'bg-sky-50' },
    { value: 'chemist',  label: 'Chemist Partner', desc: 'Manage inventory & orders',   icon: Store,       color: 'text-emerald-700', bg: 'bg-emerald-50' },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header gradient */}
        <div className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 px-6 pt-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transform -rotate-45">
                  <div className="w-full h-0.5 bg-white" />
                </div>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">GenericMed</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              id="auth-modal-close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {promptMessage && (
            <div className="mb-3 text-xs text-white/80 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
              {promptMessage}
            </div>
          )}

          <h2 className="text-white font-bold text-2xl mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-white/70 text-sm">
            {tab === 'login'
              ? 'Sign in to reserve medicines and access your portal'
              : 'Join GenericMed to save money on generic medicines'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex -mt-5 mx-6 bg-slate-100 rounded-xl p-1 shadow-sm">
          {(['login', 'signup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === t
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              id={`auth-tab-${t}`}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div className="px-6 pt-5 pb-6 space-y-4">

          {/* Success message */}
          {success && (
            <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-slate-50 placeholder:text-slate-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-slate-50 placeholder:text-slate-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="auth-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => handleTabChange('signup')} className="text-sky-600 font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-slate-50 placeholder:text-slate-400"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-slate-50 placeholder:text-slate-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-slate-50 placeholder:text-slate-400"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">I am a…</label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map(({ value, label, desc, icon: Icon, color, bg }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedRole(value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedRole === value
                          ? `border-sky-500 ${bg}`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      id={`auth-role-${value}`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${selectedRole === value ? color : 'text-slate-400'}`} />
                      <div className={`text-xs font-bold ${selectedRole === value ? color : 'text-slate-700'}`}>
                        {label}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="auth-signup-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <button type="button" onClick={() => handleTabChange('login')} className="text-sky-600 font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Demo accounts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Demo accounts</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map(({ role, email: dEmail, password: dPass, icon: Icon, color, bg, border }) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(dEmail, dPass)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border ${border} ${bg} hover:opacity-90 transition-opacity text-left group disabled:opacity-50`}
                  id={`demo-login-${role.toLowerCase().replace(' ', '-')}`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold ${color}`}>{role}</div>
                    <div className="text-[10px] text-slate-500 truncate">{dEmail}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
