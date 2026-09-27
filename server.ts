import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// High body size limit for base64 camera photo uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Firebase Config Proxy Endpoint
app.get('/api/firebase-config', (req, res) => {
  try {
    const configPath = path.resolve('firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return res.json({
        success: true,
        projectId: config.projectId,
        authDomain: config.authDomain,
        firestoreDatabaseId: config.firestoreDatabaseId,
        storageBucket: config.storageBucket,
      });
    }
    return res.status(404).json({ success: false, error: 'firebase-applet-config.json not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to extract base64 from data URL
function parseBase64(dataUrl: string): { mimeType: string; data: string } {
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], data: matches[2] };
  }
  return { mimeType: 'image/jpeg', data: dataUrl.replace(/^data:image\/\w+;base64,/, '') };
}

// AI Card Analyzer Proxy API
app.post('/api/analyze-card', async (req, res) => {
  try {
    const { imageDataUrl, isMultiScan, backImageDataUrl } = req.body;

    if (!imageDataUrl) {
      return res.status(400).json({ success: false, error: '画像データがありません' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ success: false, fallbackReason: 'no_api_key' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const imagePart = parseBase64(imageDataUrl);

    const prompt = `
You are an expert Pokémon TCG (ポケカ) authenticator and AI card grader.
Analyze the provided image of a Pokémon card.

Extract and analyze:
1. Card Name in Japanese (e.g., リザードンex, ナンジャモ, ピカチュウex)
2. Card Number (e.g., 349/190, 096/071)
3. Rarity (SAR, SR, AR, UR, RRR, RR, R, U, C, PROMO)
4. Set / Series in Japanese (e.g., ハイクラスパック シャイニートレジャーex, クレイバースト)
5. Card Type (悪, 雷, 超, 炎, 水, 草, 闘, 鋼, ドラゴン, 無色, トレーナーズ)
6. Finish / Special (レリーフ加工, イラスト違い, ホロ, 特典プロモ, ノーマル)
7. Condition breakdown:
   - whiteEdges (白かけ): "なし" | "微小" | "あり" | "顕著"
   - scratches (傷): "なし" | "微小" | "あり" | "顕著"
   - dents (へこみ): "なし" | "あり"
   - creases (折れ): "なし" | "あり"
   - stains (汚れ): "なし" | "あり"
   - centering (センタリング): "良好 (60/40以内)" | "やや偏り" | "大幅に偏り"
   - rank: "S" | "A" | "B" | "C" | "D"
8. Confidence score (0-100) and Confidence level ("高" | "中" | "低")

Return strictly a valid JSON object matching this schema:
{
  "cardName": "string",
  "cardNumber": "string",
  "rarity": "string",
  "set": "string",
  "cardType": "string",
  "finish": "string",
  "confidenceScore": 95,
  "confidenceLevel": "高",
  "condition": {
    "rank": "S",
    "whiteEdges": "なし",
    "scratches": "微小",
    "dents": "なし",
    "creases": "なし",
    "stains": "なし",
    "centering": "良好 (60/40以内)",
    "frontSurface": "表面状態良好",
    "backSurface": "裏面状態良好",
    "notes": "角部にわずかな微小白かけが見受けられます。"
  }
}
    `;

    const parts: any[] = [
      { text: prompt },
      { inlineData: { mimeType: imagePart.mimeType, data: imagePart.data } }
    ];

    if (backImageDataUrl) {
      const backImagePart = parseBase64(backImageDataUrl);
      parts.push({
        inlineData: { mimeType: backImagePart.mimeType, data: backImagePart.data }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText);

    return res.json({
      success: true,
      data: parsed
    });

  } catch (error: any) {
    console.error('Gemini Server Analysis Error:', error?.message || error);
    // Return gracefully so client falls back safely without showing raw Google errors
    return res.json({
      success: false,
      fallbackReason: 'gemini_error',
      errorMessage: error?.message || 'Gemini API Error'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
