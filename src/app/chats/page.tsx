"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import type { Chat } from "@/types";
import { getChatsForUser, sendMessage } from "@/lib/api";
import { findUserById } from "@/data/users";
import { useSession } from "@/lib/session-context";
import { ChatBubble } from "@/components/shared/chat-bubble";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, initials } from "@/lib/utils";

export default function ChatsPage() {
  const { user } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  async function refresh() {
    if (!user) return;
    const res = await getChatsForUser(user.id);
    setChats(res);
    if (!activeId && res.length > 0) setActiveId(res[0].id);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const activeChat = chats.find((c) => c.id === activeId);

  async function handleSend() {
    if (!user || !activeChat || !draft.trim()) return;
    await sendMessage(activeChat.id, user.id, draft.trim());
    setDraft("");
    refresh();
  }

  function selectChat(id: string) {
    setActiveId(id);
    setMobileShowChat(true);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState icon={MessageSquare} title="Log in to view messages" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Message a seller or provider from a listing to start chatting."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl gap-4 px-4 py-8">
      <div className={cn(
        "w-full shrink-0 overflow-y-auto rounded-xl border border-neutral-800 bg-surface-raised shadow-soft md:w-72",
        mobileShowChat && "hidden md:block",
      )}>
        {chats.map((chat) => {
          const otherId = chat.participantIds.find((p) => p !== user.id);
          const other = otherId ? findUserById(otherId) : undefined;
          const last = chat.messages[chat.messages.length - 1];
          return (
            <button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-neutral-800 px-3.5 py-3.5 text-left transition-all duration-150 hover:bg-surface-elevated",
                activeId === chat.id && "bg-surface-elevated border-l-2 border-l-crimson",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-crimson to-crimson-hover text-xs font-medium text-white shadow-soft">
                {other ? initials(other.name) : "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-100">
                  {other?.name ?? "Unknown"}
                </p>
                <p className="truncate text-xs text-neutral-500 mt-0.5">{last?.text ?? "No messages yet"}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className={cn(
        "flex flex-1 flex-col rounded-xl border border-neutral-800 bg-surface-raised shadow-soft overflow-hidden",
        !mobileShowChat && "hidden md:flex",
      )}>
        {activeChat ? (
          <>
            <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-3 md:hidden">
              <button
                onClick={() => setMobileShowChat(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-default hover:bg-surface-elevated"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-neutral-100">
                {(() => {
                  const otherId = activeChat.participantIds.find((p) => p !== user.id);
                  const other = otherId ? findUserById(otherId) : undefined;
                  return other?.name ?? "Unknown";
                })()}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {activeChat.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === user.id} />
              ))}
              {activeChat.messages.length === 0 && (
                <p className="text-center text-xs text-neutral-600 py-8">
                  Say hello to start the conversation.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-neutral-800 p-3 bg-surface-overlay/50">
              <label htmlFor="chat-input" className="sr-only">
                Type a message
              </label>
              <input
                id="chat-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="input-field flex-1 !rounded-xl !bg-surface"
              />
              <button
                onClick={handleSend}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-crimson to-crimson-hover text-white shadow-soft transition-all duration-150 hover:shadow-medium active:scale-95"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-neutral-600">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
