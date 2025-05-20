
import React from 'react';
import { Message } from '@/types/chatTypes';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.type === 'user'
            ? 'bg-burgundy text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
