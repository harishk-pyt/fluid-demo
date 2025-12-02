"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { openrouter } from "./model";

const TransactionSchema = z.object({
  amount: z
    .string()
    .nullable()
    .describe("Transaction amount as numeric string, no currency symbol."),

  merchant: z
    .string()
    .nullable()
    .describe("Merchant or company name involved in the transaction."),

  date: z
    .string()
    .nullable()
    .describe("Transaction date found in the SMS, any standard format.")
});

export async function extractAction(_: unknown, formData: FormData) {
  const sms = formData.get("sms");
  if (typeof sms !== "string") return { error: "Invalid input" };

  try {
    const result = await generateObject({
      model: openrouter("x-ai/grok-4-fast"),
      schema: TransactionSchema,
      prompt: `
      Extract transaction details from this SMS.
      Always return JSON matching the schema exactly.
      
      SMS:
      "${sms}"
    `
    });

    return { result: result.object };
  } catch {
    return { error: "Failed to extract" };
  }
}
