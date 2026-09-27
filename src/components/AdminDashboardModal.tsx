import React, { useState } from 'react';
import { X, Shield, Users, Camera, Layers, Database, AlertTriangle, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
import { getAdminStats } from '../services/adminService';
import { useToast } from '../context/ToastContext';

interface AdminDashboardModalProps {
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const { showToast } = useToast();
  const stats = getAdminStats();

  const [isSyncingPrices, setIsSyncingPrices] = useState(false);

  const handleSyncPrices = () => {
    setIsSyncingPrices(true);
    setTimeout(() => {
      setIsSyncingPrices(false);
      showToast('価格同期完了', '市場価格データを正常に更新しました');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                管理者システムダッシュボード
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI査定・統計データ・APIモニタリング・コンテンツ管理
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">価格データベース状態</p>
            <p className="text-[11px] text-slate-400">最終同期: {stats.lastPriceSync}</p>
          </div>

          <button
            onClick={handleSyncPrices}
            disabled={isSyncingPrices}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingPrices ? 'animate-spin' : ''}`} />
            <span>手動市場価格バッチ同期</span>
          </button>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <Users className="w-4 h-4 text-blue-500" />
              <span>登録ユーザー</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.totalUsers.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <Camera className="w-4 h-4 text-red-500" />
              <span>1日査定数</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.dailyAppraisals.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>総コレクション数</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.collectionItemsCount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <Database className="w-4 h-4 text-amber-500" />
              <span>登録カードDB</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.registeredCardsCount.toLocaleString()}
            </p>
          </div>

        </div>

        {/* System Health */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            AI・APIヘルス状態
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="font-bold">API呼び出し成功率</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{stats.apiSuccessRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="font-bold">AI認識エラー発生率</span>
              <span className="font-black text-slate-700 dark:text-slate-300">{stats.aiRecognitionErrorRate}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
