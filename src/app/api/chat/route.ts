import { readFileSync } from "fs";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { join } from "path";

const systemPrompt = readFileSync(join(process.cwd(), "src/generated/system-prompt.txt"), "utf-8");
const financeDirective = [
  "You are FinanceOS Copilot, a finance operations assistant for growth companies.",
  "Primary jobs: funding, treasury/banking, benchmarking, and performance management.",
  "Prefer concise executive outputs with decision-ready recommendations.",
  "When relevant, call tools to ground responses in data before rendering UI.",
].join(" ");

const conversationLog: Array<{ role: string; content: string }> = [];

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractText(msg: any): string {
  const content = msg?.content;
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed?.parts)
        return parsed.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
    } catch {
      /* plain string */
    }
    return content;
  }
  if (Array.isArray(content))
    return content
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  if (Array.isArray(msg?.parts))
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  if (typeof msg?.text === "string") return msg.text;
  return JSON.stringify(msg);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Tool implementations ──

function getFundingOffers({
  company,
  monthly_revenue,
  requested_amount,
  term_months,
}: {
  company: string;
  monthly_revenue: number;
  requested_amount: number;
  term_months: number;
}): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const offers = [
        {
          provider: "Wayflyer Flex",
          product: "Revenue-based advance",
          approved_amount: Math.min(requested_amount, Math.round(monthly_revenue * 1.2)),
          fee_percent: 6.8,
          remittance_rate_percent: 12,
          term_months,
          speed_days: 2,
        },
        {
          provider: "NorthBank Capital",
          product: "Working capital line",
          approved_amount: Math.min(requested_amount, Math.round(monthly_revenue * 1.5)),
          fee_percent: 8.1,
          remittance_rate_percent: 9,
          term_months: term_months + 2,
          speed_days: 5,
        },
        {
          provider: "Summit Credit",
          product: "Fixed-term loan",
          approved_amount: Math.min(requested_amount, Math.round(monthly_revenue)),
          fee_percent: 7.4,
          remittance_rate_percent: 0,
          term_months: Math.max(6, term_months),
          speed_days: 4,
        },
      ];

      const recommendation = [...offers].sort((a, b) => a.fee_percent - b.fee_percent)[0];
      resolve(
        JSON.stringify({
          company,
          monthly_revenue,
          requested_amount,
          term_months,
          offers,
          recommendation,
        }),
      );
    }, 800);
  });
}

function getBankSnapshot({ entity }: { entity: string }): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accounts = [
        { bank: "Mercury", account: "Operating", currency: "USD", balance: 1284500 },
        { bank: "JP Morgan", account: "Payroll", currency: "USD", balance: 382000 },
        { bank: "Wise", account: "EMEA Settlement", currency: "EUR", balance: 219000 },
      ];
      const upcoming_outflows = [
        { label: "Supplier settlement", due_in_days: 3, amount: 265000 },
        { label: "Payroll", due_in_days: 6, amount: 410000 },
        { label: "Ad platforms", due_in_days: 9, amount: 320000 },
      ];

      const totalBalance = accounts.reduce((sum, row) => sum + row.balance, 0);
      const weeklyBurn = 345000;
      resolve(
        JSON.stringify({
          entity,
          accounts,
          total_balance: totalBalance,
          weekly_burn: weeklyBurn,
          runway_days: Math.round((totalBalance / weeklyBurn) * 7),
          upcoming_outflows,
          failed_payout_risk: "medium",
        }),
      );
    }, 600);
  });
}

function getCompanyBenchmark({
  industry,
  region,
  annual_revenue,
}: {
  industry: string;
  region: string;
  annual_revenue: number;
}): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        JSON.stringify({
          industry,
          region,
          annual_revenue,
          percentile: 72,
          metrics: [
            { name: "Gross margin", company: 54, peer_p50: 49, peer_p75: 56, unit: "%" },
            { name: "CAC payback", company: 7.1, peer_p50: 8.5, peer_p75: 6.7, unit: "months" },
            { name: "Inventory turnover", company: 5.2, peer_p50: 4.3, peer_p75: 5.7, unit: "x" },
            { name: "Contribution margin", company: 18, peer_p50: 14, peer_p75: 20, unit: "%" },
          ],
          opportunities: [
            "Improve checkout conversion with one-page checkout experiments",
            "Reduce paid social CAC by shifting spend to top-performing creatives",
            "Renegotiate 3PL contract to improve fulfillment margin",
          ],
        }),
      );
    }, 700);
  });
}

