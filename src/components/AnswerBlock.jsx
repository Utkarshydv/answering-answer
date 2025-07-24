import React from 'react';

export default function AnswerBlock({ type, message }) {
  const isUser = type === 'user';
  return (
    <div className={`answer-block ${isUser ? 'user' : 'ai'}`}>
      <p>{message}</p>
    </div>
  );
}
