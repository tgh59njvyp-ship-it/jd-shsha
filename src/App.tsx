import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { ScanView } from './components/ScanView';
import { CollectionView } from './components/CollectionView';
import { PokedexView } from './components/PokedexView';
import { NewsView } from './components/NewsView';
import { CardDetailModal } from './components/CardDetailModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AccountModal } from './components/AccountModal';
import { AppraisalHistoryModal } from './components/AppraisalHistoryModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { WishlistView } from './components/WishlistView';

import { Card, CollectionItem, AppraisalResult, WishlistItem, NewsItem, ProductItem, NotificationItem, ConditionRank } from './types';
import { INITIAL_CARDS, searchCards } from './services/cardDatabase';
import { loadUserCollection, addCardToCollection, updateCollectionQuantity, getLocalWishlist, toggleWishlistCard, calculateCollectionStats } from './services/collectionService';
import { fetchLatestNews, fetchProducts } from './services/newsService';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from './services/notificationService';

function MainAppContent() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Data state
  const [allCards, setAllCards] = useState<Card[]>(INITIAL_CARDS);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [appraisalHistory, setAppraisalHistory] = useState<AppraisalResult[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [productList, setProductList] = useState<ProductItem[]>([]);

  // Modals state
  const [selectedCardForModal, setSelectedCardForModal] = useState<Card | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAppraisalHistoryOpen, setIsAppraisalHistoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Search & Add Modal
  const [isSearchAddModalOpen, setIsSearchAddModalOpen] = useState(false);
  const [searchModalQuery, setSearchModalQuery] = useState('');
  const [searchModalResults, setSearchModalResults] = useState<Card[]>([]);

  // Load initial data
  useEffect(() => {
    async function init() {
      const col = await loadUserCollection(user?.uid);
      setCollectionItems(col);

      const wish = getLocalWishlist();
      setWishlistItems(wish);

      const notifs = getNotifications();
      setNotifications(notifs);

      const news = await fetchLatestNews();
      setNewsList(news);

      const prods = await fetchProducts();
      setProductList(prods);
    }
    init();
  }, [user?.uid]);

  // Handlers
  const handleAddToCollection = async (card: Card, options?: { condition?: ConditionRank; quantity?: number }) => {
    const item = await addCardToCollection(user?.uid, card, options);
    const col = await loadUserCollection(user?.uid);
    setCollectionItems(col);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const updated = updateCollectionQuantity(itemId, delta, user?.uid);
    setCollectionItems([...updated]);
  };

  const handleToggleWishlist = (card: Card, targetPrice?: number) => {
    const { added, list } = toggleWishlistCard(card, targetPrice, user?.uid);
    setWishlistItems([...list]);
    if (added) {
      showToast('欲しいリストに追加しました', card.name);
    } else {
      showToast('欲しいリストから削除しました', card.name);
    }
  };

  const handleSaveAppraisalHistory = (appraisal: AppraisalResult) => {
    setAppraisalHistory(prev => [appraisal, ...prev]);
  };

  const handleSearchModalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchModalQuery(q);
    if (q.trim().length >= 1) {
      const res = await searchCards({ query: q });
      setSearchModalResults(res);
    } else {
      setSearchModalResults([]);
    }
  };

  const collectionStats = calculateCollectionStats(collectionItems);
  const pokedexCompletionRate = parseFloat(((collectionStats.uniqueSpeciesCount / 1240) * 100).toFixed(1));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      
      {/* Header Bar */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onStartScan={() => setActiveTab('scan')}
        notifications={notifications}
      />

      {/* Sub-Header Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      {/* Main Container View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'home' && (
          <HomeView
            onStartSingleScan={() => setActiveTab('scan')}
            onStartDeskScan={() => setActiveTab('scan')}
            onSelectPhoto={() => setActiveTab('scan')}
            onSelectCard={card => setSelectedCardForModal(card)}
            onNavigateTab={tab => setActiveTab(tab)}
            collectionStats={{
              totalEstimatedValue: collectionStats.totalEstimatedValue,
              totalCardsCount: collectionStats.totalCardsCount,
              uniqueSpeciesCount: collectionStats.uniqueSpeciesCount,
            }}
            pokedexCompletionRate={pokedexCompletionRate}
            recentCollectionItems={collectionItems.slice(0, 4)}
            wishlistItems={wishlistItems}
            latestNews={newsList}
            latestProducts={productList}
            priceMovers={allCards.filter(c => c.hasPriceData)}
          />
        )}

        {activeTab === 'scan' && (
          <ScanView
            onAddToCollection={handleAddToCollection}
            onOpenCardDetail={card => setSelectedCardForModal(card)}
            onSaveToAppraisalHistory={handleSaveAppraisalHistory}
          />
        )}

        {activeTab === 'collection' && (
          <CollectionView
            items={collectionItems}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenCardDetail={card => setSelectedCardForModal(card)}
            onNavigateScan={() => setActiveTab('scan')}
            onAddCardByNameModal={() => setIsSearchAddModalOpen(true)}
          />
        )}

        {activeTab === 'pokedex' && (
          <PokedexView
            allDatabaseCards={allCards}
            collectionItems={collectionItems}
            onOpenCardDetail={card => setSelectedCardForModal(card)}
          />
        )}

        {activeTab === 'news' && (
          <NewsView
            newsList={newsList}
            productList={productList}
          />
        )}
      </main>

      {/* Card Detail Modal */}
      {selectedCardForModal && (
        <CardDetailModal
          card={selectedCardForModal}
          onClose={() => setSelectedCardForModal(null)}
          collectionItem={collectionItems.find(i => i.cardId === selectedCardForModal.id)}
          wishlistItem={wishlistItems.find(w => w.cardId === selectedCardForModal.id)}
          onAddToCollection={handleAddToCollection}
          onToggleWishlist={handleToggleWishlist}
          onStartScan={() => {
            setSelectedCardForModal(null);
            setActiveTab('scan');
          }}
        />
      )}

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAsRead={id => setNotifications(markNotificationAsRead(id))}
          onMarkAllAsRead={() => setNotifications(markAllNotificationsAsRead())}
          onSelectCardById={cardId => {
            const c = allCards.find(item => item.id === cardId);
            if (c) setSelectedCardForModal(c);
          }}
        />
      )}

      {/* Account & Settings Modal */}
      {isAccountOpen && (
        <AccountModal
          onClose={() => setIsAccountOpen(false)}
          onOpenAppraisalHistory={() => setIsAppraisalHistoryOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
        />
      )}

      {/* Past Appraisal History Modal */}
      {isAppraisalHistoryOpen && (
        <AppraisalHistoryModal
          history={appraisalHistory}
          onClose={() => setIsAppraisalHistoryOpen(false)}
          onOpenCardDetail={card => setSelectedCardForModal(card)}
        />
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminDashboardModal
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Wishlist Modal */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
            >
              ✕
            </button>
            <WishlistView
              wishlistItems={wishlistItems}
              onToggleWishlist={handleToggleWishlist}
              onOpenCardDetail={card => setSelectedCardForModal(card)}
            />
          </div>
        </div>
      )}

      {/* Search & Add Modal */}
      {isSearchAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base">カード名で検索して追加</h3>
              <button onClick={() => setIsSearchAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <input
              type="text"
              value={searchModalQuery}
              onChange={handleSearchModalChange}
              placeholder="例: リザードン, ピカチュウ, 096/071"
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {searchModalResults.map(card => (
                <div key={card.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={card.imageUrl} alt={card.name} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <p className="font-bold text-xs">{card.name}</p>
                      <p className="text-[10px] text-slate-400">{card.set} ({card.rarity})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCollection(card);
                      setIsSearchAddModalOpen(false);
                      showToast('追加完了', `${card.name}をマイコレクションに追加しました`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                  >
                    追加
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
