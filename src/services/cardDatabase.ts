import { Card, SetInfo } from '../types';

export const INITIAL_SETS: SetInfo[] = [
  {
    code: 'SV8a',
    name: 'ハイクラスパック テラスタルフェスex',
    releaseDate: '2024-12-06',
    totalCardsCount: 187,
  },
  {
    code: 'SV8',
    name: '拡張パック 超電ブレイカー',
    releaseDate: '2024-10-18',
    totalCardsCount: 106,
  },
  {
    code: 'SV7a',
    name: '強化拡張パック 楽園ドラゴーナ',
    releaseDate: '2024-09-13',
    totalCardsCount: 64,
  },
  {
    code: 'SV7',
    name: '拡張パック ステラミラクル',
    releaseDate: '2024-07-19',
    totalCardsCount: 102,
  },
  {
    code: 'SV6a',
    name: '強化拡張パック ナイトワンダラー',
    releaseDate: '2024-06-07',
    totalCardsCount: 64,
  },
  {
    code: 'SV6',
    name: '拡張パック 変幻の仮面',
    releaseDate: '2024-04-26',
    totalCardsCount: 101,
  },
  {
    code: 'SV5a',
    name: '強化拡張パック クリムゾンヘイズ',
    releaseDate: '2024-03-22',
    totalCardsCount: 66,
  },
  {
    code: 'SV4a',
    name: 'ハイクラスパック シャイニートレジャーex',
    releaseDate: '2023-12-01',
    totalCardsCount: 190,
  },
  {
    code: 'SV2D',
    name: '拡張パック クレイバースト',
    releaseDate: '2023-04-14',
    totalCardsCount: 71,
  },
  {
    code: 'SV2a',
    name: '強化拡張パック ポケモンカード151',
    releaseDate: '2023-06-16',
    totalCardsCount: 165,
  }
];

