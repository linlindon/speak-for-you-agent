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

---

## 已完成 ✅

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

---

## 進行中 🚧

### 當前任務
- [ ] 完成 store 的其他 actions
  - addMessage
  - deleteSession
  - clearSession
  - updateSessionTitle（可選）

---

## 待辦 📋

### Phase 1 剩餘工作
- [ ] 建立 UI Components
  - layout/AppLayout
  - layout/Sidebar
  - layout/Header
  - chat/ChatContainer
  - chat/MessageList
  - chat/MessageItem
  - chat/ChatInput
  - chat/EmptyState
- [ ] 串接假資料測試 UI
- [ ] 建立 API route（Next.js API 或 Vite proxy）
- [ ] 串接真實 LLM API（OpenAI 或 Claude）

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
│   │   └── chatStore.ts ✅（部分完成）
│   ├── components/
│   │   ├── layout/
│   │   └── chat/
│   ├── App.tsx
│   └── main.tsx
```

---

## 下次繼續的點

1. 完成 store 的剩餘 actions
2. 開始建立 UI components
3. 用假資料測試整個 flow

---

## 常見問題 / 注意事項

- Date 物件在 localStorage 會變成 string，記得轉換
- currentSessionId 是指標概念，不是 filter
- 每個 action 都要記得呼叫 saveToStorage()