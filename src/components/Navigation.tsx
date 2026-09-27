import React from 'react';
import { Home, BookOpen, Camera, Layers, Newspaper } from 'lucide-react';

export type ActiveTab = 'home' | 'pokedex' | 'scan' | 'collection' | 'news';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: ActiveTab; label: string; icon: any; isCenter?: boolean }> = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'pokedex', label: '図鑑', icon: BookOpen },
    { id: 'scan', label: '査定', icon: Camera, isCenter: true },
    { id: 'collection', label: 'コレクション', icon: Layers },
    { id: 'news', label: 'ニュース', icon: Newspaper },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-slate-200/80 dark:border-slate-800/80 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isCenter) {
              return (
                <div key={tab.id} className="relative -top-5">
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 text-white flex flex-col items-center justify-center shadow-lg shadow-red-500/40 active:scale-90 transition-transform border-4 border-slate-50 dark:border-slate-950"
                    aria-label="AI査定"
                  >
                    <Camera className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <span className="text-[10px] font-bold text-center block mt-0.5 text-red-600 dark:text-red-400">
                    査定
                  </span>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sub-Header Navigation */}
      <nav className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 h-12">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600 dark:text-red-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
