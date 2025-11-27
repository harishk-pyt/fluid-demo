import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-black dark:text-zinc-50">
          Building with AI-SDK, Tool Calling & OpenRouter
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-7 mb-12">
          This session is a hands-on walkthrough of how modern LLM apps are
          actually built. We’ll explore AI-SDK for structured tool calling,
          OpenRouter for model routing, and how both combine to create reliable
          AI-driven features. Below are simple demos showing these concepts in
          action.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Demos
          </h2>

          <div className="flex flex-col gap-4">
            <Link
              href="/chat-basic"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Basic Chat Demo
            </Link>

            <Link
              href="/chat-transaction"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Transaction Extraction (Tool Calling)
            </Link>

            <Link
              href="/chat-flight"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Flight Booking (Tool Calling)
            </Link>
          </div>
        </section>

        <footer className="text-center text-zinc-500 dark:text-zinc-400">
          <p>Built with Next.js and Tailwind CSS</p>
        </footer>
      </main>
    </div>
  );
}
