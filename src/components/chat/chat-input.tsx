"use client";

import { useRef, useCallback } from "react";
import { ArrowUp, Square, Plus, Zap, ChevronDown } from "lucide-react";

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

  const hasInput = input.trim().length > 0;

  return (
    <div className="bg-[#EBEBEB] px-6 pb-6 pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="glow-border">
        <div className="relative rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]">
          {/* Textarea */}
          <div className="px-5 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#1A1A1A] placeholder-[#BBBBBB] outline-none"
              autoFocus
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-3.5 pb-3.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="toolbar-btn flex size-8 items-center justify-center rounded-lg border border-black/[0.06] text-[#999999]"
                aria-label="Attach file"
              >
                <Plus className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="toolbar-btn flex h-8 items-center gap-1.5 rounded-lg border border-black/[0.06] px-2.5 text-[13px] font-medium text-[#999999]"
              >
                <Zap className="size-3.5 text-[#16A34A]" strokeWidth={2} />
                <span className="text-[#555555]">Finance</span>
                <ChevronDown className="size-3 text-[#BBBBBB]" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="flex size-9 items-center justify-center rounded-xl border border-black/[0.06] text-[#999999] transition-colors hover:bg-black/[0.04] hover:text-[#333333]"
                  aria-label="Stop generating"
                >
                  <Square className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!hasInput}
                  className="flex size-9 items-center justify-center rounded-xl bg-[#2C2C2C] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#1A1A1A] active:scale-95 disabled:bg-[#E5E5E5] disabled:text-[#BBBBBB] disabled:shadow-none"
                  aria-label="Send message"
                >
                  <ArrowUp className="size-[18px]" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
