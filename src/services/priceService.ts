import { Card, PriceHistoryPoint } from '../types';

export function getPriceHistory(card: Card, timeframe: '7d' | '30d' | '90d' | '1y'): PriceHistoryPoint[] {
  if (!card.hasPriceData || !card.marketPrice) {
    return [];
  }

  const basePrice = card.marketPrice;
  const points: PriceHistoryPoint[] = [];
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;

  const now = new Date('2026-09-26');
  
  for (let i = days; i >= 0; i -= Math.max(1, Math.floor(days / 12))) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Smooth wave fluctuation simulation based on card ID
    const seed = (card.id.length * 17) + i;
    const variation = (Math.sin(seed) * 0.08) + ((days - i) / days) * ((card.priceTrend30d || 0) / 100);
    const pointPrice = Math.round((basePrice * (1 + variation)) / 100) * 100;

    points.push({
      date: dateStr,
      price: Math.max(100, pointPrice)
    });
  }

  return points;
}

export function formatYen(amount?: number): string {
  if (amount === undefined || amount === null) {
    return '¥---';
  }
  return `¥${amount.toLocaleString('ja-JP')}`;
}

export function formatPriceRange(minPrice?: number, maxPrice?: number): string {
  if (!minPrice && !maxPrice) {
    return '市場価格データなし';
  }
  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `${formatYen(minPrice)} 〜 ${formatYen(maxPrice)}`;
  }
  return formatYen(minPrice || maxPrice);
}
