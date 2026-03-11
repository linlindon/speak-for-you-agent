# AI Agent 專案開發進度

## 專案目標
建立一個簡單的 AI Agent 聊天應用

### MVP 階段規劃
- **Phase 1**: 基本對話 UI + Session 管理（當前階段）
- **Phase 2**: Agent loop + Tools（天氣、計算機等）
- **Phase 3**: 使用 SSE + 前端打字機效果
- **Phase 4**: 視覺化 Agent 思考過程

---

## 技術棧

### 前端
- **Framework**: Vite + React + TypeScript
- **State Management**: Zustand（自己管理 localStorage，不用 persist middleware）
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: 原生 fetch（不用 axios）
- RWD: 三種尺寸斷點
  - Mobile: < 768px（單欄，sidebar 可收合）
  - Tablet: 768px - 1024px（雙欄，縮小間距）
  - Desktop: > 1024px（雙欄，完整間距）


### 後端
- **Framework**: Node.js + Express
- **AI API**: Google Gemini API（gemini-2.0-flash）
- **環境變數**: dotenv
- **開發工具**: nodemon（自動重啟）
- **API 設計**: RESTful API
- **部署計畫**: Fly.io（前後端分離部署）

---

## 已完成 ✅

### 2026-03-11
- [x] 串流回應與逐步顯示（SSE + 打字機效果）
  - 後端 `POST /api/chat` 改為 `text/event-stream` 回應格式（SSE）
  - 後端改用 `chat.sendMessageStream(...)`，將 Gemini 回應逐 chunk 透過 `event: delta` 推送
  - 保留 agent loop 與 function calling，工具執行後可繼續下一輪串流
  - 前端 `chatStore.sendMessage` 改為 `response.body.getReader()` 解析 SSE（`delta/error/done`）
  - 前端新增 assistant placeholder 訊息，回應生成時即時更新同一則訊息內容
  - 前端加入打字機效果（字元 queue + interval）讓內容逐字顯示
  - `MessageItem` 新增 assistant 氣泡 loading 動畫（三個主色跳動圓點）

### 2026-02-17
- [x] Phase 2B - Function Calling（天氣查詢工具）完成
  - 建立 `utils/weatherAPI.js`：封裝 OpenWeatherMap API 呼叫
    - `getCurrentWeather(city)`：查詢指定城市當前天氣
    - `getWeatherForecast(city, days)`：查詢未來最多 5 天預報（每天取 12:00 資料代表當天）
    - `formatWeatherData()`、`formatForecastData()`：格式化天氣資料為易讀字串
  - 建立 `tools/` 資料夾，關注點分離：
    - `tools/definitions.js`：所有工具的 schema 定義（純資料，無邏輯）
    - `tools/executor.js`：工具執行邏輯（接收 AI 呼叫請求，執行對應工具）
    - `tools/index.js`：統一匯出，讓 route 只需 import 一個地方
  - 更新 `routes/chat.js`：整合 Agent Loop
    - 使用 `while (true)` + `break` 處理多輪工具呼叫
    - 使用 `response.functionCalls?.() ?? []` 安全取得 function calls
    - 使用 `Promise.all` 同時執行同一輪的多個工具呼叫
  - `.env` 加入 `OPENWEATHER_API_KEY`

### 2026-02-08
- [x] 後端建置與 API 整合（Phase 2A 完成）
  - 建立獨立的 Node.js + Express 後端專案（ai-agent-backend）
  - 串接 Google Gemini API（gemini-2.0-flash 模型）
  - 實作 `/api/chat` 端點處理對話請求
  - 環境變數管理（.env 存放 API Key）
  - CORS 設定允許前端跨域請求
  - 完整的錯誤處理機制（429 配額、401 認證、404 模型、500 系統錯誤）
  - 友善的中文錯誤訊息回傳給前端
  
- [x] 前端 API 整合
  - chatStore: 重構 API 呼叫邏輯到 `sendMessage` action
  - chatStore: 新增 `isLoading` 狀態追蹤 API 呼叫
  - ChatInput: 簡化組件，只負責 UI 邏輯
  - ChatInput: 加入 loading spinner（發送時顯示動畫）
  - ChatInput: 修正中文輸入法問題（compositionStart/End 事件）
  - ChatInput: 防止重複發送（loading 時禁用按鈕）
  - 錯誤處理：解析後端錯誤並顯示友善訊息

### 2026-02-05

