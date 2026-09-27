import { NewsItem, ProductItem } from '../types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'ハイクラスパック「テラスタルフェスex」公式カードリスト先行公開！',
    summary: '年末恒例のハイクラスパック！すべてのテラスタルポケモンexと限定SARが多数収録決定。注目の再録カード情報も網羅。',
    category: '新商品',
    publishedAt: '2026-09-25 18:00',
    source: 'ポケモンカードゲーム公式ポータルサイト',
    url: 'https://www.pokemon-card.com/',
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-2',
    title: '拡張パック「超電ブレイカー」の最新プレリリース環境・注目デッキ分析',
    summary: 'ピカチュウexを中心に構成された超雷型デッキがCL（チャンピオンズリーグ）で異彩を放つ。主要採用カードと採用率動向を徹底解説。',
    category: '大会',
    publishedAt: '2026-09-24 12:30',
    source: 'ポケカトレーナズウェブ',
    url: 'https://www.pokemon-card.com/',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-3',
    title: '「ポケモンカード151」緊急重版・全国カードショップ一斉入荷のおしらせ',
    summary: '大人気の「151」が全国のポケカ取扱店およびポケモンセンターにて順次再販スタート。入手困難だったSARの相場にも変化。',
    category: '公式発表',
    publishedAt: '2026-09-20 15:00',
    source: 'ポケモン公式広報',
    url: 'https://www.pokemon-card.com/',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-4',
    title: 'スタンダードレギュレーション更新に伴うフロアルール＆カード裁定変更',
    summary: '新シーズンに向けたレギュレーションマーク変更のお知らせと、最新プロモカードの大会使用可能開始日に関するご案内。',
    category: 'ルール変更',
    publishedAt: '2026-09-15 10:00',
    source: 'ポケモンカードプレイヤーズクラブ',
    url: 'https://www.pokemon-card.com/',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'ハイクラスパック テラスタルフェスex',
    releaseDate: '2024-12-06',
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80',
    type: 'ハイクラスパック',
    isUpcoming: false,
    officialUrl: 'https://www.pokemon-card.com/',
    featuredCards: ['リザードンex SAR', 'オーガポンex SAR', 'カイリューex RR']
  },
  {
    id: 'prod-2',
    name: '拡張パック 超電ブレイカー',
    releaseDate: '2024-10-18',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    type: '拡張パック',
    isUpcoming: false,
    officialUrl: 'https://www.pokemon-card.com/',
    featuredCards: ['ピカチュウex UR', 'サザンドラex SAR']
  },
  {
    id: 'prod-3',
    name: 'スターターセット テラスタイプ：ステラ',
    releaseDate: '2024-11-22',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    type: '構築済みデッキ',
    isUpcoming: true,
    officialUrl: 'https://www.pokemon-card.com/',
    featuredCards: ['ステラライコウex', 'きらめく結晶']
  },
  {
    id: 'prod-4',
    name: 'プレミアムトレーナーボックス テラスタル',
    releaseDate: '2024-12-06',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    type: 'プレミアムボックス',
    isUpcoming: true,
    officialUrl: 'https://www.pokemon-card.com/',
    featuredCards: ['アクロマの実験', 'ネストボール', 'すごいつりざお']
  }
];

export async function fetchLatestNews(): Promise<NewsItem[]> {
  return INITIAL_NEWS;
}

export async function fetchProducts(): Promise<ProductItem[]> {
  return INITIAL_PRODUCTS;
}
