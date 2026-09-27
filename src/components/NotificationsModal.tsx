import React from 'react';
import { X, Bell, CheckCheck, TrendingDown, Package, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectCardById?: (cardId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectCardById,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600 dark:text-red-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              通知センター
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              全件既読
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  onMarkAsRead(n.id);
                  if (n.linkCardId && onSelectCardById) {
                    onSelectCardById(n.linkCardId);
                    onClose();
                  }
                }}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer space-y-1 ${
                  n.isRead
                    ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-red-500/5 dark:bg-red-500/10 border-red-500/30 text-slate-900 dark:text-white font-medium'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-600 dark:text-red-400">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              通知はありません
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
