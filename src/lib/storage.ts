import { StorageData, RawStorageData } from "@/types/chat";

const STORAGE_KEY = "chat-sessions";

export const loadFromStorage = (): StorageData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return null;
    const parsed = JSON.parse(data) as RawStorageData;

    const result: StorageData = {
      currentSessionId: parsed.currentSessionId,
      sessions: parsed.sessions.map((session) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      })),
    };

    return result;
  } catch (error) {
    console.error("Failed to load from storage:", error);
    return null;
  }
};

export const saveToStorage = (data: StorageData) : void => {
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }catch(error){
        console.error('Failed to save to storage:', error)
    }
}

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

