import React, { useState } from 'react';
import { X, Heart, Plus, TrendingUp, Layers, Bell, Check, ShieldCheck, Sparkles, Tag, Calendar, Share2 } from 'lucide-react';
import { Card, CollectionItem, ConditionRank, DuplicateTag, WishlistItem } from '../types';
import { formatYen, getPriceHistory, formatPriceRange } from '../services/priceService';
import { useToast } from '../context/ToastContext';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
  collectionItem?: CollectionItem;
  wishlistItem?: WishlistItem;
  onAddToCollection: (card: Card, options?: { condition?: ConditionRank; quantity?: number }) => void;
  onToggleWishlist: (card: Card, targetPrice?: number) => void;
  onStartScan: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  collectionItem,
  wishlistItem,
  onAddToCollection,
  onToggleWishlist,
  onStartScan,
}) => {
  const { showToast } = useToast();

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState<number>(
    card?.marketPrice ? Math.round(card.marketPrice * 0.9) : 5000
  );

  if (!card) return null;

  const priceHistory = getPriceHistory(card, timeframe);

  const isWishlisted = Boolean(wishlistItem);

  // SVG Chart path calculation
  const maxHistoryPrice = Math.max(...priceHistory.map(p => p.price), card.marketPrice || 1000);
  const minHistoryPrice = Math.min(...priceHistory.map(p => p.price), card.marketPrice || 1000);
  const priceRangeDiff = Math.max(1, maxHistoryPrice - minHistoryPrice);

  const pointsSvg = priceHistory.map((pt, i) => {
    const x = (i / (priceHistory.length - 1)) * 300;
    const y = 100 - ((pt.price - minHistoryPrice) / priceRangeDiff) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Split: Image & Info */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          <div className="w-full md:w-56 shrink-0 text-center">
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-48 md:w-full h-auto mx-auto object-cover rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('リンクをコピーしました');
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>カードをシェア</span>
            </button>
          </div>

          <div className="flex-1 space-y-4 min-w-0 w-full">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-black">
                  {card.rarity}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {card.cardType}
                </span>
                <span className="text-xs text-slate-400">{card.cardNumber}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {card.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.set} ({card.setCode})</p>
            </div>

            {/* Market Prices Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>現在相場 (参考査定価格)</span>
                <span className="text-amber-400 font-bold">{card.priceSource || '市場データ'}</span>
              </div>

              {card.hasPriceData ? (
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-amber-300">
                    {formatYen(card.marketPrice)}
                  </p>
                  <p className="text-xs text-slate-400">
                    ({formatPriceRange(card.minPrice, card.maxPrice)})
                  </p>
                </div>
              ) : (
                <p className="text-sm font-bold text-amber-400">
                  現在の市場価格データを取得できません
                </p>
              )}

              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                最終更新: {card.priceUpdatedAt || '2026-09-26 21:00'} | 本価格は参考情報です。実際の買取価格を保証するものではありません。
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  onAddToCollection(card);
                  showToast('コレクションに追加しました', card.name);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>コレクションに追加 {collectionItem ? `(現在${collectionItem.quantity}枚)` : ''}</span>
              </button>

              <button
                onClick={() => onToggleWishlist(card, targetPriceInput)}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  isWishlisted
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isWishlisted ? '欲しいリスト登録中' : '欲しいリストに追加'}</span>
              </button>

              <button
                onClick={() => setShowPriceAlertModal(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                title="価格アラートを設定"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>アラート</span>
              </button>
            </div>

          </div>

        </div>

        {/* Price History Section */}
        {card.hasPriceData && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                価格推移グラフ
              </h3>

              <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
                {(['7d', '30d', '90d', '1y'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      timeframe === tf ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative h-32 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsSvg}
                />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>{priceHistory[0]?.date}</span>
                <span>{priceHistory[priceHistory.length - 1]?.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Price Alert Modal Inline */}
        {showPriceAlertModal && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-3">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Bell className="w-4 h-4" />
              価格アラート設定
            </h4>
            <p className="text-slate-600 dark:text-slate-300">
              設定目標価格以下に値下がりした際に通知を生成します。
            </p>

            <div className="flex items-center gap-2">
              <span className="font-bold">目標価格: ¥</span>
              <input
                type="number"
                value={targetPriceInput}
                onChange={e => setTargetPriceInput(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-bold w-36"
              />
              <button
                onClick={() => {
                  onToggleWishlist(card, targetPriceInput);
                  setShowPriceAlertModal(false);
                  showToast('価格アラートを設定しました', `目標価格: ¥${targetPriceInput.toLocaleString()}`);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs"
              >
                保存
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
