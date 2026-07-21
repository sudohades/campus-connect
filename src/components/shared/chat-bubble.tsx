import type { ChatMessage } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  return (
    <div className={cn("flex flex-col animate-fade-in", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isOwn
            ? "rounded-br-md bg-gradient-to-br from-crimson to-crimson-hover text-white shadow-soft"
            : "rounded-bl-md bg-surface-elevated text-neutral-200 border border-neutral-700/50",
        )}
      >
        {message.text}
      </div>
      <span className="mt-1.5 text-[10px] text-neutral-600 px-1">
        {formatDateTime(message.createdAt)}
      </span>
    </div>
  );
}
