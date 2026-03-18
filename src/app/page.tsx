"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useRef, useEffect } from "react";

const AGENT_ID = "agent_5301km0m98vzfxfad5csrxpsv6tv";

interface Message {
  role: "user" | "agent";
  text: string;
}

function OverviewCard({
  title,
  value,
  hint,
  icon,
  onClick,
}: {
  title: string;
  value: string;
  hint: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-border bg-card p-[var(--space-sm)] text-left transition-all duration-200 hover:bg-accent hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-center gap-[var(--space-2xs)]">
        <span className="text-sm opacity-60">{icon}</span>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
      <p className="mt-[var(--space-xs)] text-xl font-semibold text-card-foreground">{value}</p>
      <p className="mt-[var(--space-3xs)] text-xs text-muted-foreground">{hint}</p>
    </button>
  );
}

function VoiceOrb({
  status,
  isSpeaking,
  onClick,
}: {
  status: string;
  isSpeaking: boolean;
  onClick: () => void;
}) {
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isConnecting}
      className="relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 focus:outline-none"
    >
      {/* Outer glow ring */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isConnected && isSpeaking
            ? "animate-pulse bg-[oklch(0.55_0.15_264_/_0.15)] shadow-[0_0_40px_oklch(0.55_0.18_264_/_0.2)]"
            : isConnected
              ? "bg-[oklch(0.55_0.15_264_/_0.08)] shadow-[0_0_24px_oklch(0.55_0.15_264_/_0.1)]"
              : "bg-muted"
        }`}
      />
      {/* Inner orb */}
      <span
        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
          isConnected
            ? "border-[oklch(0.55_0.15_264_/_0.3)] bg-[oklch(0.55_0.15_264_/_0.1)]"
            : "border-border bg-card"
        }`}
      >
        {isConnecting ? (
          <svg className="h-6 w-6 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : isConnected ? (
          <svg className="h-6 w-6 text-[oklch(0.55_0.15_264)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => console.log("ElevenLabs connected"),
    onDisconnect: () => console.log("ElevenLabs disconnected"),
    onMessage: (message) => {
      if (message.source === "ai") {
        setMessages((prev) => [...prev, { role: "agent", text: message.message }]);
      } else if (message.source === "user") {
        setMessages((prev) => [...prev, { role: "user", text: message.message }]);
      }
    },
    onError: (error) => console.error("ElevenLabs error:", error),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const toggleConversation = useCallback(async () => {
    if (conversation.status === "connected") {
      await conversation.endSession();
    } else {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
      });
    }
  }, [conversation]);

  const sendText = useCallback(() => {
    if (!textInput.trim() || conversation.status !== "connected") return;
    conversation.sendUserMessage(textInput.trim());
    setTextInput("");
  }, [textInput, conversation]);

  const sendCardPrompt = useCallback(
    async (prompt: string) => {
      if (conversation.status !== "connected") {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({ agentId: AGENT_ID, connectionType: "webrtc" });
        // Small delay to ensure connection before sending
        setTimeout(() => {
          conversation.sendUserMessage(prompt);
        }, 1000);
      } else {
        conversation.sendUserMessage(prompt);
      }
    },
    [conversation],
  );

  const isConnected = conversation.status === "connected";

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center gap-[var(--space-2xs)] px-[var(--space-md)] py-[var(--space-sm)]">
        <img src="/logo_w.svg" alt="Chief" className="h-8 w-8 rounded-lg" />
        <span className="text-sm font-medium text-foreground">Chief</span>
        <span className="text-xs text-muted-foreground">Finance OS</span>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center overflow-hidden">
        {/* Messages area */}
        {messages.length > 0 ? (
          <div ref={scrollRef} className="w-full flex-1 overflow-y-auto px-[var(--space-md)] lg:px-[var(--space-lg)]">
            <div className="mx-auto max-w-2xl space-y-[var(--space-sm)] py-[var(--space-md)]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-[var(--space-sm)] py-[var(--space-xs)] text-sm ${
                      msg.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-card border border-border text-card-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isConnected && conversation.isSpeaking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-[var(--space-sm)] py-[var(--space-xs)] text-sm text-muted-foreground">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.15_264)]" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.15_264)] [animation-delay:150ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.15_264)] [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty state: centered voice orb */
          <div className="flex flex-1 flex-col items-center justify-center gap-[var(--space-md)]">
            <VoiceOrb
              status={conversation.status}
              isSpeaking={conversation.isSpeaking}
              onClick={toggleConversation}
            />
            <p className="text-sm text-muted-foreground">
              {isConnected
                ? conversation.isSpeaking
                  ? "Chief is speaking..."
                  : "Listening..."
                : "Tap to start a conversation"}
            </p>
          </div>
        )}

        {/* Bottom section: input + cards */}
        <div className="w-full shrink-0">
          {/* Text input with glow */}
          <div className="mx-auto w-full max-w-2xl px-[var(--space-md)] pb-[var(--space-xs)]">
            <div className="chief-input-glow flex items-center gap-[var(--space-2xs)] rounded-xl border border-border bg-card p-[var(--space-xs)]">
              {/* Voice orb (small, inline when messages exist) */}
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={toggleConversation}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all ${
                    isConnected
                      ? "bg-[oklch(0.55_0.15_264_/_0.1)] text-[oklch(0.55_0.15_264)]"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {isConnected ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  )}
                </button>
              )}
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder={isConnected ? "Type a message..." : "Connect voice to start..."}
                disabled={!isConnected}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="button"
                onClick={sendText}
                disabled={!textInput.trim() || !isConnected}
                title="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity disabled:opacity-30"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Finance activity cards */}
          <div className="w-full pb-[var(--space-md)]">
            <p className="px-[var(--space-md)] pb-[var(--space-xs)] text-xs font-medium uppercase tracking-wider text-muted-foreground lg:px-[var(--space-lg)]">
              Finance activity
            </p>
            <div className="mx-auto grid w-full max-w-[var(--layout-max-width)] grid-cols-2 gap-[var(--space-2xs)] px-[var(--space-md)] sm:grid-cols-4 lg:px-[var(--space-lg)]">
              <OverviewCard icon="🏦" title="Accounts" value="12" hint="7 active, 5 settlement" onClick={() => sendCardPrompt("Give me an overview of my bank accounts, balances, and recent activity.")} />
              <OverviewCard icon="💳" title="Payments" value="$1.92M" hint="Processed this month" onClick={() => sendCardPrompt("How are my payments performing this month? Any failed payments or issues?")} />
              <OverviewCard icon="📊" title="Transactions" value="14,238" hint="Last 30 days" onClick={() => sendCardPrompt("Summarize my transaction activity over the last 30 days. Any anomalies?")} />
              <OverviewCard icon="🔒" title="Cards" value="37" hint="31 virtual, 6 physical" onClick={() => sendCardPrompt("Review my corporate cards. Any policy violations or cards needing attention?")} />
              <OverviewCard icon="💰" title="Funds" value="$2.84M" hint="Available financing" onClick={() => sendCardPrompt("What financing options are available to me right now?")} />
              <OverviewCard icon="⏳" title="Runway" value="8.6 months" hint="At current burn rate" onClick={() => sendCardPrompt("What does my runway forecast look like for the next 6 months?")} />
              <OverviewCard icon="📈" title="Benchmark" value="72nd pct" hint="Above peer median" onClick={() => sendCardPrompt("How do I compare against my industry peers? Where can I improve?")} />
              <OverviewCard icon="⚡" title="Performance" value="+8.4%" hint="Revenue MoM growth" onClick={() => sendCardPrompt("Give me a performance summary for this month with key metrics.")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
