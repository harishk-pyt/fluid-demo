"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useState } from "react";

export default function Page() {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat-basic` // /api/chat
    })
  });

  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 rounded-xl bg-neutral-100 p-6 shadow-sm">
      <div className="flex max-h-96 flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {message.role}
            </p>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <pre
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap rounded-md bg-neutral-900/90 px-3 py-2 font-mono text-sm leading-relaxed text-white"
                    >
                      {part.text}
                    </pre>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            Start the conversation with a message below.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          placeholder="Send a message..."
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status !== "ready" || input.trim().length === 0}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}
