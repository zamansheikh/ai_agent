import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.10.170:3000/api',
});

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const response = await api.post('/chat', { message });
    return response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};