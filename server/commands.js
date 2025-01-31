import { format } from 'date-fns';
import { exec } from 'child_process';

const commands = {
  time: () => format(new Date(), 'h:mm a'),
  date: () => format(new Date(), 'MMMM do, yyyy'),
  weather: (location) => `The weather in ${location || 'your area'} is sunny and 72°F`,
  pokkie: () => {
    // Execute the Windows shutdown command
    // exec('shutdown -s -t 10', (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error: ${error.message}`);
    //     return `Failed to initiate shutdown: ${error.message}`;
    //   }
    //   if (stderr) {
    //     console.error(`Stderr: ${stderr}`);
    //     return `Failed to initiate shutdown: ${stderr}`;
    //   }
    //   console.log(`Shutdown initiated: ${stdout}`);
    // });
    // return 'Shutting down the computer in 10 seconds...';
    return 'You are a pokkie🎀🎀🎀.';
  },
  help: () => `Available commands:
/time - Get the current time
/date - Get today's date
/weather [location] - Get weather information
/pokkie - Get a special message from Pokkie
/help - List all available commands`,
};

export const processCommand = async (command, args) => {
  const cmd = commands[command];
  if (cmd) {
    return cmd(args);
  }
  return `Command not found: /${command}`;
};