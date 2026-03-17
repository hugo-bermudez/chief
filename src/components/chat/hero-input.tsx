"use client";

import { useRef, useCallback } from "react";
import { ArrowUp, Plus, TrendingUp, Landmark, BarChart3, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      // Focus then submit on next tick so the input updates
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    },
    [setInput]
  );

  return (
    <div className="relative z-10 w-full max-w-[720px] px-4">
      {/* Glowing input container */}
      <div className="glow-border">
        <div className="relative flex flex-col rounded-2xl bg-[#111116] ring-1 ring-white/[0.06]">
          {/* Text input area */}
          <div className="px-5 pt-5 pb-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={2}
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-white placeholder-[#555566] outline-none"
              autoFocus
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#6B6B80] transition-colors hover:bg-white/[0.06] hover:text-white/70"
                aria-label="Attach file"
              >
                <Plus className="size-4" />
              </button>
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-[#6B6B80] transition-colors hover:bg-white/[0.06] hover:text-white/70">
                <TrendingUp className="size-3.5" />
                Finance
              </button>
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-[#6B6B80] transition-colors hover:bg-white/[0.06] hover:text-white/70">
                <BarChart3 className="size-3.5" />
                Analytics
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                onClick={onSubmit}
                disabled={!input.trim()}
                size="icon"
                className="size-8 rounded-full bg-gradient-to-br from-[#7B61FF] via-[#E056A0] to-[#D4622B] text-white shadow-none hover:opacity-90 disabled:opacity-30"
                aria-label="Send message"
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion pills */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => handleSuggestion(s.query)}
            className="suggestion-pill flex h-8 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 text-xs font-medium text-[#6B6B80]"
          >
            <s.icon className="size-3.5" />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
