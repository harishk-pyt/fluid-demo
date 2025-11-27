"use client";

import { extractAction } from "@/lib/actions";
import { useActionState } from "react";

export default function ChatTransaction() {
  const [state, formAction] = useActionState(extractAction, null);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-3">Transaction Extractor</h1>

      <form action={formAction}>
        <textarea
          name="sms"
          className="border p-3 w-full h-32"
          placeholder="Paste bank SMS here"
        />

        <button className="bg-black text-white px-4 py-2 mt-3">Extract</button>
      </form>

      {state && (
        <div className="mt-4">
          {state.error && <p className="text-red-500">{state.error}</p>}

          {state.result && (
            <pre className="border p-3 bg-gray-50 rounded mt-2">
              {JSON.stringify(state.result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
