import { create } from "zustand";
import { Session, Message } from "@/types/chat";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

interface ChatStore {
  sessions: Session[];
  currentSessionId: string | null;

  // Actions
  createSession: () => void;
  selectSession: (id: string) => void;
  addMessage: (sessionId: string, content: string, role: 'user' | 'assistant') => void;
  deleteSession: (id: string) => void;
  clearSession: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => {
  // 初始化時從 localStorage 載入
  const stored = loadFromStorage();

  return {
    // Initial state
    sessions: stored?.sessions || [],
    currentSessionId: stored?.currentSessionId || null,

    // Actions
    createSession: () => {
      const state = get();

      // 檢查是否已經有空對話（沒有任何訊息）
      const emptySession = state.sessions.find(
        (session) => session.messages.length === 0
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
        }

        saveToStorage(newState);
        return newState
      });
    },
  };
});
