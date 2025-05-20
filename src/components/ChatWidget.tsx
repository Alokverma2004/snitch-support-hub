
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 sm:w-96 overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-5">
          <div className="bg-navy text-white p-4 flex justify-between items-center">
            <h3 className="font-medium">Chat with SNITCH AI Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 bg-gray-50 flex-grow max-h-[350px] overflow-y-auto">
            <div className="text-center text-gray-500 py-12">
              <p className="mb-4">This is a placeholder for the SNITCH AI Assistant.</p>
              <p>Ask us about your order, products, or support requests!</p>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-navy px-3 py-2"
                disabled
              />
              <Button className="rounded-l-none bg-burgundy hover:bg-burgundy/90">
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full bg-burgundy hover:bg-burgundy/90 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
