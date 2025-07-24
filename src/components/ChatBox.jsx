import React, { useEffect, useRef } from 'react';
import AnswerBlock from './AnswerBlock';

export default function ChatBox({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((msg, idx) => (
        <AnswerBlock key={idx} type={msg.type} message={msg.message} />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}
