import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-4 ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end group`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 ${
        isBot 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
          : 'bg-gradient-to-br from-green-500 to-green-600'
      }`}>
        {isBot ? 
          <Bot size={20} className="text-white" /> : 
          <User size={20} className="text-white" />
        }
      </div>
      <div className={`message-bubble max-w-[80%] px-6 py-4 rounded-2xl shadow-sm
        ${isBot 
          ? 'glass-effect text-gray-800 rounded-bl-none' 
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans leading-relaxed">{message.content}</pre>
        <div className={`text-xs mt-2 ${isBot ? 'text-gray-500' : 'text-blue-100'}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};