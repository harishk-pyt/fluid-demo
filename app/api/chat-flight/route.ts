import { openrouter } from "@/lib";
import {
  bookFlightSchema,
  findFlights,
  getFlightsSchema,
  holdFlight
} from "@/lib/tools";
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: openrouter("x-ai/grok-4-fast"),
    system:
      "You are a cheerful flight-booking assistant. Use the tools provided to fetch routes or confirm holds.",
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    tools: {
      get_available_flights: {
        description: "Return mock flights for a given route and date.",
        inputSchema: getFlightsSchema,
        async execute(params) {
          const matches = findFlights(params);
          return {
            flights: matches,
            totalMatches: matches.length,
            query: params
          };
        }
      },
      book_flight: {
        description: "Place a simple hold on a selected flight.",
        inputSchema: bookFlightSchema,
        async execute(input) {
          return holdFlight(input);
        }
      }
    }
  });
  return result.toUIMessageStreamResponse();
}
