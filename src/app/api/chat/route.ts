import { NextRequest } from "next/server";
import OpenAI from "openai";

function getClient() {
  return new OpenAI();
}

const SYSTEM_PROMPT = `You are Chief, a helpful AI assistant. You are concise, clear and friendly. You provide accurate information and help users accomplish their goals efficiently.`;

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
