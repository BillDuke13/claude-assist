import Anthropic from "anthropic";
export class AnthropicClient {
    private client: Anthropic;
  
    constructor(apiKey: string) {
      this.client = new Anthropic({
        apiKey: apiKey,
      });
    }
  
    async complete(prompt: string): Promise<string> {
      try {
        const response = await this.client.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        });
  
        if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
          return response.content[0].text;
        } else {
          throw new Error("Unexpected response format from Anthropic API");
        }
      } catch (error) {
        console.error("Error calling Anthropic API:", error);
        throw new Error("Failed to get completion from Anthropic API");
      }
    }
  }