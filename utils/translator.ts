import { Task } from "./task.ts";

export class Translator extends Task {
  async execute(input: string, options?: { targetLanguage?: string }): Promise<string> {
    const targetLanguage = options?.targetLanguage || 'English';
    let prompt: string;

    if (targetLanguage.toLowerCase() === 'english') {
      prompt = `Translate the following text into idiomatic American English. Provide only the translation without any explanations:

${input}`;
    } else {
      prompt = `Translate the following text from American English to ${targetLanguage}. Provide only the translation without any explanations:

${input}`;
    }

    const response = await this.client.complete(prompt);
    

    return response.trim().replace(/^["']|["']$/g, '');
  }
}