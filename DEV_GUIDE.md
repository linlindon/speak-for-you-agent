# AI Agent 專案交接文件 - Phase 2A 完成

## 📌 專案現況總結

這是一個前後端分離的 AI 聊天應用，已完成基本對話功能（Phase 2A）。

### ✅ 已完成功能
- **前端**: Vite + React + TypeScript + Tailwind CSS (暖色調設計)
- **後端**: Node.js + Express + Google Gemini API
- **核心功能**: 多輪對話、對話管理、標題編輯、錯誤處理
- **狀態管理**: Zustand + localStorage
- **API 整合**: 完整的錯誤處理（配額、認證、模型錯誤）

### 🎯 專案目標
靈感來源：[Fly.io - You Should Write An Agent](https://fly.io/blog/everyone-write-an-agent/)

最終目標是實作一個 AI Agent，能夠呼叫工具（天氣查詢、股票查詢）來回答問題。

---

## 🚀 快速啟動

### 前置準備
1. **Google Gemini API Key**
   - 前往：https://aistudio.google.com/
   - 建立 API Key（免費）
   - 格式：`AIzaSy...`

### 啟動後端

```bash
# 1. 進入後端資料夾
cd ai-agent-backend

# 2. 安裝依賴
npm install

# 3. 建立 .env 檔案
# 內容：
# GEMINI_API_KEY=你的API_Key
# PORT=3001

# 4. 啟動開發伺服器
npm run dev

# 成功訊息：
# 🚀 Backend server running on http://localhost:3001
# 📡 Accepting requests from http://localhost:5173
```

### 啟動前端

```bash
# 1. 進入前端資料夾（另開一個終端）
cd ai-agent

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 前端網址：http://localhost:5173
```

### 測試是否正常運作

1. 開啟瀏覽器：`http://localhost:5173`
2. 點擊 "New Chat"
3. 輸入 "你好"
4. 應該會收到 Gemini 的回應

---

## 📂 專案結構

```
專案根目錄/
├── ai-agent/                 # 前端專案
│   ├── src/
│   │   ├── store/
│   │   │   └── chatStore.ts  # Zustand store（含 API 邏輯）
│   │   ├── components/
│   │   │   ├── layout/       # AppLayout, Sidebar
│   │   │   └── chat/         # ChatContainer, MessageList, etc.
│   │   ├── lib/
│   │   │   ├── storage.ts    # localStorage 管理
│   │   │   └── mockData.ts   # 測試資料
│   │   └── types/
│   │       └── chat.ts       # TypeScript 型別定義
│   └── package.json
│
└── ai-agent-backend/         # 後端專案
    ├── routes/
    │   └── chat.js           # POST /api/chat 端點
    ├── server.js             # Express 主伺服器
    ├── .env                  # 環境變數（不要推到 Git）
    ├── .gitignore
    └── package.json
```

---

## 🔑 核心概念

### 1. 前後端分離架構
```
前端 (localhost:5173)
   ↓ fetch('http://localhost:3001/api/chat')
後端 (localhost:3001)
   ↓ Gemini API
Google Gemini
```

### 2. 狀態管理（Zustand）

```typescript
// chatStore.ts 的核心 actions
const {
  sessions,           // 所有對話記錄
  currentSessionId,   // 當前選中的對話 ID
  isLoading,          // API 呼叫狀態
  
  createSession,      // 建立新對話（智慧檢查空對話）
  selectSession,      // 切換對話
  sendMessage,        // 發送訊息並呼叫 API ⭐
  deleteSession,      // 刪除對話
  clearSession,       // 清空對話訊息
  updateSessionTitle, // 修改對話標題
} = useChatStore()
```

### 3. API 呼叫流程

```typescript
// 前端 chatStore.ts 的 sendMessage action
sendMessage(sessionId, content) {
  // 1. 加入使用者訊息到 session
  // 2. 設定 isLoading = true
  // 3. 呼叫 POST http://localhost:3001/api/chat
  // 4. 解析回應或錯誤
  // 5. 加入 AI 訊息到 session
  // 6. 設定 isLoading = false
}

// 後端 routes/chat.js
POST /api/chat {
  // 1. 接收 messages 陣列
  // 2. 轉換格式給 Gemini API
  // 3. 呼叫 Gemini API
  // 4. 回傳結果或錯誤
}
```

---

## ⚠️ 已知問題與限制

### Gemini 免費版限制
- **每分鐘**: 15 requests
- **每天**: 1500 requests
- **多使用者同時使用會很快達到上限**

### 錯誤處理
已實作完整錯誤處理：
- **429 配額錯誤** → "⚠️ 使用額度已達上限，請稍後再試。"
- **401/403 認證錯誤** → "❌ 系統認證失敗，請聯繫管理員。"
- **404 模型錯誤** → "❌ AI 模型暫時無法使用。"
- **500 系統錯誤** → "❌ 發生未預期的錯誤，請稍後再試。"

### 中文輸入法
已修正：使用 `onCompositionStart/End` 事件處理，Enter 不會誤觸發送。

---

## 🧪 測試功能

### 基本功能測試
- [ ] 新建對話（點擊 "New Chat"）
- [ ] 發送訊息並收到 AI 回應
- [ ] 多輪對話（上下文記憶）
- [ ] 切換對話
- [ ] 編輯對話標題（點擊標題）
- [ ] 清空對話訊息（點擊 "Clear" 按鈕）
- [ ] 刪除對話
- [ ] Loading 狀態（發送時顯示轉圈圈）

### RWD 測試
- **Mobile** (< 768px): Sidebar 收合，點擊漢堡選單開啟
- **Tablet** (768-1024px): Sidebar 固定顯示
- **Desktop** (> 1024px): 完整布局

### 錯誤處理測試
- 頻繁發送訊息觸發 429 錯誤
- 檢查錯誤訊息是否友善顯示

---

## 🎯 下一步：Phase 2B - Function Calling

### 目標
實作 AI Agent 工具呼叫功能（參考 Fly.io 文章）

### 需要實作的工具
1. **天氣查詢工具**
   - 使用者：「台北今天天氣如何？」
   - Agent 呼叫天氣 API
   - 回覆：「台北今天晴天，25度」

2. **股票查詢工具**
   - 使用者：「台積電股價多少？」
   - Agent 呼叫股票 API
   - 回覆：「台積電目前股價 XXX 元」

### 技術實作
- Gemini API 支援 function calling
- 後端定義 tools 並處理工具呼叫
- 實作 agent loop（呼叫工具 → 取得結果 → 再呼叫 LLM）

---

## 📚 重要文件

- **PROGRESS.md** - 完整開發歷程和設計決策
- **DEV_GUIDE.md** - 本文件（快速上手指南）
- **Fly.io 文章** - https://fly.io/blog/everyone-write-an-agent/

---

## 💡 給新 AI 的提示

如果你是接手這個專案的 AI：

1. **先閱讀 PROGRESS.md** 了解完整歷程
2. **確認環境能啟動** 前後端都能正常運行
3. **測試基本功能** 確認對話正常
4. **開始 Phase 2B** 實作 function calling

當前專案狀態良好，架構清晰，可以直接開始開發下一階段功能。


**祝開發順利！** 🚀