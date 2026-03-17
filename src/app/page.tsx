"use client";

import { useChat } from "@/hooks/use-chat";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { HeroInput } from "@/components/chat/hero-input";
import { MatrixBackground } from "@/components/chat/matrix-background";

export default function Home() {
  const { messages, input, setInput, isLoading, handleSubmit, stop } =
    useChat();

  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    return (
      <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden">
        <MatrixBackground />

        {/* Branding */}
        <div className="relative z-10 mb-12 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-white">
            Chief
          </h1>
          <p className="mt-2 text-sm text-[#6B6B80]">
            The finance operating system
          </p>
        </div>

        <HeroInput input={input} setInput={setInput} onSubmit={handleSubmit} />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center border-b border-white/[0.06] px-6 py-3">
        <h1 className="text-sm font-medium text-white/80">Chief</h1>
        <span className="ml-2 text-xs text-[#6B6B80]">Finance OS</span>
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