export const INITIAL_CARDS: Card[] = [
  {
    id: 'charizard-ex-sar-sv4a',
    name: 'リザードンex',
    cardNumber: '349/190',
    rarity: 'SAR',
    set: 'ハイクラスパック シャイニートレジャーex',
    setCode: 'SV4a',
    cardType: '悪',
    hp: 330,
    language: '日本語',
    finish: 'イラスト違い',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 18500,
    minPrice: 16000,
    maxPrice: 21000,
    buyoutPrice: 14500,
    sellingPrice: 19800,
    mintPrice: 22000,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 18:30',
    priceTrend30d: +4.2,
  },
  {
    id: 'iono-sar-sv2d',
    name: 'ナンジャモ',
    cardNumber: '096/071',
    rarity: 'SAR',
    set: '拡張パック クレイバースト',
    setCode: 'SV2D',
    cardType: 'トレーナーズ',
    language: '日本語',
    finish: 'イラスト違い',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 68000,
    minPrice: 62000,
    maxPrice: 75000,
    buyoutPrice: 56000,
    sellingPrice: 72000,
    mintPrice: 78000,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 20:15',
    priceTrend30d: -2.1,
  },
  {
    id: 'pikachu-ex-ur-sv8',
    name: 'ピカチュウex',
    cardNumber: '136/106',
    rarity: 'UR',
    set: '拡張パック 超電ブレイカー',
    setCode: 'SV8',
    cardType: '雷',
    hp: 200,
    language: '日本語',
    finish: 'レリーフ加工',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 12400,
    minPrice: 11000,
    maxPrice: 14200,
    buyoutPrice: 9500,
    sellingPrice: 13500,
    mintPrice: 15000,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 19:00',
    priceTrend30d: +8.5,
  },
  {
    id: 'mewtwo-ex-sar-sv2a',
    name: 'ミュウツーex',
    cardNumber: '205/165',
    rarity: 'SAR',
    set: '強化拡張パック ポケモンカード151',
    setCode: 'SV2a',
    cardType: '超',
    hp: 230,
    language: '日本語',
    finish: 'イラスト違い',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 9800,
    minPrice: 8500,
    maxPrice: 11500,
    buyoutPrice: 7200,
    sellingPrice: 10500,
    mintPrice: 12000,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 21:00',
    priceTrend30d: +1.5,
  },
  {
    id: 'gardevoir-ex-sar-sv4a',
    name: 'サーナイトex',
    cardNumber: '348/190',
    rarity: 'SAR',
    set: 'ハイクラスパック シャイニートレジャーex',
    setCode: 'SV4a',
    cardType: '超',
    hp: 310,
    language: '日本語',
    finish: 'イラスト違い',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 7200,
    minPrice: 6200,
    maxPrice: 8500,
    buyoutPrice: 5200,
    sellingPrice: 7800,
    mintPrice: 8900,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 15:45',
    priceTrend30d: -0.8,
  },
  {
    id: 'mew-ex-ur-sv4a',
    name: 'ミュウex',
    cardNumber: '347/190',
    rarity: 'UR',
    set: 'ハイクラスパック シャイニートレジャーex',
    setCode: 'SV4a',
    cardType: '超',
    hp: 180,
    language: '日本語',
    finish: 'レリーフ加工',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 5400,
    minPrice: 4800,
    maxPrice: 6200,
    buyoutPrice: 3800,
    sellingPrice: 5900,
    mintPrice: 6800,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 17:10',
    priceTrend30d: +3.1,
  },
  {
    id: 'blastoise-ex-sar-sv2a',
    name: 'カメックスex',
    cardNumber: '202/165',
    rarity: 'SAR',
    set: '強化拡張パック ポケモンカード151',
    setCode: 'SV2a',
    cardType: '水',
    hp: 330,
    language: '日本語',
    finish: 'イラスト違い',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 6100,
    minPrice: 5200,
    maxPrice: 7200,
    buyoutPrice: 4400,
    sellingPrice: 6600,
    mintPrice: 7500,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 14:20',
    priceTrend30d: +0.5,
  },
  {
    id: 'pikachu-ar-sv2a',
    name: 'ピカチュウ',
    cardNumber: '173/165',
    rarity: 'AR',
    set: '強化拡張パック ポケモンカード151',
    setCode: 'SV2a',
    cardType: '雷',
    hp: 60,
    language: '日本語',
    finish: 'ホロ',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 3200,
    minPrice: 2800,
    maxPrice: 3800,
    buyoutPrice: 2100,
    sellingPrice: 3500,
    mintPrice: 4200,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 12:00',
    priceTrend30d: +12.0,
  },
  {
    id: 'arven-sar-sv4a',
    name: 'ペパー',
    cardNumber: '353/190',
    rarity: 'SAR',
    set: 'ハイクラスパック シャイニートレジャーex',
    setCode: 'SV4a',
    cardType: 'トレーナーズ',
    language: '日本語',
    finish: 'イラスト違い',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 4100,
    minPrice: 3500,
    maxPrice: 4800,
    buyoutPrice: 2800,
    sellingPrice: 4400,
    mintPrice: 5000,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 19:30',
    priceTrend30d: -5.4,
  },
  {
    id: 'terastal-dragonite-ex-sv8a',
    name: 'カイリューex',
    cardNumber: '045/187',
    rarity: 'RR',
    set: 'ハイクラスパック テラスタルフェスex',
    setCode: 'SV8a',
    cardType: 'ドラゴン',
    hp: 330,
    language: '日本語',
    finish: 'ホロ',
    isPromo: false,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    hasPriceData: true,
    marketPrice: 850,
    minPrice: 600,
    maxPrice: 1100,
    buyoutPrice: 400,
    sellingPrice: 900,
    mintPrice: 1200,
    priceSource: 'ポケカ市場リアルタイムデータ',
    priceUpdatedAt: '2026-09-26 11:00',
    priceTrend30d: 0,
  },
  {
    id: 'custom-promo-ancient-mew',
    name: '古代のミュウ (プロモ未評価)',
    cardNumber: 'PROMO-001',
    rarity: 'PROMO',
    set: 'プロモーションカードパック',
    setCode: 'PROMO',
    cardType: '超',
    hp: 30,
    language: '日本語',
    finish: '特殊ミラー',
    isPromo: true,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    hasPriceData: false, // NO market data example
  }
];

export async function searchCards(params: {
  query?: string;
  set?: string;
  rarity?: string;
  cardType?: string;
  hasPriceOnly?: boolean;
}): Promise<Card[]> {
  let list = [...INITIAL_CARDS];

  if (params.query && params.query.trim() !== '') {
    const q = params.query.toLowerCase().trim();
    list = list.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.cardNumber.toLowerCase().includes(q) ||
        c.set.toLowerCase().includes(q)
    );
  }

  if (params.set) {
    list = list.filter(c => c.set === params.set || c.setCode === params.set);
  }

  if (params.rarity) {
    list = list.filter(c => c.rarity === params.rarity);
  }

  if (params.cardType) {
    list = list.filter(c => c.cardType === params.cardType);
  }

  if (params.hasPriceOnly) {
    list = list.filter(c => c.hasPriceData);
  }

  return list;
}

export function getCardById(id: string): Card | undefined {
  return INITIAL_CARDS.find(c => c.id === id);
}
