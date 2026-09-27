import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Card, CollectionItem, ConditionRank, DuplicateTag, WishlistItem } from '../types';
import { INITIAL_CARDS, getCardById } from './cardDatabase';

const LOCAL_COLLECTION_KEY = 'card_scanner_my_collection_v1';
const LOCAL_WISHLIST_KEY = 'card_scanner_my_wishlist_v1';

// Seed initial demo collection for guest users so they immediately experience rich charts & stats
function getInitialDemoCollection(): CollectionItem[] {
  const c1 = INITIAL_CARDS[0]; // Charizard SAR
  const c2 = INITIAL_CARDS[1]; // Iono SAR
  const c3 = INITIAL_CARDS[2]; // Pikachu UR
  const c4 = INITIAL_CARDS[3]; // Mewtwo SAR
  const c5 = INITIAL_CARDS[7]; // Pikachu AR

  return [
    {
      id: 'col-1',
      userId: 'demo-user',
      cardId: c1.id,
      card: c1,
      quantity: 2,
      collectionQuantity: 1,
      duplicateQuantity: 1,
      condition: 'S',
      purchasePrice: 17000,
      acquiredAt: '2026-08-15',
      notes: '極美品。ローダー保存',
      statusTag: '保管中'
    },
    {
      id: 'col-2',
      userId: 'demo-user',
      cardId: c2.id,
      card: c2,
      quantity: 1,
      collectionQuantity: 1,
      duplicateQuantity: 0,
      condition: 'A',
      purchasePrice: 65000,
      acquiredAt: '2026-07-20',
      notes: 'イベントトレードで獲得',
      statusTag: '保管中'
    },
    {
      id: 'col-3',
      userId: 'demo-user',
      cardId: c3.id,
      card: c3,
      quantity: 4,
      collectionQuantity: 1,
      duplicateQuantity: 3,
      condition: 'S',
      purchasePrice: 11500,
      acquiredAt: '2026-09-01',
      notes: '3枚交換可能枠',
      statusTag: '交換予定'
    },
    {
      id: 'col-4',
      userId: 'demo-user',
      cardId: c4.id,
      card: c4,
      quantity: 1,
      collectionQuantity: 1,
      duplicateQuantity: 0,
      condition: 'B',
      purchasePrice: 8000,
      acquiredAt: '2026-09-10',
      notes: '裏面微小キズ',
      statusTag: '保管中'
    },
    {
      id: 'col-5',
      userId: 'demo-user',
      cardId: c5.id,
      card: c5,
      quantity: 3,
      collectionQuantity: 1,
      duplicateQuantity: 2,
      condition: 'S',
      purchasePrice: 2800,
      acquiredAt: '2026-06-12',
      notes: '2枚友達にプレセント予定',
      statusTag: '友達に渡す予定'
    }
  ];
}

// Wishlist Initial Seed
function getInitialDemoWishlist(): WishlistItem[] {
  const c = INITIAL_CARDS[4]; // Gardevoir SAR
  return [
    {
      id: 'wish-1',
      userId: 'demo-user',
      cardId: c.id,
      card: c,
      currentPrice: c.marketPrice,
      targetPrice: 6500,
      priority: '高',
      notes: 'ハイクラスパック完全コンプ目標',
      alertTriggered: false,
      addedAt: '2026-09-15'
    }
  ];
}

export function getLocalCollection(): CollectionItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_COLLECTION_KEY);
    if (!raw) {
      const demo = getInitialDemoCollection();
      localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialDemoCollection();
  }
}

export function saveLocalCollection(items: CollectionItem[]): void {
  try {
    localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save collection locally:', e);
  }
}

export async function loadUserCollection(userId?: string): Promise<CollectionItem[]> {
  if (userId && db) {
    try {
      const q = query(collection(db, 'collection_items'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const items: CollectionItem[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          const card = getCardById(data.cardId) || data.card;
          if (card) {
            items.push({
              id: docSnap.id,
              userId: data.userId,
              cardId: data.cardId,
              card,
              quantity: data.quantity || 1,
              collectionQuantity: data.collectionQuantity || 1,
              duplicateQuantity: data.duplicateQuantity || 0,
              condition: data.condition || 'A',
              purchasePrice: data.purchasePrice,
              acquiredAt: data.acquiredAt || new Date().toISOString(),
              notes: data.notes || '',
              statusTag: data.statusTag || '保管中'
            });
          }
        });
        return items;
      }
    } catch (err) {
      console.warn('Firestore collection load fallback to local:', err);
    }
  }

  return getLocalCollection();
}

