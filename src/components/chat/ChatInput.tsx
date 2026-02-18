import { useState, useRef, KeyboardEvent } from "react";
import { useChatStore } from "@/store/chatStore";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentSessionId, sendMessage, isLoading } = useChatStore();

  const handleSend = async () => {
    if (!input.trim() || !currentSessionId || isLoading) return;

    const messageToSend = input.trim();

    // Clear input immediately
    setInput("");

    await sendMessage(currentSessionId, messageToSend);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift 換行)
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 150);
    textarea.style.height = newHeight + "px";

    // 只在內容超過最大高度時顯示滾動條
    if (textarea.scrollHeight > 150) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Text Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Type your message..."
          rows={1}
          className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-[#FFAB76]/50 focus:border-[#FFAB76]
                   resize-none text-gray-800 placeholder-gray-400
                   transition-all overflow-y-hidden"
          style={{ minHeight: "48px", maxHeight: "150px" }}
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
        disabled={!input.trim() || isLoading}
        className={`
          flex-shrink-0 w-12 h-12 rounded-full transition-all flex items-center justify-center
          ${
            input.trim() && !isLoading
              ? "bg-[#FFAB76] hover:bg-[#E6A070] text-white shadow-md hover:shadow-lg cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
        aria-label="Send message"
      >
        {isLoading ? (
          // Loading spinner
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          // Send icon
          <svg
            className="w-5 h-5 transform -rotate-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
