export type Rarity = 'SAR' | 'SR' | 'AR' | 'UR' | 'RRR' | 'RR' | 'R' | 'U' | 'C' | 'PROMO' | 'CHR' | 'CSR';

export type CardType = '草' | '炎' | '水' | '雷' | '超' | '闘' | '悪' | '鋼' | 'ドラゴン' | '無色' | 'トレーナーズ' | 'エネルギー';

export type ConditionRank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface CardConditionAnalysis {
  rank: ConditionRank;
  whiteEdges: 'なし' | '微小' | 'あり' | '顕著'; // 白かけ
  scratches: 'なし' | '微小' | 'あり' | '顕著'; // 傷
  dents: 'なし' | 'あり'; // へこみ
  creases: 'なし' | 'あり'; // 折れ
  stains: 'なし' | 'あり'; // 汚れ
  centering: '良好 (60/40以内)' | 'やや偏り' | '大幅に偏り'; // センタリング
  frontSurface: string; // 表面状態
  backSurface: string; // 裏面状態
  backImageAnalyzed: boolean;
  notes: string;
}

export interface Card {
  id: string;
  name: string;
  cardNumber: string; // e.g., "089/190"
  rarity: Rarity;
  set: string; // e.g., "ハイクラスパック シャイニートレジャーex"
  setCode: string; // e.g., "SV8a"
  cardType: CardType;
  hp?: number;
  language: '日本語' | '英語' | 'その他';
  finish: 'レリーフ加工' | 'ホロ' | 'ノーマル' | 'イラスト違い' | '特殊ミラー';
  isPromo: boolean;
  imageUrl: string;
  
  // Price Data
  hasPriceData: boolean;
  marketPrice?: number; // 平均市場価格
  minPrice?: number;    // 価格帯の下限
  maxPrice?: number;    // 価格帯の上限
  buyoutPrice?: number; // 買取想定価格
  sellingPrice?: number; // 販売相場
  mintPrice?: number;    // 美品時参考価格
  priceSource?: string;  // e.g., "ポケカ市場リアルタイムデータ"
  priceUpdatedAt?: string;
  priceTrend30d?: number; // 30日変動率 (%)
}

export interface CardCandidate {
  card: Card;
  confidenceScore: number; // 0 to 100
  confidenceLevel: '高' | '中' | '低';
}

export interface AppraisalResult {
  id: string;
  userId?: string;
  scannedAt: string;
  imageUrl: string;
  recognizedCard: Card;
  confidenceScore: number;
  confidenceLevel: '高' | '中' | '低';
  candidates: CardCandidate[];
  condition: CardConditionAnalysis;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  hasPriceData: boolean;
  disclaimer: string;
}

export type DuplicateTag = '保管中' | '交換予定' | '友達に渡す予定' | '売却予定';

export interface CollectionItem {
  id: string;
  userId: string;
  cardId: string;
  card: Card;
  quantity: number; // 総所有枚数
  collectionQuantity: number; // コレクション用
  duplicateQuantity: number;  // 重複分
  condition: ConditionRank;
  purchasePrice?: number;
  acquiredAt: string;
  notes?: string;
  statusTag: DuplicateTag;
}

export interface WishlistItem {
  id: string;
  userId: string;
  cardId: string;
  card: Card;
  currentPrice?: number;
  targetPrice: number;
  priority: '高' | '中' | '低';
  notes?: string;
  alertTriggered: boolean;
  addedAt: string;
}

export interface SetInfo {
  code: string;
  name: string;
  releaseDate: string;
  totalCardsCount: number;
  imageUrl?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: '新商品' | '新カード' | '拡張パック' | 'イベント' | '大会' | 'キャンペーン' | 'ルール変更' | '公式発表' | 'その他';
  publishedAt: string;
  source: string;
  url: string;
  imageUrl?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  releaseDate: string;
  imageUrl: string;
  type: 'ハイクラスパック' | '拡張パック' | '構築済みデッキ' | 'サプライ' | 'プレミアムボックス';
  isUpcoming: boolean;
  officialUrl?: string;
  featuredCards?: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'price_alert' | 'new_product' | 'news' | 'collection_milestone' | 'system';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  linkCardId?: string;
  linkUrl?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface AdminStats {
  totalUsers: number;
  dailyAppraisals: number;
  totalAppraisals: number;
  registeredCardsCount: number;
  collectionItemsCount: number;
  newsCount: number;
  productsCount: number;
  apiSuccessRate: number;
  aiRecognitionErrorRate: number;
  lastPriceSync: string;
}
