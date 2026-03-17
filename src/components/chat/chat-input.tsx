"use client";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onStop: () => void;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div className="border-t border-white/[0.06] bg-[#0A0A0F] px-6 pb-6 pt-4">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="flex-1 rounded-xl border border-white/[0.08] bg-[#111116] px-4 py-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-white placeholder-[#555566] outline-none"
            autoFocus
          />
        </div>
        {isLoading ? (
          <Button
            onClick={onStop}
            size="icon"
            variant="outline"
            aria-label="Stop generating"
            className="size-9 shrink-0 rounded-xl border-white/[0.08] bg-[#111116] text-[#6B6B80] hover:bg-white/[0.06] hover:text-white/70"
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            size="icon"
            disabled={!input.trim()}
            aria-label="Send message"
            className="size-9 shrink-0 rounded-xl bg-gradient-to-br from-[#7B61FF] via-[#E056A0] to-[#D4622B] text-white shadow-none hover:opacity-90 disabled:opacity-30"
          >
            <ArrowUp className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
