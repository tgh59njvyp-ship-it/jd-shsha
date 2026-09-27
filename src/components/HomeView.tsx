import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Layers, Sparkles, TrendingUp, TrendingDown, BookOpen, Heart, ArrowRight, ShieldCheck, Search, Zap, Package } from 'lucide-react';
import { Card, CollectionItem, NewsItem, ProductItem, WishlistItem } from '../types';
import { formatYen } from '../services/priceService';
import { searchCards } from '../services/cardDatabase';

interface HomeViewProps {
  onStartSingleScan: () => void;
  onStartDeskScan: () => void;
  onSelectPhoto: () => void;
  onSelectCard: (card: Card) => void;
  onNavigateTab: (tab: 'pokedex' | 'collection' | 'news' | 'scan') => void;
  collectionStats: {
    totalEstimatedValue: number;
    totalCardsCount: number;
    uniqueSpeciesCount: number;
  };
  pokedexCompletionRate: number;
  recentCollectionItems: CollectionItem[];
  wishlistItems: WishlistItem[];
  latestNews: NewsItem[];
  latestProducts: ProductItem[];
  priceMovers: Card[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartSingleScan,
  onStartDeskScan,
  onSelectPhoto,
  onSelectCard,
  onNavigateTab,
  collectionStats,
  pokedexCompletionRate,
  recentCollectionItems,
  wishlistItems,
  latestNews,
  latestProducts,
  priceMovers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 1) {
      setIsSearching(true);
      const res = await searchCards({ query: val });
      setSearchResults(res);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-12">
      
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        
        {/* Glow ambient background graphics */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6 text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-extrabold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Powered Pokémon TCG Analyzer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            ポケカを撮るだけ。<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
              AIがカードを査定。
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            カードの写真をアップロードすると、カード名・番号・レアリティ・状態・相場などをAIが自動解析します。
          </p>

          {/* Search bar inside Hero */}
          <div className="relative max-w-xl pt-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="カード名、カード番号 (例: リザードンex, 089/190) を検索..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all"
              />
            </div>

            {/* Instant Search Dropdown */}
            {isSearching && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 max-h-80 overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map(card => (
                    <button
                      key={card.id}
                      onClick={() => {
                        onSelectCard(card);
                        setSearchQuery('');
                        setIsSearching(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-left"
                    >
                      <img src={card.imageUrl} alt={card.name} className="w-10 h-14 object-cover rounded-md shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-white truncate">{card.name}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">{card.rarity}</span>
                        </div>
                        <p className="text-xs text-slate-400">{card.set} ({card.cardNumber})</p>
                      </div>
                      <p className="font-bold text-sm text-amber-400 shrink-0">
                        {card.hasPriceData ? formatYen(card.marketPrice) : '価格なし'}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-center text-slate-400 text-xs">該当するカードが見つかりませんでした。</p>
                )}
              </div>
            )}
          </div>

          {/* Action Triggers */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Primary Big CTA */}
            <button
              onClick={onStartSingleScan}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base shadow-lg shadow-red-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <span>カードを査定する</span>
            </button>

            {/* Quick Secondary Buttons */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <button
                onClick={onSelectPhoto}
                className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-slate-300" />
                <span>写真から選択</span>
              </button>

              <button
                onClick={onStartDeskScan}
                className="py-3.5 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>複数枚を査定</span>
              </button>
            </div>

          </div>

          {/* Security / Disclaimer feature tag */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AIによる高精度解析 &amp; 実際の市場リアルタイムデータ連携</span>
          </div>

        </div>
      </section>

      {/* User Collection Stats Dashboard Widget */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-500" />
            マイコレクション概要
          </h2>
          <button
            onClick={() => onNavigateTab('collection')}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            全コレクションを見る
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Total Value */}
          <div
            onClick={() => onNavigateTab('collection')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>コレクション推定総額</span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {formatYen(collectionStats.totalEstimatedValue)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              価格データ存在カード対象
            </p>
          </div>

          {/* Card 2: Total Owned Cards */}
          <div
            onClick={() => onNavigateTab('collection')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>所有カード数</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {collectionStats.totalCardsCount} <span className="text-sm font-normal text-slate-500">枚</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              登録種類: {collectionStats.uniqueSpeciesCount}種類
            </p>
          </div>

          {/* Card 3: Pokedex Completion */}
          <div
            onClick={() => onNavigateTab('pokedex')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>カード図鑑達成率</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {pokedexCompletionRate}%
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${pokedexCompletionRate}%` }}
              ></div>
            </div>
          </div>

        </div>
      </section>

      {/* Grid Row 2: Price Movers & Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Price Fluctuations (価格変動) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              価格変動の激しいカード
            </h3>
            <span className="text-[11px] text-slate-400">直近30日トレンド</span>
          </div>

          <div className="space-y-2">
            {priceMovers.slice(0, 4).map(card => {
              const isUp = (card.priceTrend30d || 0) >= 0;
              return (
                <div
                  key={card.id}
                  onClick={() => onSelectCard(card)}
                  className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={card.imageUrl} alt={card.name} className="w-10 h-14 object-cover rounded-lg shrink-0 shadow-sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{card.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                          {card.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{card.set}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {formatYen(card.marketPrice)}
                    </p>
                    <div className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isUp ? `+${card.priceTrend30d}%` : `${card.priceTrend30d}%`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wishlist Highlights (欲しいカード) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              欲しいカードリスト
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              {wishlistItems.length}件登録中
            </span>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="space-y-2">
              {wishlistItems.slice(0, 4).map(w => (
                <div
                  key={w.id}
                  onClick={() => onSelectCard(w.card)}
                  className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={w.card.imageUrl} alt={w.card.name} className="w-10 h-14 object-cover rounded-lg shrink-0 shadow-sm" />
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{w.card.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        目標: <span className="font-bold text-red-600 dark:text-red-400">{formatYen(w.targetPrice)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-slate-400">現在価格</p>
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {w.card.hasPriceData ? formatYen(w.card.marketPrice) : '価格なし'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              欲しいカードがまだ登録されていません。<br />
              カード詳細から「欲しいカード」に追加できます。
            </div>
          )}
        </div>

      </div>

      {/* Grid Row 3: Latest News & Upcoming Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest News */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              ポケカ最新ニュース
            </h3>
            <button
              onClick={() => onNavigateTab('news')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              一覧へ
            </button>
          </div>

          <div className="space-y-3">
            {latestNews.slice(0, 3).map(n => (
              <div
                key={n.id}
                onClick={() => onNavigateTab('news')}
                className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-slate-100 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-extrabold">
                    {n.category}
                  </span>
                  <span className="text-slate-400">{n.publishedAt}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
                  {n.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {n.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Products */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              新商品・拡張パック情報
            </h3>
            <button
              onClick={() => onNavigateTab('news')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              一覧へ
            </button>
          </div>

          <div className="space-y-3">
            {latestProducts.slice(0, 3).map(p => (
              <div
                key={p.id}
                onClick={() => onNavigateTab('news')}
                className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-slate-100 dark:border-slate-800 flex items-center gap-3"
              >
                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-xl shrink-0 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {p.name}
                    </h4>
                    {p.isUpcoming && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold shrink-0">
                        発売予定
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    発売日: <span className="font-semibold text-slate-700 dark:text-slate-300">{p.releaseDate}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
