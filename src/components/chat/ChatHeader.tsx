
import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-burgundy text-white p-3 flex justify-between items-center">
      <div className="flex items-center">
        <MessageSquare className="mr-2" size={18} />
        <h3 className="font-medium">SNITCH Support</h3>
      </div>
      <button onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;
