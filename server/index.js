import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { processCommand } from './commands.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IP_ADDRESS = process.env.IP_ADDRESS || 'localhost';
const PORT = process.env.PORT || 6000;
const app = express();

app.use(cors());
app.use(express.json());

// Load your SSL certificate and private key
// const privateKey = fs.readFileSync('key.pem', 'utf8');
// const certificate = fs.readFileSync('cert.pem', 'utf8');

// const passphrase = 'zaman';
// const credentials = { key: privateKey, passphrase, cert: certificate };

// Create an HTTPS server with your Express app
// const httpsServer = https.createServer(credentials, app);

function ensureSecure(req, res, next) {
  if (req.secure) {
    // Request is already secure (HTTPS)
    return next();
  }
  // Redirect to HTTPS version of the URL
  res.redirect('https://' + req.hostname + req.originalUrl);
}

// Use the middleware to enforce HTTPS
// app.use(ensureSecure);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SYSTEM_PROMPT = `You are an AI assistant that can help users with various tasks and commands.
Available commands: /time, /date, /weather, /help , /pokkie
When a user message contains a command, execute it and provide a natural response based on the result.
If no command is found, provide a helpful response based on the user's message. You can also provide general information or ask clarifying questions.
You made by Zaman Sheikh - and his github url : https://github.com/zamansheikh`;

let chat;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!chat) {
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: SYSTEM_PROMPT,
          },
          {
            role: "model",
            parts: "Understood. I'll help users with commands and provide natural responses.",
          },
        ],
      });
    }

    // Check if message contains a command
    const commandMatch = message.match(/^\/(\w+)(?:\s+(.*))?$/);
    let response;

    if (commandMatch) {
      const [, command, args] = commandMatch;
      const commandResult = await processCommand(command, args);

      // Let Gemini process the command result
      const result = await chat.sendMessage(
        `Command '/${command}' was executed with result: ${commandResult}. Please provide a natural response based on this result.`
      );
      response = result.response.text();
    } else {
      // Let Gemini handle non-command messages
      const result = await chat.sendMessage(message);
      response = result.response.text();
    }

    res.json({ response });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});


app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server running at http://${IP_ADDRESS}:${PORT}`);
});

// httpsServer.listen(PORT, () => {
//   console.log(`Server running at https://${IP_ADDRESS}:${PORT}`);
// });