export async function addCardToCollection(
  userId: string | undefined,
  card: Card,
  options?: {
    condition?: ConditionRank;
    quantity?: number;
    purchasePrice?: number;
    notes?: string;
    statusTag?: DuplicateTag;
  }
): Promise<CollectionItem> {
  const currentItems = getLocalCollection();
  const existing = currentItems.find(i => i.cardId === card.id);

  let updatedItem: CollectionItem;

  if (existing) {
    const addQty = options?.quantity || 1;
    existing.quantity += addQty;
    existing.duplicateQuantity = Math.max(0, existing.quantity - existing.collectionQuantity);
    updatedItem = existing;
    saveLocalCollection(currentItems);
  } else {
    const totalQty = options?.quantity || 1;
    updatedItem = {
      id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: userId || 'guest',
      cardId: card.id,
      card,
      quantity: totalQty,
      collectionQuantity: 1,
      duplicateQuantity: Math.max(0, totalQty - 1),
      condition: options?.condition || 'S',
      purchasePrice: options?.purchasePrice || card.marketPrice,
      acquiredAt: new Date().toISOString().split('T')[0],
      notes: options?.notes || '',
      statusTag: options?.statusTag || '保管中'
    };
    currentItems.unshift(updatedItem);
    saveLocalCollection(currentItems);
  }

  // Firestore sync if connected
  if (userId && db) {
    try {
      await setDoc(doc(db, 'collection_items', updatedItem.id), {
        userId,
        cardId: updatedItem.cardId,
        quantity: updatedItem.quantity,
        collectionQuantity: updatedItem.collectionQuantity,
        duplicateQuantity: updatedItem.duplicateQuantity,
        condition: updatedItem.condition,
        purchasePrice: updatedItem.purchasePrice,
        acquiredAt: updatedItem.acquiredAt,
        notes: updatedItem.notes,
        statusTag: updatedItem.statusTag,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore sync item error:', e);
    }
  }

  return updatedItem;
}

export function updateCollectionQuantity(
  itemId: string,
  delta: number,
  userId?: string
): CollectionItem[] {
  const items = getLocalCollection();
  const index = items.findIndex(i => i.id === itemId);
  if (index !== -1) {
    const item = items[index];
    item.quantity = Math.max(0, item.quantity + delta);
    if (item.quantity === 0) {
      items.splice(index, 1);
    } else {
      item.duplicateQuantity = Math.max(0, item.quantity - item.collectionQuantity);
    }
    saveLocalCollection(items);

    if (userId && db) {
      if (item.quantity === 0) {
        deleteDoc(doc(db, 'collection_items', itemId)).catch(() => {});
      } else {
        setDoc(doc(db, 'collection_items', itemId), {
          quantity: item.quantity,
          duplicateQuantity: item.duplicateQuantity,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
      }
    }
  }

  return items;
}

// Wishlist methods
export function getLocalWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (!raw) {
      const demo = getInitialDemoWishlist();
      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialDemoWishlist();
  }
}

export function saveLocalWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

export function toggleWishlistCard(card: Card, targetPrice?: number, userId?: string): { added: boolean; list: WishlistItem[] } {
  const list = getLocalWishlist();
  const idx = list.findIndex(w => w.cardId === card.id);

  if (idx !== -1) {
    list.splice(idx, 1);
    saveLocalWishlist(list);
    return { added: false, list };
  } else {
    const newItem: WishlistItem = {
      id: `wish-${Date.now()}`,
      userId: userId || 'guest',
      cardId: card.id,
      card,
      currentPrice: card.marketPrice,
      targetPrice: targetPrice || (card.marketPrice ? Math.round(card.marketPrice * 0.9) : 5000),
      priority: '高',
      notes: '',
      alertTriggered: false,
      addedAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    saveLocalWishlist(list);
    return { added: true, list };
  }
}

export interface CollectionStatsResult {
  totalEstimatedValue: number;
  totalCardsCount: number;
  uniqueSpeciesCount: number;
  pricedCardsCount: number;
  averagePricePerCard: number;
  highestValueCardItem: CollectionItem | null;
  highestQuantityCardItem: CollectionItem | null;
  rarityMap: Record<string, number>;
  setMap: Record<string, number>;
  typeMap: Record<string, number>;
  lastUpdated: string;
}

// Collection Analytics Computation
export function calculateCollectionStats(items: CollectionItem[]): CollectionStatsResult {
  let totalEstimatedValue = 0;
  let totalCardsCount = 0;
  let pricedCardsCount = 0;
  const uniqueCardIds = new Set<string>();

  const rarityMap: Record<string, number> = {};
  const setMap: Record<string, number> = {};
  const typeMap: Record<string, number> = {};

  let highestValueCardItem: CollectionItem | null = null;
  let highestQuantityCardItem: CollectionItem | null = null;

  items.forEach(item => {
    totalCardsCount += item.quantity;
    uniqueCardIds.add(item.cardId);

    // Track duplicate/quantity lead
    if (!highestQuantityCardItem || item.quantity > highestQuantityCardItem.quantity) {
      highestQuantityCardItem = item;
    }

    // Price calculation
    if (item.card.hasPriceData && item.card.marketPrice) {
      pricedCardsCount += item.quantity;
      const cardTotal = item.card.marketPrice * item.quantity;
      totalEstimatedValue += cardTotal;

      if (!highestValueCardItem || (item.card.marketPrice > (highestValueCardItem.card.marketPrice || 0))) {
        highestValueCardItem = item;
      }
    }

    // Rarity stats
    const r = item.card.rarity || 'OTHER';
    rarityMap[r] = (rarityMap[r] || 0) + item.quantity;

    // Set stats
    const s = item.card.set || 'その他';
    setMap[s] = (setMap[s] || 0) + item.quantity;

    // Type stats
    const t = item.card.cardType || 'その他';
    typeMap[t] = (typeMap[t] || 0) + item.quantity;
  });

  const uniqueSpeciesCount = uniqueCardIds.size;
  const averagePricePerCard = pricedCardsCount > 0 ? Math.round(totalEstimatedValue / pricedCardsCount) : 0;

  return {
    totalEstimatedValue,
    totalCardsCount,
    uniqueSpeciesCount,
    pricedCardsCount,
    averagePricePerCard,
    highestValueCardItem,
    highestQuantityCardItem,
    rarityMap,
    setMap,
    typeMap,
    lastUpdated: '2026-09-26 21:30'
  };
}
