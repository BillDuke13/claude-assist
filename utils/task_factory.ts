import { AnthropicClient } from "./anthropic_client.ts";
import { EmailComposer } from "./email_composer.ts";
import { Translator } from "./translator.ts";

export class TaskFactory {
  private client: AnthropicClient;

  constructor(apiKey: string) {
    this.client = new AnthropicClient(apiKey);
  }

  createEmailComposer(): EmailComposer {
    return new EmailComposer(this.client);
  }

  createTranslator(): Translator {
    return new Translator(this.client);
  }
}