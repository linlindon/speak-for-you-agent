// src/types/chat.ts

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface RawMessage extends Omit<Message, 'timestamp'>
{
  timestamp: string
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface RawSession extends Omit<Session, 'createdAt'|'updatedAt'|'messages'>
{
  createdAt: string
  updatedAt: string
  messages: RawMessage[]
}

export interface StorageData {
  sessions: Session[];
  currentSessionId: string | null;
}

export interface RawStorageData {                                                                                                                                                  
    sessions: RawSession[];                                                                                                                                                          
    currentSessionId: string | null;                                                                                                                                                 
  }      