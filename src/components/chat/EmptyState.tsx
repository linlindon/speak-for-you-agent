interface EmptyStateProps {
  showTitle?: boolean;
}

export function EmptyState({ showTitle = true }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FFAB76]/10 mb-6">
          <svg
            className="w-10 h-10 text-[#FFAB76]"
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

        {/* Title */}
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Speak for you - AI Agent
          </h2>
        )}

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {showTitle
            ? "Your intelligent conversation partner. Start a new chat to begin."
            : "No messages yet. Start the conversation!"}
        </p>

        {/* Suggestions */}
        <div className="space-y-2 text-left">
          <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
          <div className="space-y-2">
            {[
              "What can you help me with?",
              "Tell me about yourself",
              "How does this work?",
            ].map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 rounded-lg bg-white hover:bg-[#FDF2E9] 
                         text-gray-700 text-sm transition-colors border border-gray-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
