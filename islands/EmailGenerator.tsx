import { useState } from "preact/hooks";

export default function EmailGenerator() {
  const [topic, setTopic] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setGeneratedEmail(data.result);
    } catch (error) {
      console.error("Error:", error);
      setError(`An error occurred: ${error.message}. Please try again.`);
      setGeneratedEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-4">
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label htmlFor="topic" class="block text-sm font-medium text-gray-700">
            Email Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic((e.target as HTMLInputElement).value)}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Enter the email topic or purpose"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Generating..." : "Generate Email"}
        </button>
      </form>
      {error && (
        <div class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {generatedEmail && (
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900">Generated Email:</h3>
          <div class="mt-2 p-4 bg-gray-100 rounded-md whitespace-pre-wrap">{generatedEmail}</div>
        </div>
      )}
    </div>
  );
}