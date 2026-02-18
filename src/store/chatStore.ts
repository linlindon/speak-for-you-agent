import { create } from "zustand";
import { Session, Message } from "@/types/chat";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

interface ChatStore {
  sessions: Session[];
  currentSessionId: string | null;
  isLoading: boolean; //追蹤 API 呼叫狀態

  // Actions
  createSession: () => void;
  selectSession: (id: string) => void;
  addMessage: (
    sessionId: string,
    content: string,
    role: "user" | "assistant",
  ) => void;
  deleteSession: (id: string) => void;
  clearSession: (id: string) => void;
  updateSessionTitle: (id: string, newTitle: string) => void;
  sendMessage: (sessionId: string, content: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => {
  // 初始化時從 localStorage 載入
  const stored = loadFromStorage();

  return {
    // Initial state
    sessions: stored?.sessions || [],
    currentSessionId: stored?.currentSessionId || null,
    isLoading: false,

    // Actions
    createSession: () => {
      const state = get();

      // 檢查是否已經有空對話（沒有任何訊息）
      const emptySession = state.sessions.find(
        (session) => session.messages.length === 0,
      );

      // 如果已經有空對話存在，就不建立新對話
      if (emptySession) {
        set((state) => {
          const newState = {
            ...state,
            currentSessionId: emptySession.id,
          };
          saveToStorage(newState);
          return newState;
        });
        return null;
      }

      const newSession: Session = {
        id: crypto.randomUUID(),
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => {
        const newState = {
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
        };
        saveToStorage(newState);
        return newState;
      });
      return newSession.id;
    },

    selectSession: (id: string) => {
      set((state) => {
        const newState = {
          ...state,
          currentSessionId: id,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    addMessage: (
      sessionId: string,
      content: string,
      role: "user" | "assistant",
    ) => {
      set((state) => {
        const newMessage: Message = {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: new Date(),
        };

        const updatedSessions = state.sessions.map((session) => {
          if (session.id === sessionId) {
            return {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: new Date(),
            };
          }
          return session;
        });

        const newState = {
          ...state,
          sessions: updatedSessions,
        };

        saveToStorage(newState);
        return newState;
      });
    },

    deleteSession: (id: string) => {
      set((state) => {
        // 要留下來的對話紀錄 sessions
        const filteredSessions = state.sessions.filter(
          (session) => session.id !== id,
        );

        let newCurrentSessionId = state.currentSessionId;
        if (newCurrentSessionId === id) {
          newCurrentSessionId =
            filteredSessions.length > 0 ? filteredSessions[0].id : null;
        }

        const newState = {
          sessions: filteredSessions,
          currentSessionId: newCurrentSessionId,
        };

        saveToStorage(newState);
        return newState;
      });
    },

    clearSession: (id: string) => {
      set((state) => {
        const updatedSessions = state.sessions.map((session) => {
          if (session.id === id) {
            return {
              ...session,
              messages: [],
              updatedAt: new Date(),
            };
          }
          return session;
        });

        const newState = {
          ...state,
          sessions: updatedSessions,
        };

        saveToStorage(newState);
        return newState;
      });
    },

    updateSessionTitle: (id: string, newTitle: string) => {
      set((state) => {
        const updatedSessions = state.sessions.map((session) => {
          if (session.id === id) {
            return {
              ...session,
              title: newTitle.trim() || "New CHat",
              updatedAt: new Date(),
            };
          }
          return session;
        });
        const newState = {
          ...state,
          sessions: updatedSessions,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    sendMessage: async (sessionId: string, content: string) => {
      // 1. 新增用戶訊息
      get().addMessage(sessionId, content, "user");
      // 2. 設定 loading
      set({ isLoading: true });

      try {
        // 準備要傳給後端的訊息(歷史＋最新的)
        const updatedSession = get().sessions.find(
          (session) => session.id === sessionId,
        );
        if (!updatedSession) return;

        const messages = updatedSession.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // 3. 呼叫後端 API
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.userMessage || errorData.message || "API request failed",
          );
        }

        const data = await response.json();

        get().addMessage(sessionId, data.reply, "assistant");
      } catch (error) {
        console.error("Failed to get AI response:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Sorry, I encountered an error. Please try again.";

        // 5. 錯誤處理：加入錯誤訊息
        get().addMessage(sessionId, errorMessage, "assistant");
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
