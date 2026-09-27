import React, { useState } from 'react';
import { Newspaper, Package, ExternalLink, Calendar, Tag, Sparkles, Clock } from 'lucide-react';
import { NewsItem, ProductItem } from '../types';

interface NewsViewProps {
  newsList: NewsItem[];
  productList: ProductItem[];
}

export const NewsView: React.FC<NewsViewProps> = ({ newsList, productList }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [subTab, setSubTab] = useState<'news' | 'products'>('news');

  const categories = ['ALL', '新商品', '新カード', '拡張パック', 'イベント', '大会', '公式発表', 'ルール変更'];

  const filteredNews = newsList.filter(n => {
    if (activeCategory === 'ALL') return true;
    return n.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-red-600 dark:text-red-500" />
            ポケカ最新ニュース &amp; 新商品情報
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            公式発表・新カード・拡張パック・イベント情報を一元管理。
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setSubTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'news'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            最新ニュース
          </button>
          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'products'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>新商品情報</span>
          </button>
        </div>
      </div>

      {/* View Tab 1: News List */}
      {subTab === 'news' && (
        <div className="space-y-6">
          
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? 'すべてのカテゴリー' : cat}
              </button>
            ))}
          </div>

          {/* News Cards */}
          <div className="space-y-4">
            {filteredNews.map(news => (
              <div
                key={news.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
              >
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full sm:w-48 h-36 object-cover rounded-2xl shrink-0 shadow-sm"
                  />
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-extrabold">
                        {news.category}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {news.publishedAt}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                      {news.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {news.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium">情報源: {news.source}</span>

                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline"
                    >
                      <span>元記事を見る</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* View Tab 2: Products List */}
      {subTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productList.map(product => (
            <div
              key={product.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {product.isUpcoming && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-lg">
                      発売予定
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold">
                    {product.type}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    発売日: <span className="font-bold text-slate-800 dark:text-slate-200">{product.releaseDate}</span>
                  </p>
                </div>

                {product.featuredCards && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400">注目収録カード:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.featuredCards.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {product.officialUrl && (
                <a
                  href={product.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>公式サイトで商品詳細を見る</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