- [x] 整合測試與功能增強
  - main.tsx: 加入開發模式自動載入測試資料（僅在 localStorage 為空時）
  - chatStore: 新增 updateSessionTitle action（修改對話標題）
  - chatStore: 優化 createSession（檢查是否已有空對話，避免重複建立）
  - ChatContainer: 加入「Clear Messages」按鈕（清空對話訊息）
  - ChatContainer: 實作標題內聯編輯功能（點擊標題即可編輯）
  - ChatInput: 修正 textarea 滾動條問題（動態控制 overflow）

### 2026-02-01
 - [x] src/store/chatStore.ts - 完成所有核心 actions
   - addMessage: 新增訊息到指定 session（自動生成 id 和 timestamp）
   - deleteSession: 刪除 session（智慧處理 currentSessionId）
   - clearSession: 清空 session 的 messages（保留 session 本身）

- [x] src/components/layout/ - Layout 組件（暖色調設計）
   - AppLayout: 整體布局 + RWD + sidebar 狀態管理
   - Sidebar: Session 列表 + New Chat 按鈕

- [x] src/components/chat/ - Chat UI 組件（新增）
   - ChatContainer: 聊天區域容器，整合所有聊天組件
   - EmptyState: 空狀態顯示（兩種模式）
   - MessageList: 訊息列表 + 自動滾動
   - MessageItem: 單一訊息顯示（user/assistant/system）
   - ChatInput: 訊息輸入框 + Enter 發送 + 自動調整高度

### 2026-01-26
- [x] 專案初始化（Vite + React + TypeScript + Tailwind）
- [x] 安裝 Zustand, shadcn/ui
- [x] 確定檔案結構規劃
- [x] `src/types/chat.ts` - 定義核心型別
  - Message: id, role, content, timestamp
  - Session: id, title, messages, createdAt, updatedAt
- [x] `src/lib/storage.ts` - localStorage 管理
  - loadFromStorage: 讀取並轉換 Date
  - saveToStorage: 儲存
  - clearStorage: 清除
- [x] `src/store/chatStore.ts` - Zustand store 基礎
  - createSession: 建立新對話
  - selectSession: 切換當前對話

---

## 重要設計決策 💡

### Session vs Message
- **Session** = 一個完整的對話串（類似 ChatGPT 左側的一個項目）
- **Message** = 一則訊息（user 或 assistant 說的話）
- 一個 Session 包含多個 Messages

### State 管理
- `sessions: Session[]` - 儲存所有對話記錄
- `currentSessionId: string | null` - 只是「指標」，指向當前選中的 session
- `selectSession(id)` 只改指標，不 filter sessions

### localStorage
- 不使用 Zustand 的 persist middleware（容易有問題）
- 自己寫 storage.ts 管理
- 每次 state 改變時手動呼叫 saveToStorage()

### chatStore Actions 設計

- **createSession**: 建立新對話，返回 session id 或 null
  - 智慧檢查：若已有空對話（messages.length === 0），直接切換過去，不建立新的
  - 返回 `null` 時表示已有空對話，Sidebar 會顯示提示訊息
  - 返回 `string` (session id) 時表示成功建立新對話
- **addMessage**: 自動生成 message id 和 timestamp，同時更新 session 的 updatedAt
- **deleteSession**: 刪除時智慧處理 currentSessionId
  - 若刪除當前 session 且還有其他 sessions → 自動選擇第一個
  - 若刪除當前 session 且沒有其他 sessions → 設為 null
  - 若刪除非當前 session → currentSessionId 保持不變
- **clearSession**: 只清空 messages 陣列，保留 session 的 id、title、createdAt
- **updateSessionTitle**: 更新對話標題
  - 自動 trim 空白，若為空則使用 "New Chat" 作為預設值
  - 同時更新 session 的 updatedAt

- **sendMessage**: 發送訊息並以 SSE 串流接收 AI 回應（核心功能）
  - 加入使用者訊息到 session
  - 設定 isLoading 為 true
  - 建立 assistant placeholder 訊息（先顯示頭像與對話框）
  - 呼叫後端 `/api/chat` 並使用 `ReadableStream` 逐段解析 SSE 事件
  - `delta` 事件：即時更新同一則 assistant 訊息內容
  - `error` 事件：顯示友善錯誤訊息
  - `done` / 串流結束：收尾並將 isLoading 設為 false

### 後端架構設計

- **前後端分離**: 獨立的 Express 後端（ai-agent-backend）
- **API 端點**: `POST /api/chat` - 以 SSE（`text/event-stream`）串流回傳對話內容
- **訊息格式轉換**: 前端格式 → Gemini API 格式
  - 前端: `{ role: 'user' | 'assistant', content: string }`
  - Gemini: `{ role: 'user' | 'model', parts: [{ text: string }] }`
