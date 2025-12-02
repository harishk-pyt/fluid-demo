import { z } from "zod";
import "dotenv/config";

async function callLLM(
  messages: Array<{ role: string; content: string }>,
  model = "x-ai/grok-4-fast"
) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({ model, messages })
    }
  );

  return response.json();
}

const WeatherToolSchema = z.object({
  city: z.string()
});

async function getWeather(input: string) {
  const { city } = WeatherToolSchema.parse(input);

  const fakeDB: Record<string, { temp: number; condition: string }> = {
    Chennai: { temp: 32, condition: "Humid" },
    London: { temp: 12, condition: "Cloudy" }
  };

  const result = fakeDB[city] || { temp: 22, condition: "Unknown" };

  console.log("➡️ TOOL CALLED WITH:", input);
  return { city, ...result };
}

async function run() {
  const SYSTEM_PROMPT = `
You are an AI assistant that uses *implicit tool calling*.

Available tool:
{
  "name": "getWeather",
  "input_schema": ${z.toJSONSchema(WeatherToolSchema)},
  "returns": "Weather data for that city"
}

Whenever the user asks for weather, return ONLY a JSON object:
{
  "tool": "getWeather",
  "arguments": { ... }
}
No explanations.
`;

  console.log("📡 Sending first request...");

  const firstJson = await callLLM([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "What's the weather in Chennai?" }
  ]);

  //   console.log(
  //     "📥 FIRST MODEL RESPONSE:",
  //     JSON.stringify(firstJson.choices[0].message, null, 4)
  //   );

  const toolCall = JSON.parse(firstJson.choices[0].message.content);

  // Tool execution
  const toolResult = await getWeather(toolCall.arguments);

  console.log("\n📡 Sending tool result back...");

  const finalJson = await callLLM([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "What's the weather in Chennai?" },
    { role: "assistant", content: JSON.stringify(toolCall) },
    {
      role: "user",
      content: `Weather tool responded with bellow data, use it to format final response:
      ${JSON.stringify(toolResult)}`
    }
  ]);
  //   console.log(
  //     "📥 FINAL MODEL RESPONSE:",
  //     JSON.stringify(finalJson.choices[0].message, null, 4)
  //   );

  console.log("\n🎉 FINAL ANSWER:", finalJson.choices[0].message.content);
}

run();
