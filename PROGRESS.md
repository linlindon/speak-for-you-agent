# AI Agent 專案開發進度

## 專案目標
建立一個簡單的 AI Agent 聊天應用

### MVP 階段規劃
- **Phase 1**: 基本對話 UI + Session 管理（當前階段）
- **Phase 2**: Agent loop + Tools（天氣、計算機等）
- **Phase 3**: 視覺化 Agent 思考過程

---

## 技術棧
- **Framework**: Vite + React + TypeScript
- **State Management**: Zustand（自己管理 localStorage，不用 persist middleware）
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: 原生 fetch（不用 axios）
- RWD: 三種尺寸斷點
  - Mobile: < 768px（單欄，sidebar 可收合）
  - Tablet: 768px - 1024px（雙欄，縮小間距）
  - Desktop: > 1024px（雙欄，完整間距）

---

## 已完成 ✅

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

- addMessage: 自動生成 message id 和 timestamp，同時更新 session 的 updatedAt
- deleteSession: 刪除時智慧處理 currentSessionId
  - 若刪除當前 session 且還有其他 sessions → 自動選擇第一個
  - 若刪除當前 session 且沒有其他 sessions → 設為 null
  - 若刪除非當前 session → currentSessionId 保持不變
- clearSession: 只清空 messages 陣列，保留 session 的 id、title、createdAt


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
- [ ] 測試 UI 功能（修改：移除已完成的 Chat UI Components）
  - 用假資料測試所有組件
  - 測試 RWD 在不同尺寸的表現
  - 修復可能的 bug


---

## 待辦 📋

### Phase 1 剩餘工作
- [ ] 完成整合測試後的優化
  - 修復測試中發現的 bug
  - 優化使用者體驗細節
  - 效能優化（如有需要）
  
- [ ] API 整合（測試完成後）
  - 建立 API route（Vite proxy 或後端）
  - 串接真實 LLM API（OpenAI 或 Claude）
  - 處理 loading 狀態和錯誤處理
  - 實作打字機效果（streaming）

### Phase 2（未來）
- Agent loop 實作
- Tools 整合

### Phase 3（未來）
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
│   │   └── storage.ts ✅
│   ├── store/
│   │   └── chatStore.ts ✅（完成）
│   ├── components/
│   │   ├── layout/
|   |   |   ├── AppLayout.tsx ✅
│   |   |   └── Sidebar.tsx ✅
│   │   └── chat/
│   │       ├── ChatContainer.tsx ✅
│   │       ├── EmptyState.tsx ✅
│   │       ├── MessageList.tsx ✅
│   │       ├── MessageItem.tsx ✅
│   │       └── ChatInput.tsx ✅
│   ├── App.tsx
│   └── main.tsx
```

---

## 下次繼續的點

1. ~~完成 store 的剩餘 actions~~
2. ~~開始建立 UI components（從基礎 layout 開始）~~
3. 建立 App.tsx 整合所有組件
4. 用假資料測試整個 flow
5. 串接真實 API

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

### 使用者體驗
- 避免重複空對話：createSession 會檢查並切換到已有的空對話
- 標題編輯快捷鍵：Enter 儲存 / Esc 取消 / blur 自動儲存
- 危險操作需確認：刪除對話、清空訊息都有 confirm 提示

### 測試資料
- 開發模式下會自動載入 mockData（僅在 localStorage 為空時）
- 可在 Console 執行 `localStorage.clear()` 重置所有資料