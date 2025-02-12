import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { sendMessage } from './utils/api';
import { Send, Bot, Github, Loader2 } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "✨ Hello! I'm your AI assistant made by Zaman Sheikh. Type /help to see what I can do!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen chat-gradient flex flex-col">
      {/* Header */}
      <header className="glass-effect shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Zaman's AI Assistant</h1>
            <p className="text-sm text-gray-600 mt-0.5">Powered by Gemini- Vai Beshi command diyen na limit shesh hoye jabe! 😒</p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col">
        <div className="flex-1 glass-effect rounded-2xl shadow-lg p-6 mb-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 glass-effect rounded-2xl shadow-md">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or command (e.g., /help)"
              className="w-full px-5 py-4 bg-transparent border-none focus:outline-none focus:ring-2 input-focus-ring rounded-2xl text-gray-800 placeholder-gray-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-lg button-hover ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
            <span className="font-medium">{isLoading ? 'Sending...' : 'Send'}</span>
          </button>
        </form>

        {/* Developer Credit */}
        <footer className="mt-6 text-center">
          <a
            href="https://github.com/zamansheikh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 glass-effect rounded-xl hover:shadow-md transition-all duration-200 group"
          >
            <Github size={20} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
              Developed by Zaman Sheikh
            </span>
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;