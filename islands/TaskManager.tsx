import { useState } from "preact/hooks";
import TranslateForm from "./TranslateForm.tsx";
import CodeAssistant from "./CodeAssistant.tsx";
import EmailGenerator from "./EmailGenerator.tsx";
import ChatInterface from "./ChatInterface.tsx";

const TaskButton = ({ children, active, onClick }: { children: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    class={`px-6 py-3 text-sm font-medium ${
      active
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

export default function TaskManager() {
  const [activeTask, setActiveTask] = useState("Translate");

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto">
          <div class="flex space-x-8 overflow-x-auto">
            <TaskButton active={activeTask === "Translate"} onClick={() => setActiveTask("Translate")}>
              Translate
            </TaskButton>
            <TaskButton active={activeTask === "Code"} onClick={() => setActiveTask("Code")}>
              Code Assistant
            </TaskButton>
            <TaskButton active={activeTask === "Email"} onClick={() => setActiveTask("Email")}>
              Email Generator
            </TaskButton>
            <TaskButton active={activeTask === "Chat"} onClick={() => setActiveTask("Chat")}>
              Chat
            </TaskButton>
          </div>
        </div>
      </header>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          {activeTask === "Translate" && <TranslateForm />}
          {activeTask === "Code" && <CodeAssistant />}
          {activeTask === "Email" && <EmailGenerator />}
          {activeTask === "Chat" && <ChatInterface />}
        </div>
      </main>
    </div>
  );
}