import { Handlers } from "$fresh/server.ts";
import { TaskFactory } from "../../utils/task_factory.ts";

export const handler: Handlers = {
  async POST(req) {
    const { input, targetLanguage } = await req.json();
    const factory = new TaskFactory(Deno.env.get("ANTHROPIC_API_KEY") || "");
    const translator = factory.createTranslator();
    const result = await translator.execute(input, { targetLanguage });
    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};