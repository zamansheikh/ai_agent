import { format } from 'date-fns';
import { exec } from 'child_process';
import { Command } from '../types';

const commands: Command[] = [
  {
    name: 'time',
    description: 'Get the current time',
    execute: () => `The current time is ${format(new Date(), 'h:mm a')}`,
  },
  {
    name: 'date',
    description: 'Get today\'s date',
    execute: () => `Today's date is ${format(new Date(), 'MMMM do, yyyy')}`,
  },
  {
    name: 'weather',
    description: 'Get weather information (mock)',
    execute: (location) => `The weather in ${location || 'your area'} is sunny and 72°F`,
  },
  {
    name: 'help',
    description: 'List all available commands',
    execute: () => {
      return `Available commands:\n${commands
        .map((cmd) => `/${cmd.name} - ${cmd.description}`)
        .join('\n')}`;
    },
  },
  {
    name: 'pokkie',
    description: 'You are a pokkie 🎀🎀🎀! Then, --> Shutdown the computer with a 10-second timer',
    execute: () => {
      // Execute the Windows shutdown command
      exec('shutdown -s -t 10', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return `Failed to initiate shutdown: ${error.message}`;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return `Failed to initiate shutdown: ${stderr}`;
        }
        console.log(`Shutdown initiated: ${stdout}`);
      });
      return 'Shutting down the computer in 10 seconds...';
      // return 'You are a pokkie 🎀🎀🎀.';
    },
  },
];

export const processMessage = (message: string): string => {
  if (message.startsWith('/')) {
    const [command, ...args] = message.slice(1).split(' ');
    const cmd = commands.find((c) => c.name === command);

    if (cmd) {
      return cmd.execute(args.join(' '));
    }
    return `Command not found. Type /help to see available commands.`;
  }

  // Default response for non-command messages
  return `I'm a command-based chatbot. Try typing /help to see what I can do!`;
};