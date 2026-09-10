import React, { useState } from 'react';
import { Bell, MapPin, ChevronDown, Search, CheckCircle2, ShieldAlert, Store, UserCheck, X, LogIn, LogOut, Lock, Sun, Moon } from 'lucide-react';
import { AppPortal } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentLocation: string;
  onOpenLocationModal: () => void;
  onOpenSearch?: () => void;
  activePortal?: AppPortal;
  currentPortal?: AppPortal;
  onSelectPortal?: (portal: AppPortal) => void;
  onPortalChange?: (portal: AppPortal) => void;
  unreadCount?: number;
  onOpenProfile?: () => void;
  onOpenAuthModal?: () => void;
  onPortalAccessDenied?: (portal: AppPortal) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onOpenLocationModal,
  onOpenSearch,
  activePortal,
  currentPortal,
  onSelectPortal,
  onPortalChange,
  unreadCount = 2,
  onOpenProfile,
  onOpenAuthModal,
  onPortalAccessDenied,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, userRole, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const effectivePortal = activePortal || currentPortal || 'customer';

  const canAccessPortal = (portal: AppPortal): boolean => {
    if (portal === 'customer') return true;
    if (!isAuthenticated) return false;
    if (portal === 'chemist') return userRole === 'chemist' || userRole === 'admin';
    if (portal === 'admin') return userRole === 'admin';
    return false;
  };

  const handleSelectPortal = (portal: AppPortal) => {
    if (!canAccessPortal(portal)) {
      setShowPortalMenu(false);
      if (onPortalAccessDenied) onPortalAccessDenied(portal);
      else if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    if (onSelectPortal) onSelectPortal(portal);
    if (onPortalChange) onPortalChange(portal);
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Brand & Controls Row */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Left: Brand logo and Admin pill */}
        <div className="flex items-center gap-2.5">
          <div 
            onClick={() => handleSelectPortal('customer')}
            className="flex items-center gap-2 cursor-pointer select-none group"
            id="brand-logo-btn"
          >
            {/* Pill Capsule Logo */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transform -rotate-45">
                <div className="w-full h-0.5 bg-white"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">
                GenericMed
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPortalMenu(!showPortalMenu);
                }}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 uppercase tracking-wider hover:text-sky-800 transition-colors"
                id="portal-switcher-pill"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{effectivePortal === 'customer' ? 'ADMIN & MODERATION' : effectivePortal === 'chemist' ? 'CHEMIST PORTAL' : 'ADMIN CONSOLE'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Portal Switch Dropdown */}
        {showPortalMenu && (
          <div className="absolute top-14 left-4 z-50 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 text-sm animate-in fade-in slide-in-from-top-2">
            <div className="text-[11px] font-semibold text-slate-500 px-3 py-1.5 uppercase tracking-wider">
              Switch Application Role
            </div>
            {([
              { portal: 'customer' as AppPortal, label: 'Customer Discovery', desc: 'Search & compare generic savings', icon: UserCheck, color: 'bg-sky-100 text-sky-700' },
              { portal: 'chemist' as AppPortal, label: 'Chemist & Store Partner', desc: 'Live prices, inventory & orders', icon: Store, color: 'bg-emerald-100 text-emerald-700' },
              { portal: 'admin' as AppPortal, label: 'Regulatory & Admin Console', desc: 'Price gouging, audit log & compliance', icon: ShieldAlert, color: 'bg-purple-100 text-purple-700' },
            ]).map(({ portal, label, desc, icon: Icon, color }) => {
              const locked = !canAccessPortal(portal);
              return (
                <button
                  key={portal}
                  onClick={() => { handleSelectPortal(portal); setShowPortalMenu(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    effectivePortal === portal ? 'bg-sky-50 text-sky-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  } ${locked ? 'opacity-60' : ''}`}
                  id={`switch-${portal}-portal`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{label}</div>
                    <div className="text-[11px] text-slate-500">{desc}</div>
                  </div>
                  {locked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Center / Right Brand Title & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors relative"
              id="notifications-bell-btn"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Freshness Alerts & Audits</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Price Update Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Apollo Pharmacy confirmed Atorvastatin 20mg at ₹42.00/90s (4 mins ago).
                    </p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Regulatory Freshness Check</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      District FDA Bioequivalence index refreshed for Brooklyn 11201.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar / Sign In button */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer transition-colors hover:opacity-90"
                id="user-profile-avatar"
                title={user?.email}
              >
                {initials}
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm"
                id="header-signin-btn"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* User dropdown */}
            {showUserMenu && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold text-slate-900 truncate">{user?.email}</div>
                  <div className="text-[10px] text-slate-500 capitalize mt-0.5">
                    <span className={`inline-flex items-center gap-1 font-semibold ${
                      userRole === 'admin' ? 'text-purple-600' : userRole === 'chemist' ? 'text-emerald-600' : 'text-sky-600'
                    }`}>
                      {userRole === 'admin' ? '🛡️' : userRole === 'chemist' ? '🏪' : '👤'} {userRole}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenProfile}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={async () => { await logout(); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  id="header-signout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Header: Location & Search Action */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 text-slate-800 font-medium hover:text-sky-700 transition-colors"
          id="location-picker-btn"
        >
          <MapPin className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
          <span className="truncate max-w-[210px]">{currentLocation}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1 text-sky-700 hover:text-sky-800 font-semibold transition-colors"
          id="quick-search-header-btn"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </div>
    </header>
  );
};
