import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Lock, Sparkles, Filter, Search, Award } from 'lucide-react';
import { Card, CollectionItem, SetInfo } from '../types';
import { INITIAL_SETS } from '../services/cardDatabase';

interface PokedexViewProps {
  allDatabaseCards: Card[];
  collectionItems: CollectionItem[];
  onOpenCardDetail: (card: Card) => void;
}

export const PokedexView: React.FC<PokedexViewProps> = ({
  allDatabaseCards,
  collectionItems,
  onOpenCardDetail,
}) => {
  const [selectedSetCode, setSelectedSetCode] = useState<string>('ALL');
  const [showOnlyOwned, setShowOnlyOwned] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const ownedCardIds = new Set(collectionItems.map(i => i.cardId));

  const totalUniqueOwned = ownedCardIds.size;
  const totalDatabaseCardsCount = 1240; // Total expansion cards database benchmark
  const overallPercentage = ((totalUniqueOwned / totalDatabaseCardsCount) * 100).toFixed(1);

  // Filter cards for display
  const filteredCards = allDatabaseCards.filter(card => {
    const isOwned = ownedCardIds.has(card.id);
    if (showOnlyOwned && !isOwned) return false;
    if (selectedSetCode !== 'ALL' && card.setCode !== selectedSetCode) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.cardNumber.toLowerCase().includes(q) ||
        card.set.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-24 md:pb-12">
      
      {/* Pokedex Main Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white shadow-2xl border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>ポケカ図鑑 &amp; コンプリート率</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              カード図鑑達成率
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              全収録カードの収集コンプリート状況を自動トレース
            </p>
          </div>

          <div className="text-right bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <span className="text-xs text-slate-400 block">全体図鑑達成</span>
            <span className="text-3xl font-black text-amber-300">
              {totalUniqueOwned} <span className="text-sm font-normal text-slate-300">/ {totalDatabaseCardsCount} 種類</span>
            </span>
            <p className="text-xs font-bold text-red-400 mt-0.5">
              達成率 {overallPercentage}%
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-red-600 via-red-500 to-amber-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(2, parseFloat(overallPercentage)))}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Set-by-Set Completion Rate Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-red-500" />
          シリーズ別コンプリート率
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_SETS.slice(0, 4).map(set => {
            const setCards = allDatabaseCards.filter(c => c.setCode === set.code || c.set.includes(set.name));
            const ownedInSet = setCards.filter(c => ownedCardIds.has(c.id)).length;
            const totalInSet = set.totalCardsCount;
            const pct = Math.round((ownedInSet / Math.max(1, totalInSet)) * 100);
            const remaining = Math.max(0, totalInSet - ownedInSet);

            return (
              <div
                key={set.code}
                onClick={() => setSelectedSetCode(selectedSetCode === set.code ? 'ALL' : set.code)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer ${
                  selectedSetCode === set.code
                    ? 'border-red-500 ring-2 ring-red-500/20 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {set.name}
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    {ownedInSet} / {totalInSet} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <span>発売日: {set.releaseDate}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">あと {remaining} 種類でコンプリート</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="図鑑カードを検索..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSetCode}
              onChange={e => setSelectedSetCode(e.target.value)}
              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">すべての拡張パック</option>
              {INITIAL_SETS.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyOwned(!showOnlyOwned)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                showOnlyOwned
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              所持カードのみ
            </button>
          </div>

        </div>

        {/* Cards Grid (Owned = Normal visual, Unowned = Silhouette visual) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map(card => {
            const isOwned = ownedCardIds.has(card.id);

            return (
              <div
                key={card.id}
                onClick={() => onOpenCardDetail(card)}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isOwned
                    ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1'
                    : 'bg-slate-100/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-900 opacity-75 hover:opacity-90'
                }`}
              >
                {/* Silhouette vs Vibrant Image */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                      isOwned ? '' : 'brightness-[0.2] contrast-200 grayscale blur-[1px]'
                    }`}
                  />

                  {/* Badges */}
                  {!isOwned ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <Lock className="w-6 h-6 mb-1 text-slate-500" />
                      <span className="text-[10px] font-bold">未所持</span>
                    </div>
                  ) : (
                    <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500 text-white shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-white text-[9px] font-extrabold">
                    {card.rarity}
                  </div>
                </div>

                {/* Card Title & Number */}
                <div className="mt-2.5">
                  <p className={`font-bold text-xs truncate ${isOwned ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {card.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {card.cardNumber}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
