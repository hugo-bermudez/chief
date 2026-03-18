"use client";
import "@openuidev/react-ui/components.css";

import { useTheme } from "@/hooks/use-system-theme";
import { shadcnChatLibrary } from "@/lib/shadcn-genui";
import { openAIAdapter, openAIMessageFormat, useThread } from "@openuidev/react-headless";
import { Copilot } from "@openuidev/react-ui";

function OverviewCard({
  title,
  value,
  hint,
  prompt,
  icon,
  onSelect,
}: {
  title: string;
  value: string;
  hint: string;
  prompt: string;
  icon: string;
  onSelect: (prompt: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(prompt)}
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

function FinanceOverview() {
  const processMessage = useThread((s) => s.processMessage);
  const isRunning = useThread((s) => s.isRunning);

  const handleCardSelect = (prompt: string) => {
    if (isRunning) return;
    processMessage({
      role: "user",
      content: prompt,
    });
  };

  return (
    <div className="w-full overflow-y-auto pb-[var(--space-lg)]">
      <p className="px-[var(--space-md)] pb-[var(--space-sm)] text-xs font-medium uppercase tracking-wider text-muted-foreground lg:px-[var(--space-lg)]">
        Finance activity
      </p>
      <div className="mx-auto grid w-full max-w-[var(--layout-max-width)] grid-cols-2 gap-[var(--space-2xs)] px-[var(--space-md)] sm:grid-cols-4 lg:px-[var(--space-lg)]">
        <OverviewCard
          icon="🏦"
          title="Accounts"
          value="12"
          hint="7 active, 5 settlement"
          prompt="Build an accounts overview for this company. Show all operating, settlement, and payroll accounts with balances, currency exposure, and 7-day net flow. Highlight concentration risk and recommend 3 rebalancing actions."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="💳"
          title="Payments"
          value="$1.92M"
          hint="Processed this month"
          prompt="Create a payments health dashboard with success rate, failed payment rate, chargeback rate, processor-level breakdown, and top failure reasons. Prioritize incidents by revenue impact and propose next actions."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="📊"
          title="Transactions"
          value="14,238"
          hint="Last 30 days"
          prompt="Generate a transaction monitoring view for the last 30 days. Show volume trends, average ticket size, anomaly alerts, and suspicious spikes by channel. Add a table of the top 10 high-risk transactions."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="🔒"
          title="Cards"
          value="37"
          hint="31 virtual, 6 physical"
          prompt="Build a corporate cards control panel with active card count, spend by team, policy violations, and expiring cards. Include controls recommendations and a table of cards needing review."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="💰"
          title="Funds"
          value="$2.84M"
          hint="Available financing capacity"
          prompt="You are FinanceOS. Evaluate funding options for a DTC company named Northstar Nutrition with monthly revenue of 450000 USD, requested amount 300000 USD, and term 6 months. Call get_funding_offers. Present an executive view with tags, a comparison table, pricing highlights, eligibility notes, a recommendation card, and follow-up actions."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="⏳"
          title="Runway"
          value="8.6 months"
          hint="At current burn rate"
          prompt="Create a 6-month runway forecast with base, upside, and downside scenarios. Show inflows/outflows, burn trajectory, covenant buffer, and recommended actions if runway drops below 6 months."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="📈"
          title="Benchmark"
          value="72nd pct"
          hint="Above peer median"
          prompt="Run a benchmark review for a US apparel brand with 12000000 USD annual revenue. Call get_company_benchmark. Show percentile standing, variance vs peers, and the top 3 opportunities by expected impact."
          onSelect={handleCardSelect}
        />
        <OverviewCard
          icon="⚡"
          title="Performance"
          value="+8.4%"
          hint="Revenue MoM growth"
          prompt="Generate a monthly performance report. Call get_performance_summary for period 2026-03. Show revenue, gross margin, contribution margin, CAC, LTV, payback period, conversion, and churn with MoM deltas plus RAG status."
          onSelect={handleCardSelect}
        />
      </div>
    </div>
  );
}

export default function Page() {
  const mode = useTheme();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Copilot
        processMessage={async ({ messages, abortController }) => {
          return fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: openAIMessageFormat.toApi(messages),
            }),
            signal: abortController.signal,
          });
        }}
        streamProtocol={openAIAdapter()}
        componentLibrary={shadcnChatLibrary}
        logoUrl="/logo_w.svg"
        agentName="Chief"
        welcomeMessage={FinanceOverview}
        theme={{ mode }}
        conversationStarters={{
          variant: "short",
          options: [
            {
              displayText: "Accounts overview",
              prompt:
                "Build an accounts overview for this company. Show all operating, settlement, and payroll accounts with balances, currency exposure, and 7-day net flow. Highlight concentration risk and recommend 3 rebalancing actions.",
            },
            {
              displayText: "Payments health",
              prompt:
                "Create a payments health dashboard with success rate, failed payment rate, chargeback rate, processor-level breakdown, and top failure reasons. Prioritize incidents by revenue impact and propose next actions.",
            },
            {
              displayText: "Transaction monitor",
              prompt:
                "Generate a transaction monitoring view for the last 30 days. Show volume trends, average ticket size, anomaly alerts, and suspicious spikes by channel. Add a table of the top 10 high-risk transactions.",
            },
            {
              displayText: "Corporate cards",
              prompt:
                "Build a corporate cards control panel with active card count, spend by team, policy violations, and expiring cards. Include controls recommendations and a table of cards needing review.",
            },
            {
              displayText: "Funding options",
              prompt:
                "You are FinanceOS. Evaluate funding options for a DTC company named Northstar Nutrition with monthly revenue of 450000 USD, requested amount 300000 USD, and term 6 months. Call get_funding_offers. Present an executive view with tags, a comparison table, pricing highlights, eligibility notes, a recommendation card, and follow-up actions.",
            },
            {
              displayText: "Runway forecast",
              prompt:
                "Create a 6-month runway forecast with base, upside, and downside scenarios. Show inflows/outflows, burn trajectory, covenant buffer, and recommended actions if runway drops below 6 months.",
            },
            {
              displayText: "Benchmark review",
              prompt:
                "Run a benchmark review for a US apparel brand with 12000000 USD annual revenue. Call get_company_benchmark. Show percentile standing, variance vs peers, and the top 3 opportunities by expected impact.",
            },
            {
              displayText: "Performance pulse",
              prompt:
                "Generate a monthly performance report. Call get_performance_summary for period 2026-03. Show revenue, gross margin, contribution margin, CAC, LTV, payback period, conversion, and churn with MoM deltas plus RAG status.",
            },
          ],
        }}
      />
    </div>
  );
}
