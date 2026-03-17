"use client";

import { useRef, useCallback } from "react";
import {
  ArrowUp,
  Plus,
  Zap,
  ChevronDown,
  Mic,
  TrendingUp,
  Landmark,
  BarChart3,
  CreditCard,
} from "lucide-react";

interface HeroInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
}

const SUGGESTIONS = [
  { icon: TrendingUp, label: "Capital overview", query: "Show me my current capital and financing overview" },
  { icon: Landmark, label: "Banking", query: "What is the status of my bank accounts and recent transactions?" },
  { icon: BarChart3, label: "Performance", query: "Show me my key performance metrics and KPIs" },
  { icon: CreditCard, label: "Payments", query: "Give me a summary of recent payments and card activity" },
];

export function HeroInput({ input, setInput, onSubmit }: HeroInputProps) {
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

  const handleSuggestion = useCallback(
    (query: string) => {
      setInput(query);
      setTimeout(() => textareaRef.current?.focus(), 0);
    },
    [setInput]
  );

  const hasInput = input.trim().length > 0;

  return (
    <div className="relative z-10 w-full max-w-[680px] px-4">
      {/* Main input card */}
      <div className="rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]">
        {/* Textarea */}
        <div className="px-5 pt-5 pb-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your finances..."
            rows={2}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#1A1A1A] placeholder-[#BBBBBB] outline-none"
            autoFocus
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3.5 pb-3.5">
          <div className="flex items-center gap-1.5">
            {/* Plus / attach */}
            <button
              type="button"
              className="toolbar-btn flex size-9 items-center justify-center rounded-xl border border-black/[0.06] text-[#999999]"
              aria-label="Attach file"
            >
              <Plus className="size-4" strokeWidth={2} />
            </button>

            {/* Inspiration / mode button */}
            <button type="button" className="toolbar-btn flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.06] px-3 text-[13px] font-medium text-[#999999]">
              <Zap className="size-3.5 text-[#16A34A]" strokeWidth={2} />
              <span className="text-[#555555]">Finance</span>
              <ChevronDown className="size-3 text-[#BBBBBB]" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector */}
            <button type="button" className="flex h-9 items-center gap-1 px-2 text-[13px] font-medium text-[#777777] transition-colors hover:text-[#333333]">
              Chief 1.0
              <ChevronDown className="size-3 text-[#BBBBBB]" />
            </button>

            {/* Mic or cancel */}
            {hasInput ? (
              <button
                type="button"
                onClick={() => setInput("")}
                className="flex size-9 items-center justify-center text-[#BBBBBB] transition-colors hover:text-[#666666]"
                aria-label="Clear input"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            ) : (
              <button
                type="button"
                className="flex size-9 items-center justify-center text-[#BBBBBB] transition-colors hover:text-[#666666]"
                aria-label="Voice input"
              >
                <Mic className="size-4" strokeWidth={2} />
              </button>
            )}

            {/* Send */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!hasInput}
              className="flex size-10 items-center justify-center rounded-xl bg-[#2C2C2C] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#1A1A1A] active:scale-95 disabled:bg-[#E5E5E5] disabled:text-[#BBBBBB] disabled:shadow-none"
              aria-label="Send message"
            >
              <ArrowUp className="size-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion pills */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => handleSuggestion(s.query)}
            className="suggestion-pill flex h-8 items-center gap-2 rounded-full border border-black/[0.06] bg-white/60 px-4 text-xs font-medium text-[#888888]"
          >
            <s.icon className="size-3.5" />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
