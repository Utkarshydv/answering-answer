import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ChatBox from './components/ChatBox';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const chatScrollRef = useRef(null);

const handleSend = async () => {
  if (!inputValue.trim()) return;

  const userMessage = { type: 'user', message: inputValue.trim() };
  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setShowSearch(true);

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
    console.error('AI error:', err);
    const aiResponse = { type: 'ai', message: '⚠️ Failed to fetch AI response.' };
    setMessages(prev => [...prev, aiResponse]);
  }
};


  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, showSearch]);

  return (
    <div
      className="app"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%', // ✅ Double the width of main window
        margin: '0 auto',
      }}
    >
      <Header />

      {/* ✅ Scrollable chat area */}
      <div
        className="chat-scroll-area"
        ref={chatScrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatBox messages={messages} />
        {showSearch && (
          <div style={{ marginTop: '20px' }}>
            <SearchBar />
          </div>
        )}
      </div>

      {/* ✅ Input section */}
      <div className="chat-input" style={{ display: 'flex', gap: '10px', padding: '10px 20px' }}>
        <input
          type="text"
          placeholder="Type your question..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '10px' }}
        />
        <button onClick={handleSend}>Send</button>
        <button onClick={() => window.location.reload()}>Clear</button>
      </div>
    </div>
  );
}
