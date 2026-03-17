"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/use-chat";

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Typing">
      <span className="size-1.5 animate-bounce rounded-full bg-black/15 [animation-delay:0ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-black/15 [animation-delay:150ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-black/15 [animation-delay:300ms]" />
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
          "max-w-[80%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
          isUser
            ? "rounded-br-md bg-[#2C2C2C] text-white"
            : "rounded-bl-md bg-white text-[#333333] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
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