- **錯誤分類處理**:
  - 429 配額錯誤 → 使用者友善訊息 + retry 時間
  - 401/403 認證錯誤 → 提示聯繫管理員
  - 404 模型錯誤 → 提示模型不可用
  - 500 系統錯誤 → 通用錯誤訊息


### RWD 響應式設計

- Mobile (< 768px)

  - Sidebar 預設隱藏，點擊按鈕顯示（overlay 模式）
  - 單欄布局，聊天區域佔滿螢幕
  - 簡化 UI 元素，增大點擊區域

- Tablet (768px - 1024px)

  - Sidebar 固定顯示，寬度縮小
  - 雙欄布局，調整間距


- Desktop (> 1024px)

  - 完整雙欄布局
  - Sidebar 完整寬度 (256px)
  - 所有功能完整顯示

### 配色方案（暖色調設計）

- Sidebar 背景: #E6A070 暖駝色
- 主要背景: #FFF9F3 溫馨奶油白
- 輸入框區域: #FDF2E9 淺暖色
- 使用者對話框: #FFAB76 溫暖珊瑚橘
- AI 對話框: #FFFFFF 純白
- 強調色/按鈕: 使用 Sidebar 背景色或半透明白色
- 文字:

  - Sidebar 文字: 白色 / 白色透明
  - 主要文字: #333333 深灰
  - 次要文字: #666666 中灰

### Chat UI 設計細節
- **ChatContainer Header**:
  - 點擊標題可內聯編輯（inline editing）
  - 編輯模式：Enter 儲存 / Esc 取消 / blur 自動儲存
  - 使用兩個 state 管理編輯：`isEditingTitle`（UI 模式）+ `editedTitle`（暫存內容）
  - Hover 顯示編輯圖示提示
  - 「Clear Messages」按鈕：只在有訊息時顯示，需確認後清空


- **MessageItem**:

  - User 訊息右對齊，珊瑚橘背景，右上角切角
  - Assistant 訊息左對齊，白色背景，左上角切角
  - 智慧時間戳記格式化（Just now / 15m ago / 3h ago / Jan 15）


- **ChatInput**:

  - 不支援語音輸入（已移除）
  - Enter 發送，Shift+Enter 換行
  - 自動調整高度（最高 150px）
  - 發送按鈕 icon 向右旋轉（-rotate-90）


- MessageList: 新訊息到達時自動滾動到底部（smooth 動畫）


---

## 進行中 🚧

### 當前任務
- [ ] 無


---

## 待辦 📋

