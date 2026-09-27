import React, { useState } from 'react';
import { Layers, TrendingUp, Plus, Minus, Search, Filter, PieChart, Tag, Trash2, Eye, Sparkles, CheckCircle, Award } from 'lucide-react';
import { Card, CollectionItem, ConditionRank, DuplicateTag } from '../types';
import { formatYen } from '../services/priceService';
import { calculateCollectionStats } from '../services/collectionService';
import { useToast } from '../context/ToastContext';

interface CollectionViewProps {
  items: CollectionItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onOpenCardDetail: (card: Card) => void;
  onNavigateScan: () => void;
  onAddCardByNameModal: () => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  items,
  onUpdateQuantity,
  onOpenCardDetail,
  onNavigateScan,
  onAddCardByNameModal,
}) => {
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [selectedStatusTag, setSelectedStatusTag] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'quantity' | 'date'>('value');

  const stats = calculateCollectionStats(items);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesQuery =
      item.card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.card.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.card.set.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRarity = selectedRarity === 'ALL' || item.card.rarity === selectedRarity;
    const matchesStatus = selectedStatusTag === 'ALL' || item.statusTag === selectedStatusTag;

    return matchesQuery && matchesRarity && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'value') {
      const priceA = (a.card.marketPrice || 0) * a.quantity;
      const priceB = (b.card.marketPrice || 0) * b.quantity;
      return priceB - priceA;
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    if (sortBy === 'name') {
      return a.card.name.localeCompare(b.card.name, 'ja');
    }
    return new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime();
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      
      {/* Header Summary Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white shadow-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
              <Layers className="w-3.5 h-3.5" />
              <span>マイコレクション</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              保有コレクション資産
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              価格データ更新日時: {stats.lastUpdated} (提供元: ポケカ市場データ)
            </p>
          </div>

          {/* Quick Add Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateScan}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AIスキャンで追加</span>
            </button>

            <button
              onClick={onAddCardByNameModal}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>カード名で検索追加</span>
            </button>
          </div>

        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-slate-400">推定総額 (所有全カード)</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {formatYen(stats.totalEstimatedValue)}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              平均単価: {formatYen(stats.averagePricePerCard)} / 枚
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-slate-400">保有枚数</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">
              {stats.totalCardsCount} <span className="text-sm font-normal text-slate-400">枚</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              登録種類数: {stats.uniqueSpeciesCount} 種類
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-slate-400">一番高価な所有カード</p>
            <p className="text-lg font-bold text-white truncate mt-1">
              {stats.highestValueCardItem ? stats.highestValueCardItem.card.name : 'なし'}
            </p>
            <p className="text-xs text-amber-400 font-bold mt-0.5">
              {stats.highestValueCardItem ? formatYen(stats.highestValueCardItem.card.marketPrice) : '---'}
            </p>
          </div>

        </div>
      </div>

      {/* Tabs Switcher (List vs Analytics) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            カード一覧 ({filteredItems.length})
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>コレクション分析</span>
          </button>
        </div>
      </div>

      {/* View Tab 1: Card List */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          
          {/* Controls Bar (Search, Filter, Sort) */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="コレクション内を検索..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <select
                value={selectedRarity}
                onChange={e => setSelectedRarity(e.target.value)}
                className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="ALL">すべてのレアリティ</option>
                <option value="SAR">SAR</option>
                <option value="SR">SR</option>
                <option value="AR">AR</option>
                <option value="UR">UR</option>
                <option value="RRR">RRR</option>
                <option value="RR">RR</option>
              </select>

              <select
                value={selectedStatusTag}
                onChange={e => setSelectedStatusTag(e.target.value)}
                className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="ALL">すべてのステータス</option>
                <option value="保管中">保管中</option>
                <option value="交換予定">交換予定</option>
                <option value="友達に渡す予定">友達に渡す予定</option>
                <option value="売却予定">売却予定</option>
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-bold"
              >
                <option value="value">総額が高い順</option>
                <option value="quantity">枚数が多い順</option>
                <option value="date">追加が新しい順</option>
                <option value="name">カード名順</option>
              </select>
            </div>

          </div>

          {/* Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex gap-4"
                >
                  {/* Card Thumbnail */}
                  <div
                    onClick={() => onOpenCardDetail(item.card)}
                    className="w-24 sm:w-28 shrink-0 cursor-pointer group relative"
                  >
                    <img
                      src={item.card.imageUrl}
                      alt={item.card.name}
                      className="w-full h-auto object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-black">
                      {item.condition}
                    </div>
                  </div>

                  {/* Details & Counter Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                          {item.card.rarity}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                          {item.statusTag}
                        </span>
                      </div>

                      <h3
                        onClick={() => onOpenCardDetail(item.card)}
                        className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate cursor-pointer hover:underline mt-1"
                      >
                        {item.card.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.card.set} ({item.card.cardNumber})
                      </p>
                    </div>

                    {/* Quantity & Duplicates Management */}
                    <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 my-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          所有: <strong className="text-slate-900 dark:text-white">{item.quantity}枚</strong>
                          （保存: {item.collectionQuantity} / 重複: {item.duplicateQuantity}）
                        </span>

                        {/* Increment / Decrement */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, +1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">推定資産価値</span>
                        <span className="font-extrabold text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                          {item.card.hasPriceData ? formatYen((item.card.marketPrice || 0) * item.quantity) : '価格なし'}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenCardDetail(item.card)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>詳細</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">条件に一致するカードがありません</p>
              <p className="text-xs text-slate-400">検索キーやフィルターを変更してください。</p>
            </div>
          )}

        </div>
      )}

      {/* View Tab 2: Analytics Breakdown */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Highlights Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                コレクションハイライト
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">一番高価なカード</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {stats.highestValueCardItem ? stats.highestValueCardItem.card.name : '---'}
                    </span>
                  </div>
                  <span className="font-extrabold text-amber-500 text-sm">
                    {stats.highestValueCardItem ? formatYen(stats.highestValueCardItem.card.marketPrice) : '---'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">一番多く持っているカード</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {stats.highestQuantityCardItem ? stats.highestQuantityCardItem.card.name : '---'}
                    </span>
                  </div>
                  <span className="font-extrabold text-blue-500 text-sm">
                    {stats.highestQuantityCardItem ? `${stats.highestQuantityCardItem.quantity}枚` : '---'}
                  </span>
                </div>
              </div>
            </div>

            {/* Rarity Distribution */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                レアリティ別所有枚数
              </h3>

              <div className="space-y-2.5">
                {Object.entries(stats.rarityMap).map(([rarity, count]) => {
                  const pct = Math.round((count / stats.totalCardsCount) * 100) || 0;
                  return (
                    <div key={rarity} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{rarity}</span>
                        <span>{count}枚 ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
