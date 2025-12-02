import { openrouter } from "@/lib/model";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter("x-ai/grok-4-fast"),
    messages: convertToModelMessages(messages)
  });

  return result.toUIMessageStreamResponse();
}
