import React, { useState, useRef } from 'react';
import { Camera, Upload, Layers, CheckCircle2, AlertCircle, RefreshCw, Plus, Heart, ShieldAlert, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { AppraisalResult, Card, ConditionRank } from '../types';
import { analyzeCardImage } from '../services/aiService';
import { formatYen, formatPriceRange } from '../services/priceService';
import { useToast } from '../context/ToastContext';

interface ScanViewProps {
  onAddToCollection: (card: Card, options?: { condition?: ConditionRank; quantity?: number }) => void;
  onOpenCardDetail: (card: Card) => void;
  onSaveToAppraisalHistory: (appraisal: AppraisalResult) => void;
}

const STEPS = [
  'カード画像を解析中…',
  'カード領域を自動検出中…',
  'カード名をテキスト認識中…',
  'カード番号・版数を確認中…',
  'レアリティ・特殊加工を判定中…',
  '収録シリーズ・パックを特定中…',
  'リアルタイム市場価格データを照合中…',
  '白かけ・擦れ・傷・センタリングをAI分析中…',
  '推定査定価格を最終計算中…',
];

export const ScanView: React.FC<ScanViewProps> = ({
  onAddToCollection,
  onOpenCardDetail,
  onSaveToAppraisalHistory,
}) => {
  const { showToast } = useToast();
  
  const [isMultiScan, setIsMultiScan] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [appraisalResults, setAppraisalResults] = useState<AppraisalResult[] | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File, isBack = false) => {
    if (!file.type.match(/image\/(jpeg|png|webp|jpg)/i)) {
      showToast('エラー', '対応フォーマットはJPEG / PNG / WEBPです', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isBack) {
        setBackImage(result);
        showToast('成功', '裏面画像を追加しました');
      } else {
        setSelectedImage(result);
        setAppraisalResults(null);
        setScanError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setScanError(null);
    setCurrentStepIndex(0);

    // Step-by-step progress simulation
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 320);

    try {
      const results = await analyzeCardImage(selectedImage, {
        isMultiScan,
        backImageDataUrl: backImage || undefined
      });

      clearInterval(interval);
      setIsProcessing(false);
      setAppraisalResults(results);

      // Save to history
      results.forEach(res => onSaveToAppraisalHistory(res));
      showToast('解析完了', `${results.length}枚のカードを査定しました`);
    } catch (err) {
      clearInterval(interval);
      setIsProcessing(false);
      setScanError('カードを認識できませんでした。カード全体が写っていて、明るくピントの合った写真をアップロードしてください。');
      showToast('エラー', 'AI認識に失敗しました', 'error');
    }
  };

  // Calculate sum for multi-card results
  const totalMultiEstimatedMin = appraisalResults
    ?.filter(r => r.hasPriceData && r.estimatedPriceMin)
    .reduce((acc, r) => acc + (r.estimatedPriceMin || 0), 0);

  const totalMultiEstimatedMax = appraisalResults
    ?.filter(r => r.hasPriceData && r.estimatedPriceMax)
    .reduce((acc, r) => acc + (r.estimatedPriceMax || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-7 h-7 text-red-600 dark:text-red-500" />
            AIカード査定
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            写真をアップロードするとAIが即座にポケカを認識・状態判定・査定します。
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setIsMultiScan(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !isMultiScan
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            単体撮影
          </button>
          <button
            onClick={() => setIsMultiScan(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isMultiScan
                ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>複数枚まとめ査定</span>
          </button>
        </div>
      </div>

      {/* Upload Zone & Controls */}
      {!isProcessing && !appraisalResults && (
        <div className="space-y-6">
          
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer overflow-hidden ${
              selectedImage
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-slate-300 dark:border-slate-700 hover:border-red-500/80 bg-white dark:bg-slate-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />

            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative inline-block max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500">
                  <img src={selectedImage} alt="Scanned Card" className="w-full h-auto object-cover max-h-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                    <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-full font-extrabold shadow">
                      {isMultiScan ? '複数カード自動検出モード' : 'カード領域検出済み'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  画像をタップして別の写真をえらぶ
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {isMultiScan ? '机に並べたカードの写真をアップロード' : 'ポケカの表面写真をアップロード'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    カメラで撮影、またはドラッグ＆ドロップ（JPEG, PNG, WEBP対応）
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Camera className="w-4 h-4 text-red-500" />
                  <span>タップして撮影・ファイル選択</span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Back Image uploader for single scan */}
          {!isMultiScan && selectedImage && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {backImage ? (
                  <img src={backImage} alt="Back" className="w-10 h-14 object-cover rounded-lg border border-emerald-500" />
                ) : (
                  <div className="w-10 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    裏面
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    裏面画像（任意・推奨）
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {backImage ? '裏面画像アップロード済み（白かけ・裏面傷を判定できます）' : '裏面を追加するとAI査定精度が向上します'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => backFileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                {backImage ? '変更' : '裏面を追加'}
              </button>

              <input
                ref={backFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
              />
            </div>
          )}

          {/* Scan trigger button */}
          {selectedImage && (
            <button
              onClick={startAnalysis}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base shadow-xl shadow-red-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>AI査定を実行する</span>
            </button>
          )}

          {/* Error Message */}
          {scanError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">認識エラー</p>
                <p className="mt-0.5">{scanError}</p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Processing Screen */}
      {isProcessing && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-8 shadow-xl">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              カードを解析しています…
            </h2>
            <p className="text-sm font-extrabold text-red-600 dark:text-red-400">
              {STEPS[currentStepIndex]}
            </p>
          </div>

          {/* Sequential Step checklist UI */}
          <div className="max-w-md mx-auto space-y-2 text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            {STEPS.map((stepName, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
                    isCurrent ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold' : isDone ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <span>{idx + 1}. {stepName.replace('…', '').replace('中', '')}</span>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appraisal Results Screen */}
      {appraisalResults && !isProcessing && (
        <div className="space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              査定結果 ({appraisalResults.length}件)
            </h2>

            <button
              onClick={() => {
                setAppraisalResults(null);
                setSelectedImage(null);
                setBackImage(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              もう一度査定する
            </button>
          </div>

          {/* Loop over results */}
          {appraisalResults.map((result, idx) => {
            const card = result.recognizedCard;
            const cond = result.condition;

            return (
              <div
                key={result.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6"
              >
                {/* Result Top Info */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Card Image */}
                  <div className="w-full md:w-56 shrink-0 text-center">
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-48 md:w-full h-auto mx-auto object-cover rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
                    />
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        認識信頼度: {result.confidenceLevel} ({result.confidenceScore}%)
                      </span>
                    </div>
                  </div>

                  {/* Card Main Info & Estimated Price */}
                  <div className="flex-1 space-y-4 w-full">
                    
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-extrabold">
                          {card.rarity}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                          {card.cardType}
                        </span>
                        <span className="text-xs text-slate-500">{card.cardNumber}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                        {card.name}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{card.set}</p>
                    </div>

                    {/* Estimated Price Banner */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>AI推定査定価格 (ランク{cond.rank})</span>
                        <span className="text-[10px] text-amber-400">{card.priceSource || '市場データ'}</span>
                      </div>

                      {result.hasPriceData ? (
                        <p className="text-3xl sm:text-4xl font-black text-amber-300">
                          {formatPriceRange(result.estimatedPriceMin, result.estimatedPriceMax)}
                        </p>
                      ) : (
                        <p className="text-base font-bold text-amber-400/90">
                          現在の市場価格データを取得できません
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                        {result.disclaimer}
                      </p>
                    </div>

                    {/* Condition AI Rating */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          カード状態AI判定結果
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          cond.rank === 'S' ? 'bg-emerald-500 text-white' :
                          cond.rank === 'A' ? 'bg-blue-500 text-white' :
                          cond.rank === 'B' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          ランク {cond.rank}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">白かけ</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cond.whiteEdges}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">傷・擦れ</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cond.scratches}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">へこみ・折れ</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cond.dents} / {cond.creases}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px]">センタリング</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cond.centering}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-2">
                          <span className="text-slate-400 block text-[10px]">裏面状態</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cond.backSurface}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          onAddToCollection(card, { condition: cond.rank });
                          showToast('コレクションに追加しました', `${card.name} (ランク${cond.rank})`);
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>マイコレクションに追加</span>
                      </button>

                      <button
                        onClick={() => onOpenCardDetail(card)}
                        className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>詳細・価格推移</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* Candidate cards list if confidence is not 100% */}
                {result.candidates.length > 1 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-500">他の認識候補:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {result.candidates.map((cand, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => onOpenCardDetail(cand.card)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 text-xs hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <img src={cand.card.imageUrl} alt={cand.card.name} className="w-8 h-11 object-cover rounded" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-slate-900 dark:text-white">{cand.card.name}</p>
                            <span className="text-[10px] text-slate-400">一致率: {cand.confidenceScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}

          {/* Multi-scan Total Sum Footer */}
          {isMultiScan && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
              <div>
                <p className="text-xs text-slate-400">合計推定価格 ({appraisalResults.length}枚)</p>
                <p className="text-2xl sm:text-3xl font-black text-amber-300">
                  {formatPriceRange(totalMultiEstimatedMin, totalMultiEstimatedMax)}
                </p>
                <p className="text-[10px] text-slate-400">※価格データが存在しないカードは合計に含めません。</p>
              </div>

              <button
                onClick={() => {
                  appraisalResults.forEach(r => onAddToCollection(r.recognizedCard, { condition: r.condition.rank }));
                  showToast('一括登録完了', 'すべてのカードをマイコレクションに追加しました');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg active:scale-95 transition-all"
              >
                全カードを一括コレクション登録
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
