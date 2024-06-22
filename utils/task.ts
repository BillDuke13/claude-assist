import { AnthropicClient } from "./anthropic_client.ts";

export abstract class Task {
  protected client: AnthropicClient;

  constructor(client: AnthropicClient) {
    this.client = client;
  }

  abstract execute(input: string, options?: Record<string, unknown>): Promise<string>;
}