### Phase 2B：Function Calling（工具呼叫）
靈感來源：[Fly.io - You Should Write An Agent](https://fly.io/blog/everyone-write-an-agent/)

-  [x] 實作 Agent Loop
  - 後端實作工具呼叫機制
  - 處理 Gemini 的 function calling 回應
  - 循環呼叫直到不需要工具

- [x] 天氣查詢工具
  - 定義 weather tool 給 Gemini（getCurrentWeather、getWeatherForecast）
  - 整合 OpenWeatherMap API
  - 支援當前天氣和未來 5 天預報
  - 工具定義抽離到 `tools/` 資料夾，保持 route 乾淨

- [ ] UI 改進（選配）
  - 顯示工具呼叫過程（「正在查詢天氣...」）
  - 美化工具回應的顯示方式

### Phase 2C：部署（選配）
部署計畫：Fly.io 前後端分離部署

- [x] 後端部署準備
  - 建立 Dockerfile
  - 設定 fly.toml 配置檔
  - 環境變數設定（GEMINI_API_KEY）
  - 測試 Docker 本地建置

- [x] 前端部署準備
  - 更新 API 端點為生產環境 URL
  - 建置生產版本
  - 設定環境變數

- [x] Fly.io 部署
  - 部署後端到 Fly.io
  - 部署前端到 Fly.io（或 Vercel/Netlify）
  - 設定 CORS 允許生產環境網址
  - 測試生產環境功能

### Phase 3:打字機效果呈現 assistant 回應訊息


### Phase 4（未來）
- 視覺化 Agent steps

---

## 檔案結構
```
ai-agent/
├── src/
│   ├── types/
│   │   └── chat.ts ✅
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── storage.ts ✅
│   │   └── mockData.ts ✅
│   ├── store/
│   │   └── chatStore.ts ✅
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx ✅
│   │   │   └── Sidebar.tsx ✅
│   │   └── chat/
│   │       ├── ChatContainer.tsx ✅
│   │       ├── EmptyState.tsx ✅
│   │       ├── MessageList.tsx ✅
│   │       ├── MessageItem.tsx ✅
│   │       └── ChatInput.tsx ✅
│   ├── App.tsx ✅
│   ├── main.tsx ✅
│   └── index.css ✅
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 後端專案（ai-agent-backend）
```
ai-agent-backend/
├── routes/
│   └── chat.js ✅ (處理 /api/chat 端點 + Agent Loop)
├── tools/
│   ├── definitions.js ✅ (工具 schema 定義)
│   ├── executor.js ✅ (工具執行邏輯)
│   └── index.js ✅ (統一匯出)
├── utils/
│   └── weatherAPI.js ✅ (OpenWeatherMap API 封裝)
├── server.js ✅ (Express 主伺服器)
├── .env ✅ (環境變數：GEMINI_API_KEY, OPENWEATHER_API_KEY, PORT)
├── .gitignore ✅
├── package.json ✅
└── (未來) Dockerfile (部署用)
```

---

## 下次繼續的點

1. ~~完成 store 的剩餘 actions~~ ✅
2. ~~開始建立 UI components（從基礎 layout 開始）~~ ✅
3. ~~建立 App.tsx 整合所有組件~~ ✅
4. ~~用假資料測試整個 flow~~ ✅
5. ~~完成整合測試，確保所有功能正常運作~~ ✅
6. ~~串接真實 API（Google Gemini）~~ ✅（Phase 2A 完成）
7. ~~實作 Function Calling（天氣工具、Agent Loop）~~ ✅（Phase 2B 完成）
8. ~~部署到 Fly.io~~

---

## 常見問題 / 注意事項

### 資料管理
- Date 物件在 localStorage 會變成 string，記得轉換
- currentSessionId 是指標概念，不是 filter
- 每個 action 都要記得呼叫 saveToStorage()

### React 模式
- **受控組件 (Controlled Component)**：標題編輯使用兩個 state
  - `isEditingTitle`：控制顯示/編輯模式（UI 切換）
  - `editedTitle`：暫存編輯內容（可取消，不污染原始資料）
- **動態樣式控制**：ChatInput 根據內容高度動態切換 overflow 樣式
- **中文輸入法處理**：使用 `onCompositionStart/End` 事件避免誤觸發送

### API 整合
- **關注點分離**：API 邏輯在 chatStore，Component 只管 UI
- **串流傳輸**：後端使用 SSE 回傳 `delta/error/done` 事件，前端需逐段解析
- **錯誤處理**：後端分類錯誤 → 前端解析並顯示友善訊息
- **Loading 狀態**：全域 isLoading 防止重複請求，並搭配對話框內 loading 動畫
- **API Key 安全**：絕對不要把 API Key 寫在前端，必須在後端處理

### Agent Loop 設計

- **while (true) + break**：比 `while (condition)` 更清楚，終止條件只有一個地方
- **`response.functionCalls?.() ?? []`**：`functionCalls` 是 function，呼叫後才可能回傳 `undefined`，用 `?.()` + `?? []` 安全處理
- **Promise.all**：同一輪 AI 可能要求呼叫多個工具（例如同時查台北和東京天氣），用 `Promise.all` 同時執行，不需要依序等待
- **while 處理「多輪」，Promise.all 處理「同一輪的多個工具」**

### 工具模組化設計（tools/）

- **`tools/definitions.js`**：純資料，只放 schema，未來加新工具只需在這裡新增
- **`tools/executor.js`**：純邏輯，根據工具名稱執行對應函式
- **`tools/index.js`**：統一匯出，route 只需 import 一個地方
- **好處**：新增工具時 `routes/chat.js` 完全不需要動

### 後端開發
- **環境變數**：`.env` 不要推到 Git（已在 .gitignore）
- **CORS 設定**：開發時允許 `localhost:5173`，部署時改成生產網址
- **錯誤分類**：429 配額、401 認證、404 模型、500 系統錯誤
- **nodemon**：開發時自動重啟，修改程式碼立即生效

### 使用者體驗
- **避免重複空對話**：createSession 會檢查並切換到已有的空對話
- **標題編輯快捷鍵**：Enter 儲存 / Esc 取消 / blur 自動儲存
- **危險操作需確認**：刪除對話、清空訊息都有 confirm 提示

### 部署注意事項
- **Fly.io 部署**：前後端分離，各自獨立部署
- **環境變數**：生產環境的 API Key 要在 Fly.io 後台設定
- **API 端點**：前端需要改成後端的生產網址