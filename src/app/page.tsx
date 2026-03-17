"use client";

import { useChat } from "@/hooks/use-chat";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";

export default function Home() {
  const { messages, input, setInput, isLoading, handleSubmit, stop } =
    useChat();

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center border-b border-border px-6 py-3">
        <h1 className="text-sm font-medium">Chief</h1>
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
