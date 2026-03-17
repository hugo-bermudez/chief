import { NextRequest } from "next/server";
import OpenAI from "openai";

function getClient() {
  return new OpenAI();
}

const SYSTEM_PROMPT = `You are Chief, the AI-powered finance operating system. You help users understand and manage their financial operations across:

- **Capital & Financing**: Funding status, capital deployment, financing trends, available credit, repayment schedules
- **Banking**: Account balances, payments, cards, transactions, statements, cashflow
- **Performance & Benchmarks**: KPIs, revenue metrics, growth trends, industry benchmarks, operational efficiency

You are concise, data-driven and trustworthy. Use clear language appropriate for finance professionals. When presenting numbers, use proper formatting with currency symbols and percentage signs. Be direct — lead with the answer, then provide context. If you don't have specific data, explain what data would be needed and how the user could connect it.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await getClient().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    });

    return new Response(response.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
