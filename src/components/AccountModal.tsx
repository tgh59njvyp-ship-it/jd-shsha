import React from 'react';
import { X, User, LogOut, Moon, Sun, Clock, Heart, Shield, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AccountModalProps {
  onClose: () => void;
  onOpenAppraisalHistory: () => void;
  onOpenWishlist: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  onClose,
  onOpenAppraisalHistory,
  onOpenWishlist,
}) => {
  const { user, signOut, signInWithGoogle, signInAsGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            アカウント &amp; 設定
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        {user ? (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-2xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {user.displayName || 'トレーナー'}
                </h3>
                {user.role === 'admin' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 font-black">
                    管理者
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {user.email || 'ゲストユーザー'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center space-y-3">
            <p className="text-xs text-slate-500">ログインすると査定履歴やコレクションを複数端末で同期できます。</p>
            <button
              onClick={signInWithGoogle}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
            >
              Googleアカウントでログイン
            </button>
          </div>
        )}

        {/* Menu list */}
        <div className="space-y-2 text-xs">
          <button
            onClick={() => {
              onOpenAppraisalHistory();
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-red-500" />
              <span>査定履歴を確認</span>
            </div>
          </button>

          <button
            onClick={() => {
              onOpenWishlist();
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-red-500" />
              <span>欲しいカードリスト &amp; アラート</span>
            </div>
          </button>

          <button
            onClick={toggleTheme}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>ダークモード表示切替</span>
            </div>
            <span className="text-[11px] text-slate-400 uppercase font-extrabold">{theme}</span>
          </button>
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={() => {
              signOut();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-600 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>ログアウト</span>
          </button>
        )}

      </div>
    </div>
  );
};
