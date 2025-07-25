import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatBox from './components/ChatBox';

const suggestions = [
  "What can you do?",
  "How does AI work?",
  "Suggest podcasts",
  "Give me a riddle"
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatScrollRef = useRef(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage = { type: 'user', message: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue.trim() }),
      });
      const data = await response.json();
      const aiResponse = { type: 'ai', message: data.message };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const aiResponse = { type: 'ai', message: '⚠️ Failed to fetch AI response.' };
      setMessages(prev => [...prev, aiResponse]);
    }
  };

  // Handles clicking a suggestion: sends instantly
const handleSuggestionClick = (suggest) => {
  setInputValue(suggest);
  setTimeout(() => { setInputValue(''); }, 0);
  const userMessage = { type: 'user', message: suggest };
  setMessages(prev => [...prev, userMessage]);
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: suggest }),
  })
    .then(response => response.json())
    .then(data => {
      // Add "AI:" prefix to the AI message here
      const aiResponse = { type: 'ai', message: `AI: ${data.message}` };
      setMessages(prev => [...prev, aiResponse]);
    })
    .catch(() => {
      const aiResponse = { type: 'ai', message: 'AI: ⚠️ Failed to fetch AI response.' };
      setMessages(prev => [...prev, aiResponse]);
    });
};


  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="app">
      <Header />
      <ChatBox messages={messages} chatScrollRef={chatScrollRef} />

      <div className="chat-suggestions">
        {suggestions.map((suggest, idx) => (
          <button
            key={idx}
            className="suggestion-bubble"
            onClick={() => handleSuggestionClick(suggest)}
            type="button"
          >
            {suggest}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={() => setMessages([])}>Clear</button>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
