"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/use-chat";

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Typing">
      <span className="size-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:0ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:150ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:300ms]" />
    </span>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isEmpty = !message.content;

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-240",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-[#5486FA] to-[#3B6BF5] text-white"
            : "rounded-bl-sm border border-white/[0.06] bg-[#141419] text-[#C7C7CC]"
        )}
      >
        {isEmpty ? (
          <TypingIndicator />
        ) : (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        )}
      </div>
    </div>
  );
}
