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
  updateMessageContent: (
    sessionId: string,
    messageId: string,
    content: string,
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

    // 專門給串流 chunk 用：持續改同一則訊息內容
    updateMessageContent: (
      sessionId: string,
      messageId: string,
      content: string,
    ) => {
      set((state) => {
        const updatedSessions = state.sessions.map((session) => {
          if (session.id !== sessionId) return session;

          return {
            ...session,
            messages: session.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content } : msg,
            ),
            updatedAt: new Date(),
          };
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
      // 1) 先加 user 訊息
      get().addMessage(sessionId, content, "user");
      set({ isLoading: true });

      // 2) 先準備要送後端的 messages（不需要包含下面的 assistant 空訊息）
      const updatedSession = get().sessions.find(
        (session) => session.id === sessionId,
      );
      if (!updatedSession) {
        set({ isLoading: false });
        return;
      }

      const messages = updatedSession.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 3) 再建立 assistant 空訊息（給串流逐步更新）
      const assistantMessageId = crypto.randomUUID();
      set((state) => {
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        const updatedSessions = state.sessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            updatedAt: new Date(),
          };
        });

        const newState = {
          ...state,
          sessions: updatedSessions,
        };

        saveToStorage(newState);
        return newState;
      });

      // 打字機狀態。
      // assistantText 是目前已顯示的累積文字，charQueue 是從 stream 收到但還沒顯示的字
      let assistantText = "";
      const charQueue: string[] = [];
      let streamDone = false;

      // 每 25ms 顯示一個字
      const typeTimer = setInterval(() => {
        const ch = charQueue.shift();
        if (ch) {
          assistantText += ch;
          get().updateMessageContent(
            sessionId,
            assistantMessageId,
            assistantText,
          );
        }

        // 串流結束且佇列清空，停止定時器
        if (streamDone && charQueue.length === 0) {
          clearInterval(typeTimer);
        }
      }, 25);

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "API request failed");
        }

        if (!response.body) {
          throw new Error("No response stream from server");
        }

        // getReader 從資料水管拿到讀取器
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        // 第一層 while: 一直讀 stream 直到 server 關閉
        while (true) {
          // reader.read() 每次呼叫就從水管讀一段資料出來
          const { done, value } = await reader.read();
          if (done) break;

          // 把原始 bytes decode 成字串。stream true 是為了避免同一個字的 bytes 被切成兩段傳
          buffer += decoder.decode(value, { stream: true });

          // 一次 value 可能含多個事件，事件之間會用 \n\n 隔開，要分批處理
          while (buffer.includes("\n\n")) {
            const boundary = buffer.indexOf("\n\n");
            const rawEvent = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            let eventType = "message";
            let dataStr = "";

            for (const line of rawEvent.split("\n")) {
              if (line.startsWith("event:")) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataStr += line.slice(5).trim();
              }
            }

            if (!dataStr) continue;

            let payload: any;
            try {
              payload = JSON.parse(dataStr);
            } catch {
              continue;
            }

            if (eventType === "delta") {
              const text = (payload as { text?: string })?.text || "";
              if (text) {
                // 不直接整段塞進 UI，而是入字元佇列
                charQueue.push(...Array.from(text));
              }
            }

            if (eventType === "error") {
              throw new Error(payload?.message || "Streaming error");
            }

            if (eventType === "done") {
              streamDone = true;
            }
          }
        }

        // stream close 也視為完成
        streamDone = true;

        // 等待打字機把剩餘字元顯示完
        while (charQueue.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      } catch (error) {
        clearInterval(typeTimer);
        console.error("Failed to get AI streaming response:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Sorry, I encountered an error. Please try again.";

        get().updateMessageContent(sessionId, assistantMessageId, errorMessage);
      } finally {
        // 保險清理（重複 clearInterval 沒關係）
        clearInterval(typeTimer);
        set({ isLoading: false });
      }
    },
  };
});
