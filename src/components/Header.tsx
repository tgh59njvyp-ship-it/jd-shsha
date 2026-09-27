import React from 'react';
import { Camera, Moon, Sun, Bell, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationItem } from '../types';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onStartScan: () => void;
  notifications: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenAccount,
  onOpenAdmin,
  onStartScan,
  notifications,
}) => {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onStartScan}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-400 p-0.5 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-red-600 to-slate-900 dark:from-white dark:via-red-400 dark:to-slate-200 bg-clip-text text-transparent">
                CARD SCANNER
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20">
                PRO AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              ポケカ総合AI査定・コレクション管理
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Scan CTA (desktop) */}
          <button
            onClick={onStartScan}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-md shadow-red-500/25 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>AI査定</span>
          </button>

          {/* Admin badge button */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="管理者ダッシュボード"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">管理画面</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="テーマ切替"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="通知"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Account Button */}
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
              {user?.displayName || 'アカウント'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
