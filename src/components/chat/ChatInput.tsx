import { useState, useRef, KeyboardEvent } from 'react'
import { useChatStore } from '@/store/chatStore'

export function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { currentSessionId, addMessage } = useChatStore()

  const handleSend = () => {
    if (!input.trim() || !currentSessionId) return

    // Add user message
    addMessage(currentSessionId, input.trim(), 'user')

    // Clear input
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // TODO: Call AI API and add assistant response
    // For now, just add a dummy response
    setTimeout(() => {
      addMessage(
        currentSessionId,
        'This is a test response. AI integration coming soon!',
        'assistant'
      )
    }, 500)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Text Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-[#FFAB76]/50 focus:border-[#FFAB76]
                   resize-none text-gray-800 placeholder-gray-400
                   transition-all"
          style={{ minHeight: '48px', maxHeight: '150px' }}
        />

        {/* Character count or helper text (optional) */}
        {input.length > 0 && (
          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
            {input.length}
          </div>
        )}
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className={`
          flex-shrink-0 w-12 h-12 rounded-full transition-all flex items-center justify-center
          ${
            input.trim()
              ? 'bg-[#FFAB76] hover:bg-[#E6A070] text-white shadow-md hover:shadow-lg cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
        aria-label="Send message"
      >
        <svg
          className="w-5 h-5 transform -rotate-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  )
}