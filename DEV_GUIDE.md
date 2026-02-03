# 開發指南

## 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

### 3. 建置生產版本
```bash
npm run build
```

### 4. 預覽生產版本
```bash
npm run preview
```

---

## 測試假資料

如果需要測試 UI，可以在瀏覽器的開發者工具 Console 中執行：

### 初始化假資料
```javascript
// 在 main.tsx 中引入並呼叫
import { initMockData } from '@/lib/mockData'
initMockData()
```

或者直接在瀏覽器 Console：
```javascript
// 手動建立一些測試資料
localStorage.setItem('chat-sessions', JSON.stringify({
  sessions: [{
    id: 'test-1',
    title: 'Test Chat',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Hello!',
        timestamp: new Date().toISOString()
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Hi there! How can I help you?',
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }],
  currentSessionId: 'test-1'
}))
// 重新整理頁面
location.reload()
```

### 清除假資料
```javascript
localStorage.removeItem('chat-sessions')
location.reload()
```

---

## 測試 RWD

### 測試不同尺寸
- **Mobile**: 開啟瀏覽器開發者工具，切換到手機模式（寬度 < 768px）
- **Tablet**: 設定寬度在 768px - 1024px 之間
- **Desktop**: 寬度 > 1024px

### 測試項目
- [ ] Sidebar 在 Mobile 上可以開關
- [ ] 點擊 session 後 Mobile sidebar 自動關閉
- [ ] New Chat 按鈕正常運作
- [ ] 訊息輸入框可以輸入和發送
- [ ] Enter 發送，Shift+Enter 換行
- [ ] 訊息列表自動滾動到底部
- [ ] 刪除 session 功能正常
- [ ] 所有按鈕 hover 效果正常

---

## 組件架構

```
App.tsx
└── AppLayout (整體布局 + Sidebar)
    └── ChatContainer (聊天區域)
        ├── Header (標題列)
        ├── MessageList (訊息列表)
        │   └── MessageItem (單一訊息)
        └── ChatInput (輸入框)
```

---

## 狀態管理

所有狀態都在 `useChatStore` 中：

```typescript
const {
  sessions,           // 所有對話
  currentSessionId,   // 當前選中的對話 ID
  createSession,      // 建立新對話
  selectSession,      // 選擇對話
  addMessage,         // 新增訊息
  deleteSession,      // 刪除對話
  clearSession,       // 清空對話訊息
} = useChatStore()
```

---

## 常見問題

### Q: 為什麼看不到任何對話？
A: 初次使用時 localStorage 是空的，需要點擊 "New Chat" 建立第一個對話。

### Q: 如何新增測試資料？
A: 可以使用 `mockData.ts` 中的 `initMockData()` 函式，或手動在 Console 中設定 localStorage。

### Q: Sidebar 在 Desktop 上不顯示？
A: 檢查瀏覽器寬度是否 >= 768px，或檢查 CSS 的 `md:` 斷點是否正常運作。

### Q: 如何清除所有資料？
A: 在 Console 執行 `localStorage.clear()` 然後重新整理頁面。

---

## 下一步開發

1. **API 整合** - 串接真實的 LLM API
2. **Loading 狀態** - 新增 loading 動畫
3. **錯誤處理** - 處理 API 錯誤
4. **Session 標題自動生成** - 根據第一則訊息自動生成標題
5. **Markdown 支援** - 支援 Markdown 格式的訊息顯示