export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string) => string;
}