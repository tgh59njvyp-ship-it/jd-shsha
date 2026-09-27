import React from 'react';
import { X, Clock, Camera, ChevronRight, Eye } from 'lucide-react';
import { AppraisalResult, Card } from '../types';
import { formatYen } from '../services/priceService';

interface AppraisalHistoryModalProps {
  history: AppraisalResult[];
  onClose: () => void;
  onOpenCardDetail: (card: Card) => void;
}

export const AppraisalHistoryModal: React.FC<AppraisalHistoryModalProps> = ({
  history,
  onClose,
  onOpenCardDetail,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[85vh] flex flex-col">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600 dark:text-red-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              過去のAI査定履歴 ({history.length}件)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length > 0 ? (
            history.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onOpenCardDetail(item.recognizedCard);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.imageUrl} alt="Scan" className="w-10 h-14 object-cover rounded-lg shrink-0 shadow-sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {item.recognizedCard.name}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold">
                        ランク{item.condition.rank}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.scannedAt.slice(0, 16).replace('T', ' ')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-amber-500 block">
                      {item.hasPriceData ? formatYen(item.estimatedPriceMin) : '価格なし'}
                    </span>
                    <span className="text-[10px] text-slate-400">AI推定査定</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Camera className="w-8 h-8 text-slate-300 mx-auto" />
              <p>査定履歴はまだありません。</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
