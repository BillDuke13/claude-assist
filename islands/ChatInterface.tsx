import { useState, useRef, useEffect } from "preact/hooks";
import { marked } from "marked";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ParsedMessage extends Message {
  parsedContent: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [parsedMessages, setParsedMessages] = useState<ParsedMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [parsedMessages]);

  useEffect(() => {
    createNewChat();
  }, []);

  useEffect(() => {
    const parseMessages = async () => {
      const currentChat = getCurrentChat();
      if (currentChat) {
        const parsed = await Promise.all(
          currentChat.messages.map(async (message) => ({
            ...message,
            parsedContent: await marked(message.content)
          }))
        );
        setParsedMessages(parsed);
      }
    };
    parseMessages();
  }, [currentChatId, chats]);

  const createNewChat = async () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setCurrentChatId(newChat.id);

    try {
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newChat.messages }),
      });
      if (response.ok) {
        const { title } = await response.json();
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === newChat.id ? { ...chat, title } : chat
          )
        );
      }
    } catch (error) {
      console.error("Error generating title:", error);
    }
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const getCurrentChat = () => {
    return chats.find((chat) => chat.id === currentChatId);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!input.trim() && selectedFiles.length === 0) return;

    const currentChat = getCurrentChat();
    if (!currentChat) return;

    setIsLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("messages", JSON.stringify([...currentChat.messages, { role: "user", content: input }]));
    selectedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/chat", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentCompleted);
      }
    };

    xhr.onload = async function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        
        const userMessage: Message = { role: "user", content: input };
        const assistantMessage: Message = { role: "assistant", content: data.result };

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, userMessage, assistantMessage],
                }
              : chat
          )
        );

        setInput("");
        setSelectedFiles([]);

        try {
          const titleResponse = await fetch("/api/generate-title", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: [...currentChat.messages, userMessage, assistantMessage] }),
          });
          if (titleResponse.ok) {
            const { title } = await titleResponse.json();
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat.id === currentChatId ? { ...chat, title } : chat
              )
            );
          }
        } catch (error) {
          console.error("Error generating title:", error);
        }
      } else {
        console.error("Error:", xhr.statusText);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      role: "assistant",
                      content: "An error occurred. Please try again.",
                    },
                  ],
                }
              : chat
          )
        );
      }
      setIsLoading(false);
      setUploadProgress(0);
    };

    xhr.onerror = function() {
      console.error("Request failed");
      setIsLoading(false);
      setUploadProgress(0);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: "An error occurred. Please try again.",
                  },
                ],
              }
            : chat
        )
      );
    };

    xhr.send(formData);
  };

  const handleFileChange = (e: Event) => {
    const fileList = (e.target as HTMLInputElement).files;
    if (fileList) {
      setSelectedFiles(Array.from(fileList));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div class="flex h-screen bg-gray-100">
      <div class="w-64 bg-white text-gray-800 p-4 border-r border-gray-200 overflow-y-auto">
        <button
          onClick={createNewChat}
          class="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
        >
          New Chat
        </button>
        <div class="mt-4 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchChat(chat.id)}
              class={`cursor-pointer p-2 rounded transition duration-200 ${
                chat.id === currentChatId ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          {parsedMessages.map((message, index) => (
            <div
              key={index}
              class={`p-4 rounded-lg max-w-[80%] ${
                message.role === "user" ? "bg-gray-200 ml-auto" : "bg-white shadow-md"
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: message.parsedContent }}
                class="prose max-w-none"
              />
            </div>
          ))}
          {isLoading && (
            <div class="flex justify-center items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} class="p-4 bg-white border-t border-gray-200">
          <div class="flex flex-col space-y-2">
            <div class="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput((e.target as HTMLInputElement).value)}
                class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Type your message..."
              />
              <button
                type="button"
                onClick={triggerFileInput}
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                class="hidden"
                multiple
              />
              <button
                type="submit"
                disabled={isLoading}
                class="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 transition duration-200"
              >
                Send
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div class="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                <p class="font-semibold">{selectedFiles.length} file(s) selected (not uploaded yet):</p>
                <ul class="list-disc list-inside">
                  {selectedFiles.map((file, index) => (
                    <li key={index} class="flex items-center justify-between">
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        class="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}