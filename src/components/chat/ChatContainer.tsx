import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { EmptyState } from "./EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

export function ChatContainer() {
  const { sessions, currentSessionId, clearSession, updateSessionTitle } =
    useChatStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // 找到當前選中的 session
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // 沒有選中任何 session
  if (!currentSessionId || !currentSession) {
    return <EmptyState />;
  }

  // 開始編輯標題
  const handleStartEdit = () => {
    setEditedTitle(currentSession.title);
    setIsEditingTitle(true);
  };

  // 儲存標題
  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateSessionTitle(currentSession.id, editedTitle);
    }
    setIsEditingTitle(false);
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle("");
  };

  // Enter 儲存，Esc 取消
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header: Session Title */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-[#E6A070]/20 bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              // 編輯模式
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveTitle}
                  autoFocus
                  className="flex-1 text-lg font-semibold text-gray-800 px-2 py-1 
                           border-2 border-[#FFAB76] rounded-lg focus:outline-none"
                  placeholder="Enter chat title..."
                />
              </div>
            ) : (
              // 顯示模式
              <div>
                <h2
                  onClick={handleStartEdit}
                  className="text-lg font-semibold text-gray-800 truncate cursor-pointer 
                           hover:text-[#E6A070] transition-colors group inline-flex items-center gap-2"
                  title="Click to edit title"
                >
                  {currentSession.title}
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentSession.messages.length} messages
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Messages Button - 只在有訊息時顯示 */}
      {currentSession.messages.length > 0 && (
        <button
          onClick={() => {
            if (
              confirm("Clear all messages in this chat? This cannot be undone.")
            ) {
              clearSession(currentSession.id);
            }
          }}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg
                       text-sm text-gray-600 hover:text-[#E6A070] 
                       hover:bg-[#FDF2E9] transition-colors"
          aria-label="Clear messages"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden sm:inline">Clear</span>
        </button>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {currentSession.messages.length === 0 ? (
          <EmptyState showTitle={false} />
        ) : (
          <div className="p-4 md:p-6">
            <MessageList messages={currentSession.messages} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 md:p-6 bg-[#FDF2E9] border-t border-[#E6A070]/20">
        <ChatInput />
      </div>
    </div>
  );
}
