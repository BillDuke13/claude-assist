import { Task } from "./task.ts";

export class EmailComposer extends Task {
  async execute(input: string, _options?: Record<string, unknown>): Promise<string> {
    const prompt = `Please rewrite the following content as a professional email in American English:

${input}

Please maintain the original meaning, but use a formal, professional American English email tone and format.`;

    return await this.client.complete(prompt);
  }
}