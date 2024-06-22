import { Handlers } from "$fresh/server.ts";
import { AnthropicClient } from "../../utils/anthropic_client.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await req.json();
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid or empty messages array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new AnthropicClient(Deno.env.get("ANTHROPIC_API_KEY") || "");

    try {
      // Prepare the prompt for title generation
      let prompt = "Based on the following conversation, generate a short, concise title (max 5 words):\n\n";
      messages.forEach((message: any) => {
        prompt += `${message.role}: ${message.content}\n`;
      });
      prompt += "\nTitle:";

      // Get the title from Anthropic
      const response = await client.complete(prompt);

      const title = response.trim();

      return new Response(JSON.stringify({ title }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error generating title:", error);
      return new Response(JSON.stringify({ error: "Failed to generate title" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};