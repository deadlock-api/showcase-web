import { useState } from "react";
import Markdown from "react-markdown";
import { format } from "sql-formatter";
import { Button } from "~/components/ui/button";

export default function ChatWithDB() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const [apiKey, setApiKey] = useState<string | null>();
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<Record<string, string | string[]> | null>();

  async function run_prompt() {
    setResponse(null);
    setLoading(true);
    const params = new URLSearchParams({ prompt });
    if (apiKey && apiKey.length > 5) params.set("gemini_api_key", apiKey);

    fetch(`https://analytics.deadlock-api.com/v1/dev/chat-with-db?${params}`)
      .then((r) => r.json())
      .then((result) => {
        setResponse(result);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        setLoading(false);
      });
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">Chat with Database</h1>
      <div className="grid gap-6 max-w-2xl">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Prompt
          </label>
          <input
            type="text"
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
            Gemini API Key (not required, get one at{" "}
            <a href="https://aistudio.google.com/" className="text-blue-500" target="_blank" rel="noreferrer">
              Google AI Studio
            </a>
            )
          </label>
          <input
            type="text"
            id="api-key"
            name="api-key"
            value={apiKey ?? ""}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                focus:outline-none"
          />
        </div>
        <div>
          <Button onClick={run_prompt} disabled={isLoading}>
            {isLoading ? "Running..." : "Run Prompt"}
          </Button>
        </div>
        <div>
          {response ? (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Response</h2>
              <div className="space-y-6">
                <h3 className="text-lg font-bold">SQL Queries</h3>
                {response.sql_queries && (
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {response.sql_queries.map((query: string) => format(query)).join("\n\n")}
                  </pre>
                )}
                <h3 className="text-lg font-bold">SQL Results</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(response.clickhouse_result, null, 2)}
                </pre>
                <h3 className="text-lg font-bold">Formatted Response</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  <Markdown>{(response.formatted_response as string) ?? JSON.stringify(response, null, 2)}</Markdown>
                </pre>
              </div>
            </div>
          ) : error ? (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Error</h2>
              <pre className="bg-red-100 p-4 rounded-md overflow-x-auto">{error}</pre>
            </div>
          ) : isLoading ? (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Loading...</h2>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
