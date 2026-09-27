import { AdminStats } from '../types';

export function getAdminStats(): AdminStats {
  return {
    totalUsers: 12480,
    dailyAppraisals: 1420,
    totalAppraisals: 189500,
    registeredCardsCount: 1240,
    collectionItemsCount: 482100,
    newsCount: 184,
    productsCount: 42,
    apiSuccessRate: 99.8,
    aiRecognitionErrorRate: 1.2,
    lastPriceSync: '2026-09-26 21:00:00 JST',
  };
}
