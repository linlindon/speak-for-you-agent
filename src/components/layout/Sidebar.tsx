import { useChatStore } from "@/store/chatStore";

interface SidebarProps {
  onClose?: () => void; // Mobile 點擊後關閉 sidebar 的 callback
}

export function Sidebar({ onClose }: SidebarProps) {
  const {
    sessions,
    currentSessionId,
    createSession,
    selectSession,
    deleteSession,
  } = useChatStore();

  const handleSelectSession = (id: string) => {
    selectSession(id);
    onClose?.();
  };

  const handleCreateSession = () => {
    const result = createSession();
    // 如果返回 null，表示已有空對話，切換過去並提示
    if (result === null) {
      alert("You already have an empty chat. Start typing there!");
    }
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-[#E6A070]">
      {/* Header: Logo & Title */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          {/* Logo */}
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Speak for you</h1>
            <p className="text-white/70 text-xs">AI Agent</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleCreateSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
                   bg-white/20 hover:bg-white/30 text-white rounded-xl
                   transition-colors font-medium backdrop-blur-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-4">
        {sessions.length === 0 ? (
          <div className="text-center text-white/50 text-sm mt-8">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group relative flex items-center gap-3 px-3 py-3 rounded-xl
                  cursor-pointer transition-all
                  ${
                    currentSessionId === session.id
                      ? "bg-white/25 text-white shadow-sm"
                      : "hover:bg-white/15 text-white/90"
                  }
                `}
                onClick={() => handleSelectSession(session.id)}
              >
                {/* Chat Icon */}
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>

                {/* Title */}
                <span className="flex-1 truncate text-sm font-medium">
                  {session.title}
                </span>

                {/* Arrow Icon */}
                <svg
                  className="w-4 h-4 flex-shrink-0 opacity-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>

                {/* Delete Button - hidden on mobile for better UX */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete this conversation?")) {
                      deleteSession(session.id);
                    }
                  }}
                  className="hidden md:block absolute right-2 opacity-0 group-hover:opacity-100 
                           p-1.5 rounded-lg hover:bg-white/20 transition-all"
                  aria-label="Delete session"
                >
                  <svg
                    className="w-4 h-4 text-white"
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
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
