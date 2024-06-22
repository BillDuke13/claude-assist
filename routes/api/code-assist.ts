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
    const form = await req.formData();
    const prompt = form.get("prompt") as string;
    const images = form.getAll("image") as File[];

    let imageDescriptions = "";
    
    try {
      for (let i = 0; i < images.length; i++) {
        const base64Image = await fileToBase64(images[i]);
        imageDescriptions += `Image ${i + 1}: [Base64 encoded image: ${base64Image.slice(0, 20)}...]\n\n`;
      }
    } catch (error) {
      console.error("Error processing images:", error);
      return new Response(JSON.stringify({ error: "Failed to process images" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new AnthropicClient(Deno.env.get("ANTHROPIC_API_KEY") || "");

    try {
      const response = await client.complete(`
        Based on the following prompt and images, please assist with the coding task:
        
        Prompt: ${prompt}
        
        ${imageDescriptions}
        
        Please analyze the images (if any) and provide coding assistance based on the prompt and image content.
      `);

      return new Response(JSON.stringify({ result: response }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error in code assist:", error);
      return new Response(JSON.stringify({ error: "Failed to process code assist request" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};