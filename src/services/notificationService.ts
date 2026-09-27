import { NotificationItem } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'card_scanner_notifications_v1';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'demo-user',
    type: 'price_alert',
    title: '価格アラート検知',
    message: '欲しいカード「サーナイトex SAR」の参考相場が設定価格¥8,000以下（現在¥7,200）になりました！',
    createdAt: '2026-09-26 19:40',
    isRead: false,
    linkCardId: 'gardevoir-ex-sar-sv4a'
  },
  {
    id: 'notif-2',
    userId: 'demo-user',
    type: 'new_product',
    title: '新商品情報',
    message: 'ハイクラスパック「テラスタルフェスex」公式カードリストが公開されました。',
    createdAt: '2026-09-25 18:05',
    isRead: false,
  },
  {
    id: 'notif-3',
    userId: 'demo-user',
    type: 'collection_milestone',
    title: '図鑑達成記念！',
    message: 'ハイクラスパック「シャイニートレジャーex」のコレクション収集率が80%を突破しました！',
    createdAt: '2026-09-22 14:10',
    isRead: true,
  }
];

export function getNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function markNotificationAsRead(id: string): NotificationItem[] {
  const items = getNotifications();
  const target = items.find(n => n.id === id);
  if (target) {
    target.isRead = true;
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
  }
  return items;
}

export function markAllNotificationsAsRead(): NotificationItem[] {
  const items = getNotifications().map(n => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
  return items;
}
