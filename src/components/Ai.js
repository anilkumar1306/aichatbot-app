import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const chatWithGpt = async (prompt) => {
    const apiKey = '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'; // Replace with your actual OpenAI API key
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    };

    try {
      const response = await axios.post(endpoint, data, { headers });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return 'Error communicating with OpenAI';
    }
  };

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { role: 'user', content: userInput };
    setChatHistory([...chatHistory, userMessage]);

    const botResponse = await chatWithGpt(userInput);
    const botMessage = { role: 'assistant', content: botResponse };
    setChatHistory([...chatHistory, userMessage, botMessage]);

    setUserInput('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>GPT-3.5 Turbo Chat</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
        {chatHistory.map((message, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <strong>{message.role === 'user' ? 'You' : 'Chatbot'}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend() }}
          style={{ width: '80%', padding: '10px' }}
        />
        <button onClick={handleSend} style={{ padding: '10px 20px', marginLeft: '10px' }}>Send</button>
      </div>
    </div>
  );
}

export default App;
