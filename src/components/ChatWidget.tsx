
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, X, Send } from 'lucide-react';

// Get refund status
function getRefundStatus(orderId: string): { active: boolean; message: string } {
  // Mock status logic
  const orderNum = parseInt(orderId.replace(/\D/g, ''));
  
  if (orderNum % 3 === 0) {
    return {
      active: true,
      message: `Your refund for order ${orderId} was processed on May 15. You'll receive the money in your account in 2-3 business days.`
    };
  } else if (orderNum % 3 === 1) {
    return {
      active: true,
      message: `Your refund request for order ${orderId} is being processed. It typically takes 5-7 business days to complete.`
    };
  } else {
    return {
      active: false,
      message: `No active refund found for order ${orderId}.`
    };
  }
}

// Get exchange status
function getExchangeStatus(orderId: string): { active: boolean; message: string } {
  // Mock status logic
  const orderNum = parseInt(orderId.replace(/\D/g, ''));
  
  if (orderNum % 4 === 0) {
    return {
      active: true,
      message: `Your exchange for order ${orderId} has been approved. The new item will be shipped within 2 business days.`
    };
  } else if (orderNum % 4 === 1) {
    return {
      active: true,
      message: `We've received your return for order ${orderId}. We're processing your exchange and will ship the new item soon.`
    };
  } else if (orderNum % 4 === 2) {
    return {
      active: true,
      message: `Your exchange request for order ${orderId} is waiting for your return package. Please use the shipping label we emailed you.`
    };
  } else {
    return {
      active: false,
      message: `No active exchange found for order ${orderId}.`
    };
  }
}

// Get order tracking
function getOrderTracking(identifier: string): { found: boolean; message: string } {
  // Mock tracking logic based on order ID or email
  const isOrderId = identifier.match(/^SNT-\d{6}$/i);
  
  if (isOrderId) {
    const orderNum = parseInt(identifier.replace(/\D/g, ''));
    
    if (orderNum % 5 === 0) {
      return {
        found: true,
        message: `Your order ${identifier} has been delivered on May 18, 2023 at 2:45 PM.`
      };
    } else if (orderNum % 5 === 1) {
      return {
        found: true,
        message: `Your order ${identifier} is out for delivery and will reach you today before 8:00 PM.`
      };
    } else if (orderNum % 5 === 2) {
      return {
        found: true,
        message: `Your order ${identifier} has been shipped and is in transit. Expected delivery: Tomorrow by end of day.`
      };
    } else if (orderNum % 5 === 3) {
      return {
        found: true,
        message: `Your order ${identifier} is being processed and will be shipped within 24 hours.`
      };
    } else {
      return {
        found: true,
        message: `Your order ${identifier} has been received and payment confirmed. We'll process it soon.`
      };
    }
  } else {
    // Simulate email lookup
    return {
      found: true,
      message: `We found 1 recent order associated with ${identifier}. Order SNT-123456 is currently in transit and should be delivered by tomorrow evening.`
    };
  }
}

// Define types for messages
type MessageType = 'user' | 'bot';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

// ChatWidget component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hi there! 👋 How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      scrollAreaRef.current?.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const processUserInput = (input: string) => {
    // Process the user's input based on keywords
    const lowerInput = input.toLowerCase();
    
    // Check for greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput === 'hey') {
      return "Hello! How can I assist you today with your SNITCH order?";
    }
    
    // Check for order tracking
    const orderIdMatch = input.match(/SNT-\d{6}/i);
    const containsOrderKeywords = lowerInput.includes('order') && 
      (lowerInput.includes('track') || lowerInput.includes('status') || lowerInput.includes('where'));
    
    if (orderIdMatch || containsOrderKeywords) {
      // If we have an order ID, use it, otherwise ask for it
      if (orderIdMatch) {
        const orderId = orderIdMatch[0];
        const tracking = getOrderTracking(orderId);
        return tracking.message;
      } else {
        return "I'd be happy to help you track your order. Could you please provide your order number (format: SNT-123456) or the email address used for the purchase?";
      }
    }
    
    // Check for refund status
    if (lowerInput.includes('refund') && lowerInput.includes('status')) {
      const orderIdMatch = input.match(/SNT-\d{6}/i);
      if (orderIdMatch) {
        const orderId = orderIdMatch[0];
        const refundStatus = getRefundStatus(orderId);
        return refundStatus.message;
      } else {
        return "To check your refund status, I'll need your order number (format: SNT-123456). Could you please provide it?";
      }
    }
    
    // Check for exchange status
    if (lowerInput.includes('exchange') && lowerInput.includes('status')) {
      const orderIdMatch = input.match(/SNT-\d{6}/i);
      if (orderIdMatch) {
        const orderId = orderIdMatch[0];
        const exchangeStatus = getExchangeStatus(orderId);
        return exchangeStatus.message;
      } else {
        return "To check the status of your exchange, I'll need your order number (format: SNT-123456). Could you please provide it?";
      }
    }
    
    // Default response for unrecognized queries
    return "I'm not sure I understand your question. I can help with order tracking, refund status, or exchange status. Please provide more details or your order number (format: SNT-123456).";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      // Generate bot response
      const botResponse = processUserInput(userMessage.text);
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors ${
          isOpen ? 'bg-gray-700' : 'bg-burgundy hover:bg-burgundy/90'
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <MessageSquare className="text-white" size={24} />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Chat header */}
          <div className="bg-burgundy text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="mr-2" size={18} />
              <h3 className="font-medium">SNITCH Support</h3>
            </div>
            <button onClick={toggleChat}>
              <X size={18} />
            </button>
          </div>
          
          {/* Chat messages */}
          <ScrollArea className="h-80" ref={scrollAreaRef}>
            <div className="p-3 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
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
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <Separator />
          
          {/* Chat input */}
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
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