function getPerformanceSummary({ period }: { period: string }): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        JSON.stringify({
          period,
          kpis: [
            { name: "Revenue", value: 1840000, mom_delta_percent: 8.4, status: "green" },
            { name: "Gross margin", value: 53.6, mom_delta_percent: 1.1, status: "green" },
            { name: "Contribution margin", value: 17.9, mom_delta_percent: -0.6, status: "amber" },
            { name: "CAC", value: 68, mom_delta_percent: 4.8, status: "red" },
            { name: "LTV", value: 412, mom_delta_percent: 2.3, status: "green" },
            { name: "Payback period", value: 6.4, mom_delta_percent: -0.3, status: "green" },
            { name: "Conversion rate", value: 3.2, mom_delta_percent: 0.2, status: "green" },
            { name: "Churn", value: 2.1, mom_delta_percent: 0.4, status: "amber" },
          ],
          narrative:
            "Topline growth is strong, but rising acquisition cost is pressuring contribution margin.",
        }),
      );
    }, 500);
  });
}

function calculate({ expression }: { expression: string }): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const sanitized = expression.replace(
          /[^0-9+\-*/().%\s,Math.sqrtpowabsceilfloorround]/g,
          "",
        );
        const result = new Function(`return (${sanitized})`)();
        resolve(JSON.stringify({ expression, result: Number(result) }));
      } catch {
        resolve(JSON.stringify({ expression, error: "Invalid expression" }));
      }
    }, 300);
  });
}

function searchFinanceNews({ query }: { query: string }): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        JSON.stringify({
          query,
          results: [
            {
              title: `Market note: ${query}`,
              snippet: `Macro and sector context relevant to ${query}.`,
            },
            {
              title: `${query} funding trend`,
              snippet: `Recent financing signals and lender appetite by segment.`,
            },
            {
              title: `${query} benchmark snapshot`,
              snippet: `Peer performance highlights and valuation sentiment.`,
            },
          ],
        }),
      );
    }, 1000);
  });
}

// ── Tool definitions ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tools: any[] = [
  {
    type: "function",
    function: {
      name: "get_funding_offers",
      description: "Return mock funding offers for a company.",
      parameters: {
        type: "object",
        properties: {
          company: { type: "string", description: "Company name" },
          monthly_revenue: { type: "number", description: "Monthly revenue in USD" },
          requested_amount: { type: "number", description: "Requested funding amount in USD" },
          term_months: { type: "number", description: "Desired repayment term in months" },
        },
        required: ["company", "monthly_revenue", "requested_amount", "term_months"],
      },
      function: getFundingOffers,
      parse: JSON.parse,
    },
  },
  {
    type: "function",
    function: {
      name: "get_bank_snapshot",
      description: "Return treasury and bank account snapshot for an entity.",
      parameters: {
        type: "object",
        properties: { entity: { type: "string", description: "Company or business unit name" } },
        required: ["entity"],
      },
      function: getBankSnapshot,
      parse: JSON.parse,
    },
  },
  {
    type: "function",
    function: {
      name: "get_company_benchmark",
      description: "Return benchmark and percentile data for a company profile.",
      parameters: {
        type: "object",
        properties: {
          industry: { type: "string", description: "Industry vertical" },
          region: { type: "string", description: "Region or market" },
          annual_revenue: { type: "number", description: "Annual revenue in USD" },
        },
        required: ["industry", "region", "annual_revenue"],
      },
      function: getCompanyBenchmark,
      parse: JSON.parse,
    },
  },
  {
    type: "function",
    function: {
      name: "get_performance_summary",
      description: "Return KPI summary for a given reporting period.",
      parameters: {
        type: "object",
        properties: { period: { type: "string", description: "Reporting period, e.g. 2026-03" } },
        required: ["period"],
      },
      function: getPerformanceSummary,
      parse: JSON.parse,
    },
  },
  {
    type: "function",
    function: {
      name: "calculate",
      description: "Evaluate a math expression.",
      parameters: {
        type: "object",
        properties: { expression: { type: "string", description: "Math expression to evaluate" } },
        required: ["expression"],
      },
      function: calculate,
      parse: JSON.parse,
    },
  },
  {
    type: "function",
    function: {
      name: "search_finance_news",
      description: "Return mock finance news results for a query.",
      parameters: {
        type: "object",
        properties: { query: { type: "string", description: "Finance query to search" } },
        required: ["query"],
      },
      function: searchFinanceNews,
      parse: JSON.parse,
    },
  },
];

