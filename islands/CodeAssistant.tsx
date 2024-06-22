import { useState } from "preact/hooks";

export default function CodeAssistant() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setImages(Array.from(target.files));
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("prompt", prompt);
    images.forEach((img, index) => {
      formData.append(`image${index}`, img);
    });

    try {
      const response = await fetch("/api/code-assist", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-4">
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label htmlFor="prompt" class="block text-sm font-medium text-gray-700">
            Describe your code task
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt((e.target as HTMLTextAreaElement).value)}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows={4}
            placeholder="Describe the code you need help with..."
          />
        </div>
        <div>
          <label htmlFor="images" class="block text-sm font-medium text-gray-700">
            Upload images (optional)
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            class="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Processing..." : "Generate Code"}
        </button>
      </form>
      {result && (
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900">Generated Code:</h3>
          <pre class="mt-2 p-4 bg-gray-100 rounded-md overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}