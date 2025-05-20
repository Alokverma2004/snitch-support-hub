
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex gap-2">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!inputValue.trim()}>
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
