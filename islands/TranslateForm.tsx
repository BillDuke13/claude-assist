import { useState } from "preact/hooks";

const LanguageButton = ({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    class={`px-4 py-2 rounded-md text-sm ${active 
      ? "bg-blue-100 text-blue-700" 
      : "text-gray-700 hover:bg-gray-100"}`}
  >
    {children}
  </button>
);

const commonLanguages = [
  "English", "Chinese (Simplified)", "Spanish", "French", 
  "German", "Japanese", "Korean", "Russian", "Arabic"
];

export default function TranslateForm() {
  const [sourceLanguage, setSourceLanguage] = useState("Detect language");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!input.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          input, 
          sourceLanguage: sourceLanguage === "Detect language" ? "auto" : sourceLanguage,
          targetLanguage 
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setOutput(data.result);
    } catch (error) {
      console.error("Translation error:", error);
      setError(`An error occurred: ${error.message}. Please try again.`);
      setOutput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="w-full sm:w-1/2">
          <h3 class="text-lg font-medium mb-2">Source Language</h3>
          <div class="flex flex-wrap gap-2">
            <LanguageButton 
              active={sourceLanguage === "Detect language"} 
              onClick={() => setSourceLanguage("Detect language")}
            >
              Detect language
            </LanguageButton>
            {commonLanguages.map(lang => (
              <LanguageButton 
                key={lang}
                active={sourceLanguage === lang} 
                onClick={() => setSourceLanguage(lang)}
              >
                {lang}
              </LanguageButton>
            ))}
          </div>
        </div>
        <div class="w-full sm:w-1/2">
          <h3 class="text-lg font-medium mb-2">Target Language</h3>
          <div class="flex flex-wrap gap-2">
            {commonLanguages.map(lang => (
              <LanguageButton 
                key={lang}
                active={targetLanguage === lang} 
                onClick={() => setTargetLanguage(lang)}
              >
                {lang}
              </LanguageButton>
            ))}
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="w-full sm:w-1/2">
          <textarea
            value={input}
            onChange={(e) => setInput((e.target as HTMLTextAreaElement).value)}
            class="w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter text to translate"
          />
          <div class="flex justify-between items-center mt-2">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !input.trim()}
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading ? "Translating..." : "Translate"}
            </button>
            <span class="text-sm text-gray-500">{input.length} / 5,000</span>
          </div>
        </div>
        <div class="w-full sm:w-1/2">
          <div class="w-full h-64 p-4 border rounded-lg bg-gray-50 overflow-auto">
            {isLoading ? (
              <div class="flex items-center justify-center h-full">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              output
            )}
          </div>
        </div>
      </div>

      {error && (
        <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}