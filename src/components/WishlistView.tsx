import React from 'react';
import { Heart, Bell, Trash2, Eye, Plus, TrendingDown } from 'lucide-react';
import { Card, WishlistItem } from '../types';
import { formatYen } from '../services/priceService';

interface WishlistViewProps {
  wishlistItems: WishlistItem[];
  onToggleWishlist: (card: Card) => void;
  onOpenCardDetail: (card: Card) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistItems,
  onToggleWishlist,
  onOpenCardDetail,
}) => {
  return (
    <div className="space-y-6 pb-24 md:pb-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500" />
            欲しいカードリスト &amp; 価格アラート
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            目標購入価格を設定し、市場価格が目標値以下になった際に自動通知を受け取ります。
          </p>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistItems.map(item => {
            const isTargetReached = item.card.hasPriceData && (item.card.marketPrice || 0) <= item.targetPrice;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex gap-4 ${
                  isTargetReached
                    ? 'bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <img
                  src={item.card.imageUrl}
                  alt={item.card.name}
                  onClick={() => onOpenCardDetail(item.card)}
                  className="w-20 sm:w-24 h-auto object-cover rounded-xl shadow-md cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        {item.card.rarity}
                      </span>
                      {isTargetReached && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                          <Bell className="w-3 h-3" />
                          目標達成！
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onOpenCardDetail(item.card)}
                      className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate cursor-pointer hover:underline mt-1"
                    >
                      {item.card.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.card.set}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 my-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">現在価格:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.card.hasPriceData ? formatYen(item.card.marketPrice) : '価格なし'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">目標アラート価格:</span>
                      <span className="font-extrabold text-red-600 dark:text-red-400">
                        {formatYen(item.targetPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onOpenCardDetail(item.card)}
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>詳細を見る</span>
                    </button>

                    <button
                      onClick={() => onToggleWishlist(item.card)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      title="リストから削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-300">欲しいカードが登録されていません</p>
          <p className="text-xs text-slate-400">カード詳細ページから「欲しいカード」に追加できます。</p>
        </div>
      )}

    </div>
  );
};
