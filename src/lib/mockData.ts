import { Session } from '@/types/chat'

/**
 * 建立測試用的假資料
 * 可以在開發時用來測試 UI
 */
export function createMockSessions(): Session[] {
  const now = new Date()
  
  return [
    {
      id: 'session-1',
      title: 'Hello World Example',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello! Can you help me understand how this works?',
          timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Of course! I\'d be happy to help. This is an AI Agent chat interface. You can ask me questions and I\'ll do my best to assist you.',
          timestamp: new Date(now.getTime() - 3540000), // 59 minutes ago
        },
        {
          id: 'msg-3',
          role: 'user',
          content: 'That\'s great! What kind of things can you help with?',
          timestamp: new Date(now.getTime() - 3480000), // 58 minutes ago
        },
        {
          id: 'msg-4',
          role: 'assistant',
          content: 'I can help with a variety of tasks including:\n- Answering questions\n- Explaining concepts\n- Writing and debugging code\n- Creative writing\n- And much more!',
          timestamp: new Date(now.getTime() - 3420000), // 57 minutes ago
        },
      ],
      createdAt: new Date(now.getTime() - 7200000), // 2 hours ago
      updatedAt: new Date(now.getTime() - 3420000),
    },
    {
      id: 'session-2',
      title: 'JavaScript Tips',
      messages: [
        {
          id: 'msg-5',
          role: 'user',
          content: 'What are some ES6 features I should know?',
          timestamp: new Date(now.getTime() - 86400000), // 1 day ago
        },
        {
          id: 'msg-6',
          role: 'assistant',
          content: 'Here are some essential ES6 features:\n\n1. Arrow functions\n2. Template literals\n3. Destructuring\n4. Spread operator\n5. Promises\n6. Classes\n\nWould you like me to explain any of these in detail?',
          timestamp: new Date(now.getTime() - 86340000),
        },
      ],
      createdAt: new Date(now.getTime() - 86400000),
      updatedAt: new Date(now.getTime() - 86340000),
    },
    {
      id: 'session-3',
      title: 'Quick Question',
      messages: [],
      createdAt: new Date(now.getTime() - 1800000), // 30 minutes ago
      updatedAt: new Date(now.getTime() - 1800000),
    },
  ]
}

/**
 * 初始化測試資料到 localStorage
 * 僅在開發時使用
 */
export function initMockData() {
  const mockSessions = createMockSessions()
  const mockData = {
    sessions: mockSessions,
    currentSessionId: mockSessions[0].id,
  }
  
  localStorage.setItem('chat-sessions', JSON.stringify(mockData))
  console.log('✅ Mock data initialized')
}

/**
 * 清除測試資料
 */
export function clearMockData() {
  localStorage.removeItem('chat-sessions')
  console.log('🗑️  Mock data cleared')
}
