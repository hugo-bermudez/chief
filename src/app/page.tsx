"use client";

import { useChat } from "@/hooks/use-chat";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { HeroInput } from "@/components/chat/hero-input";

export default function Home() {
  const { messages, input, setInput, isLoading, handleSubmit, stop } =
    useChat();

  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center">
        {/* Branding */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1A1A1A]">
            Chief
          </h1>
          <p className="mt-1.5 text-sm text-[#999999]">
            The finance operating system
          </p>
        </div>

        <HeroInput input={input} setInput={setInput} onSubmit={handleSubmit} />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center border-b border-black/[0.06] bg-white/60 px-6 py-3 backdrop-blur-sm">
        <h1 className="text-sm font-semibold text-[#1A1A1A]">Chief</h1>
        <span className="ml-2 text-xs text-[#999999]">Finance OS</span>
      </header>

      <MessageList messages={messages} />

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  );
}
