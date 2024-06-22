// routes/api/chat.ts

import { Handlers } from "$fresh/server.ts";
import { AnthropicClient } from "../../utils/anthropic_client.ts";

async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binary = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  return btoa(binary);
}

export const handler: Handlers = {
  async POST(req) {
    const formData = await req.formData();
    const messagesJson = formData.get("messages") as string | null;
    const messages = messagesJson ? JSON.parse(messagesJson) : [];

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let fileContents = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof File) {
        try {
          const base64File = await fileToBase64(value);
          fileContents.push({
            name: value.name,
            type: value.type,
            content: base64File
          });
        } catch (error) {
          console.error("Error processing file:", error);
        }
      }
    }

    const client = new AnthropicClient(Deno.env.get("ANTHROPIC_API_KEY") || "");

    try {
      let prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");
      
      if (fileContents.length > 0) {
        prompt += "\n\nUser has uploaded the following files:\n";
        fileContents.forEach((file, index) => {
          prompt += `\nFile ${index + 1}: ${file.name} (${file.type})\n`;
          if (file.type.startsWith("image/")) {
            prompt += `[Image data: data:${file.type};base64,${file.content}]\n`;
          } else {
            prompt += `[File content: ${file.content.slice(0, 100)}...]\n`;
          }
        });
      }

      prompt += "\n\nAssistant: ";

      const response = await client.complete(prompt);

      const formattedResponse = response.trim();

      return new Response(JSON.stringify({ result: formattedResponse }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error in chat:", error);
      return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};