// ── SSE helpers ──

function sseToolCallStart(
  encoder: TextEncoder,
  tc: { id: string; function: { name: string } },
  index: number,
) {
  return encoder.encode(
    `data: ${JSON.stringify({
      id: `chatcmpl-tc-${tc.id}`,
      object: "chat.completion.chunk",
      choices: [
        {
          index: 0,
          delta: {
            tool_calls: [
              {
                index,
                id: tc.id,
                type: "function",
                function: { name: tc.function.name, arguments: "" },
              },
            ],
          },
          finish_reason: null,
        },
      ],
    })}\n\n`,
  );
}

function sseToolCallArgs(
  encoder: TextEncoder,
  tc: { id: string; function: { arguments: string } },
  result: string,
  index: number,
) {
  let enrichedArgs: string;
  try {
    enrichedArgs = JSON.stringify({
      _request: JSON.parse(tc.function.arguments),
      _response: JSON.parse(result),
    });
  } catch {
    enrichedArgs = tc.function.arguments;
  }
  return encoder.encode(
    `data: ${JSON.stringify({
      id: `chatcmpl-tc-${tc.id}-args`,
      object: "chat.completion.chunk",
      choices: [
        {
          index: 0,
          delta: { tool_calls: [{ index, function: { arguments: enrichedArgs } }] },
          finish_reason: null,
        },
      ],
    })}\n\n`,
  );
}

// ── Route handler ──

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastUserMsg = (messages as any[]).filter((m: any) => m.role === "user").pop();
  if (lastUserMsg) conversationLog.push({ role: "user", content: extractText(lastUserMsg) });

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const MODEL = "gpt-5.4";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanMessages = (messages as any[])
    .filter((m) => m.role !== "tool")
    .map((m) => {
      if (m.role === "assistant" && m.tool_calls?.length) {
        // Strip tool_calls (runTools re-runs the agentic loop server-side)
        // but preserve content so prior replies remain in context.
        const { tool_calls: _tc, ...rest } = m; // eslint-disable-line @typescript-eslint/no-unused-vars
        return rest;
      }
      return m;
    });

  const chatMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: `${financeDirective}\n\n${systemPrompt}` },
    ...cleanMessages,
  ];

  const encoder = new TextEncoder();
  let controllerClosed = false;

  const readable = new ReadableStream({
    start(controller) {
      const enqueue = (data: Uint8Array) => {
        if (controllerClosed) return;
        try {
          controller.enqueue(data);
        } catch {
          /* already closed */
        }
      };
      const close = () => {
        if (controllerClosed) return;
        controllerClosed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      let fullResponse = "";
      const pendingCalls: Array<{ id: string; name: string; arguments: string }> = [];
      let callIdx = 0;
      let resultIdx = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const runner = (client.chat.completions as any).runTools({
        model: MODEL,
        messages: chatMessages,
        tools,
        stream: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runner.on("functionToolCall", (fc: any) => {
        const id = `tc-${callIdx}`;
        pendingCalls.push({ id, name: fc.name, arguments: fc.arguments });
        enqueue(sseToolCallStart(encoder, { id, function: { name: fc.name } }, callIdx));
        callIdx++;
      });

      runner.on("functionToolCallResult", (result: string) => {
        const tc = pendingCalls[resultIdx];
        if (tc) {
          enqueue(
            sseToolCallArgs(
              encoder,
              { id: tc.id, function: { arguments: tc.arguments } },
              result,
              resultIdx,
            ),
          );
        }
        resultIdx++;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runner.on("chunk", (chunk: any) => {
        const choice = chunk.choices?.[0];
        const delta = choice?.delta;
        if (!delta) return;
        if (delta.content) {
          fullResponse += delta.content;
          enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
        if (choice?.finish_reason === "stop") {
          enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
      });

      runner.on("end", () => {
        conversationLog.push({ role: "assistant", content: fullResponse });
        console.info(
          "[OpenUI Lang] Conversation:\n",
          JSON.stringify(
            conversationLog.map((m) => ({ ...m, content: m.content.replace(/\n/g, " ") })),
            null,
            2,
          ),
        );
        enqueue(encoder.encode("data: [DONE]\n\n"));
        close();
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runner.on("error", (err: any) => {
        const msg = err instanceof Error ? err.message : "Stream error";
        console.error("Chat route error:", msg);
        enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        close();
      });
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
