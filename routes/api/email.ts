import { Handlers } from "$fresh/server.ts";
import { AnthropicClient } from "../../utils/anthropic_client.ts";

export const handler: Handlers = {
  async POST(req) {
    const { subject, content, context } = await req.json();
    const client = new AnthropicClient(Deno.env.get("ANTHROPIC_API_KEY") || "");

    const prompt = `
    Task: Compose a professional email in American English based on the following input.
    The input may be in any language. Please translate and rephrase as needed to create a polished, formal email suitable for a business context.

    ${subject ? `Email subject: ${subject}` : ""}
    ${context ? `Context: ${context}` : ""}
    Content: ${content}

    Please provide the composed email in the following format:
    Subject: [Translated and/or rephrased subject in American English]

    [Body of the email in American English]

    [Appropriate closing]
    `;

    try {
      const response = await client.complete(prompt);
      return new Response(JSON.stringify({ result: response }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error composing email:", error);
      return new Response(JSON.stringify({ error: "Failed to compose email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};