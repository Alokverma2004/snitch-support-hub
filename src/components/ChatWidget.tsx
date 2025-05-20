import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Send, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Define message type
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

// Quick action types
type QuickAction = {
  id: string;
  icon: string;
  label: string;
  action: string;
};

// Smart suggestion type
type SmartSuggestion = {
  id: string;
  text: string;
  action: string;
};

const quickActions: QuickAction[] = [
  { id: '1', icon: '🛍️', label: 'Ask about a product', action: 'product' },
  { id: '2', icon: '🔄', label: 'Request an exchange', action: 'exchange' },
  { id: '3', icon: '💸', label: 'Initiate a refund', action: 'refund' },
  { id: '4', icon: '🚚', label: 'Track my order', action: 'track' },
  { id: '5', icon: '🔁', label: 'Check refund/exchange status', action: 'status' },
];

// Type for the current state of the conversation
type ConversationState = {
  flow: 'initial' | 'product' | 'refund' | 'exchange' | 'track' | 'status' | 'general';
  step: number;
  data: {
    orderId?: string;
    email?: string;
    product?: string;
    reason?: string;
  };
};

// Generate smart suggestions based on conversation state
const generateSmartSuggestions = (state: ConversationState): SmartSuggestion[] => {
  const baseId = Date.now().toString();
  
  switch (state.flow) {
    case 'initial':
      return [
        { id: `${baseId}-1`, text: 'Track my order', action: 'track' },
        { id: `${baseId}-2`, text: 'Ask about refund policy', action: 'refund-policy' },
        { id: `${baseId}-3`, text: 'Product information', action: 'product' },
      ];
    case 'product':
      return [
        { id: `${baseId}-1`, text: 'Check another product', action: 'product' },
        { id: `${baseId}-2`, text: 'How to return items', action: 'return-info' },
        { id: `${baseId}-3`, text: 'Start over', action: 'reset' },
      ];
    case 'refund':
      return [
        { id: `${baseId}-1`, text: 'Track another order', action: 'track' },
        { id: `${baseId}-2`, text: 'Check refund status', action: 'status' },
        { id: `${baseId}-3`, text: 'Start over', action: 'reset' },
      ];
    case 'exchange':
      return [
        { id: `${baseId}-1`, text: 'Track my order', action: 'track' },
        { id: `${baseId}-2`, text: 'Check exchange status', action: 'status' },
        { id: `${baseId}-3`, text: 'Start over', action: 'reset' },
      ];
    case 'track':
      return [
        { id: `${baseId}-1`, text: 'Track another order', action: 'track' },
        { id: `${baseId}-2`, text: 'Request a refund', action: 'refund' },
        { id: `${baseId}-3`, text: 'Start over', action: 'reset' },
      ];
    case 'status':
      return [
        { id: `${baseId}-1`, text: 'Track my order', action: 'track' },
        { id: `${baseId}-2`, text: 'Contact support', action: 'human' },
        { id: `${baseId}-3`, text: 'Start over', action: 'reset' },
      ];
    default:
      return [
        { id: `${baseId}-1`, text: 'Track my order', action: 'track' },
        { id: `${baseId}-2`, text: 'Talk to a human', action: 'human' },
        { id: `${baseId}-3`, text: 'Start over', action: 'reset' },
      ];
  }
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    flow: 'initial',
    step: 0,
    data: {},
  });
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const now = new Date();
      setLastUpdated(now);
      setMessages([
        {
          id: now.toString(),
          content: "Hi, I'm your SNITCH Assistant 👋. How can I help you today?",
          sender: 'assistant',
          timestamp: now,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Update smart suggestions when conversation state changes
  useEffect(() => {
    if (messages.length > 0) {
      setSmartSuggestions(generateSmartSuggestions(conversationState));
    }
  }, [conversationState, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const generateId = () => {
    return Date.now().toString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const now = new Date();
    const newMessage: Message = {
      id: generateId(),
      content,
      sender,
      timestamp: now,
    };
    setMessages((prev) => [...prev, newMessage]);
    setLastUpdated(now);
  };

  const resetChat = () => {
    setMessages([]);
    setConversationState({
      flow: 'initial',
      step: 0,
      data: {},
    });
    setSmartSuggestions([]);
    const now = new Date();
    setLastUpdated(now);
    setMessages([
      {
        id: now.toString(),
        content: "Hi, I'm your SNITCH Assistant 👋. How can I help you today?",
        sender: 'assistant',
        timestamp: now,
      },
    ]);
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset.",
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'product':
        addMessage('I want to ask about a product', 'user');
        setConversationState({
          flow: 'product',
          step: 1,
          data: {},
        });
        setTimeout(() => {
          addMessage('Sure! What product would you like to know more about?', 'assistant');
        }, 500);
        break;
      case 'refund':
        addMessage('I need to initiate a refund', 'user');
        setConversationState({
          flow: 'refund',
          step: 1,
          data: {},
        });
        setTimeout(() => {
          addMessage('I can help you with that. Could you please provide your order ID so I can check eligibility?', 'assistant');
        }, 500);
        break;
      case 'exchange':
        addMessage('I want to request an exchange', 'user');
        setConversationState({
          flow: 'exchange',
          step: 1,
          data: {},
        });
        setTimeout(() => {
          addMessage('I can help you with that. Could you please provide your order ID?', 'assistant');
        }, 500);
        break;
      case 'track':
        addMessage('I want to track my order', 'user');
        setConversationState({
          flow: 'track',
          step: 1,
          data: {},
        });
        setTimeout(() => {
          addMessage('I can help you track your order. Please provide your order ID or the email used for the purchase.', 'assistant');
        }, 500);
        break;
      case 'status':
        addMessage('I want to check my refund/exchange status', 'user');
        setConversationState({
          flow: 'status',
          step: 1,
          data: {},
        });
        setTimeout(() => {
          addMessage('I can help you check the status. Please provide your order ID.', 'assistant');
        }, 500);
        break;
      case 'refund-policy':
        addMessage('What is your refund policy?', 'user');
        setTimeout(() => {
          addMessage('Our refund policy allows returns within 30 days of purchase for unused items with original packaging. Once approved, refunds are processed within 5-7 business days to your original payment method.', 'assistant');
          setConversationState({
            flow: 'general',
            step: 0,
            data: {},
          });
        }, 500);
        break;
      case 'return-info':
        addMessage('How do I return items?', 'user');
        setTimeout(() => {
          addMessage('To return an item, log into your SNITCH account, find your order, and click "Return Item". Follow the prompts to generate a return label. Package the item in its original packaging with all tags attached, and ship using the provided label within 14 days.', 'assistant');
          setConversationState({
            flow: 'general',
            step: 0,
            data: {},
          });
        }, 500);
        break;
      case 'reset':
        resetChat();
        break;
      case 'human':
        escalateToHuman();
        break;
      default:
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsLoading(true);
    
    // Process different conversation flows
    try {
      await processBotResponse(inputValue);
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage("I'm sorry, I encountered an error. Please try again or contact our support team directly.", 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmartSuggestion = (suggestion: SmartSuggestion) => {
    handleQuickAction(suggestion.action);
  };

  const escalateToHuman = () => {
    addMessage("I'd like to speak with a human agent", 'user');
    setTimeout(() => {
      addMessage("I'm escalating this to our team — you'll hear from us soon! A support agent will contact you within 24 hours.", 'assistant');
      toast({
        title: "Support Request Sent",
        description: "A customer service representative will contact you soon.",
      });
    }, 500);
  };

  const processBotResponse = async (userInput: string) => {
    const { flow, step, data } = conversationState;
    let botResponse = '';
    let nextState = { ...conversationState };
    
    // Wait a bit to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Handle conversations based on flow and step
    switch (flow) {
      case 'initial':
        // Detect intent from first user message
        if (userInput.toLowerCase().includes('product') || userInput.toLowerCase().includes('shirt') || userInput.toLowerCase().includes('size')) {
          botResponse = 'What product would you like to know more about?';
          nextState = { flow: 'product', step: 1, data: {} };
        } else if (userInput.toLowerCase().includes('refund')) {
          botResponse = 'I can help you with a refund. Could you please provide your order ID?';
          nextState = { flow: 'refund', step: 1, data: {} };
        } else if (userInput.toLowerCase().includes('exchange')) {
          botResponse = 'I can help you with an exchange. Could you please provide your order ID?';
          nextState = { flow: 'exchange', step: 1, data: {} };
        } else if (userInput.toLowerCase().includes('track') || userInput.toLowerCase().includes('delivery') || userInput.toLowerCase().includes('shipping')) {
          botResponse = 'I can help you track your order. Please provide your order ID or email.';
          nextState = { flow: 'track', step: 1, data: {} };
        } else if (userInput.toLowerCase().includes('status')) {
          botResponse = 'I can check the status of your refund or exchange. Please provide your order ID.';
          nextState = { flow: 'status', step: 1, data: {} };
        } else {
          botResponse = "I'm here to help with products, orders, refunds, exchanges, and delivery status. What can I assist you with today?";
          nextState = { flow: 'general', step: 0, data: {} };
        }
        break;
        
      case 'product':
        if (step === 1) {
          const productInfo = getProductInfo(userInput);
          botResponse = productInfo;
          nextState = { flow: 'product', step: 2, data: { ...data, product: userInput } };
        } else {
          botResponse = "Is there anything else you'd like to know about our products?";
          nextState = { flow: 'initial', step: 0, data: {} };
        }
        break;
        
      case 'refund':
        if (step === 1) {
          // Validate order ID format (simple check)
          if (userInput.match(/^SNT-\d{6}$/i)) {
            const isEligible = checkRefundEligibility(userInput);
            if (isEligible) {
              botResponse = `Great! I've checked order ${userInput} and it's eligible for a refund. I'll initiate the process. You'll receive a confirmation email shortly with details.`;
              const result = initiateRefund(userInput);
              nextState = { flow: 'initial', step: 0, data: {} };
            } else {
              botResponse = `I'm sorry, but order ${userInput} is not eligible for a refund. This could be because it's been more than 30 days since purchase or the item was marked as final sale. Would you like to speak with a customer service representative?`;
              nextState = { flow: 'general', step: 0, data: {} };
            }
          } else {
            botResponse = "That doesn't look like a valid order ID. Order IDs typically follow the format SNT-123456. Could you please check and try again?";
            nextState = { flow: 'refund', step: 1, data };
          }
        }
        break;
        
      case 'exchange':
        if (step === 1) {
          // First, collect order ID
          if (userInput.match(/^SNT-\d{6}$/i)) {
            botResponse = "Thanks for providing your order ID. Could you please tell me the reason for the exchange?";
            nextState = { flow: 'exchange', step: 2, data: { ...data, orderId: userInput } };
          } else {
            botResponse = "That doesn't look like a valid order ID. Order IDs typically follow the format SNT-123456. Could you please check and try again?";
            nextState = { flow: 'exchange', step: 1, data };
          }
        } else if (step === 2) {
          // Now, collect the reason
          const exchangeResult = initiateExchange(data.orderId || '', userInput);
          if (exchangeResult.success) {
            botResponse = `I've initiated the exchange for order ${data.orderId} due to "${userInput}". You'll receive a confirmation email with next steps. Is there anything else I can help you with?`;
            nextState = { flow: 'initial', step: 0, data: {} };
          } else {
            botResponse = `I'm sorry, but I couldn't process the exchange for order ${data.orderId}. ${exchangeResult.message} Would you like to speak with a customer service representative?`;
            nextState = { flow: 'general', step: 0, data: {} };
          }
        }
        break;
        
      case 'track':
        // Handle order tracking
        if (step === 1) {
          // Check if input looks like an order ID or email
          if (userInput.match(/^SNT-\d{6}$/i) || userInput.includes('@')) {
            const trackingInfo = getOrderTracking(userInput);
            if (trackingInfo.found) {
              botResponse = trackingInfo.message;
            } else {
              botResponse = `I couldn't find any order with the information provided. Please check and try again, or provide a different order ID or email.`;
            }
            nextState = { flow: 'initial', step: 0, data: {} };
          } else {
            botResponse = "That doesn't look like a valid order ID or email. Order IDs typically follow the format SNT-123456. Could you please check and try again?";
            nextState = { flow: 'track', step: 1, data };
          }
        }
        break;
        
      case 'status':
        // Handle refund/exchange status check
        if (step === 1) {
          if (userInput.match(/^SNT-\d{6}$/i)) {
            // Check both refund and exchange status
            const refundStatus = getRefundStatus(userInput);
            const exchangeStatus = getExchangeStatus(userInput);
            
            if (refundStatus.active) {
              botResponse = refundStatus.message;
            } else if (exchangeStatus.active) {
              botResponse = exchangeStatus.message;
            } else {
              botResponse = `I couldn't find any active refund or exchange requests for order ${userInput}. Would you like to initiate one now?`;
            }
            nextState = { flow: 'initial', step: 0, data: {} };
          } else {
            botResponse = "That doesn't look like a valid order ID. Order IDs typically follow the format SNT-123456. Could you please check and try again?";
            nextState = { flow: 'status', step: 1, data };
          }
        }
        break;
        
      case 'general':
        // Handle general queries
        if (userInput.toLowerCase().includes('thanks') || userInput.toLowerCase().includes('thank you')) {
          botResponse = "You're welcome! Is there anything else I can help you with today?";
        } else if (userInput.toLowerCase().includes('human') || userInput.toLowerCase().includes('agent') || userInput.toLowerCase().includes('representative')) {
          botResponse = "I'm connecting you with a human agent. A customer service representative will reach out to you soon.";
          toast({
            title: "Support Request Sent",
            description: "A customer service representative will contact you soon.",
          });
        } else {
          botResponse = "I'm not sure I understood that. Can you please try rephrasing or choose one of our support options? I'm here to help with product information, refunds, exchanges, order tracking, and status checks.";
        }
        nextState = { flow: 'initial', step: 0, data: {} };
        break;
    }
    
    // Add the bot response
    addMessage(botResponse, 'assistant');
    setConversationState(nextState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 sm:w-96 overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-5">
          <div className="bg-navy text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Chat with SNITCH AI Assistant</h3>
              {lastUpdated && (
                <p className="text-xs text-white/80">
                  Last updated: {format(lastUpdated, 'MMM d, p')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={resetChat}
                title="Reset Chat"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleChat}
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="p-4 bg-gray-50 flex-grow h-[350px] max-h-[350px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "px-4 py-2 rounded-lg max-w-[80%] animate-fade-in",
                    message.sender === 'user' 
                      ? "bg-burgundy text-white ml-auto" 
                      : "bg-gray-200 text-gray-800"
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-[80%] animate-fade-in">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Show quick actions only if there are no or few messages */}
            {messages.length <= 1 && (
              <div className="mt-4 space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full text-left px-3 py-2 bg-white hover:bg-gray-100 rounded-md border border-gray-200 flex items-center space-x-2 transition-colors animate-fade-in"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Smart suggestions after messages */}
            {messages.length > 1 && smartSuggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
                {smartSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSmartSuggestion(suggestion)}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-sm transition-colors text-burgundy"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            )}

            {/* Show "Talk to a human" button after some interaction */}
            {messages.length > 3 && (
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={escalateToHuman}
                  className="text-burgundy border-burgundy hover:bg-burgundy/10 animate-fade-in"
                >
                  Talk to a human agent
                </Button>
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex">
              <Input
                type="text"
                placeholder="Type your message..."
                className="flex-grow rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-navy"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                className="rounded-l-none bg-burgundy hover:bg-burgundy/90"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
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

// Backend placeholder functions

// Mock product database
const productDatabase = {
  'black t-shirt': {
    name: 'Black T-Shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Cotton blend',
    stretchable: true,
    availability: true,
  },
  'blue jeans': {
    name: 'Blue Jeans',
    sizes: ['28', '30', '32', '34', '36'],
    material: 'Denim',
    stretchable: true, 
    availability: true,
  },
  'white sneakers': {
    name: 'White Sneakers',
    sizes: ['7', '8', '9', '10', '11'],
    material: 'Leather and canvas',
    stretchable: false,
    availability: false,
  }
};

// Get product information
function getProductInfo(productName: string): string {
  const normalizedName = productName.toLowerCase();
  
  // Check for partial matches
  for (const key in productDatabase) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      const product = productDatabase[key as keyof typeof productDatabase];
      
      return `${product.name} is made of ${product.material}. It's available in sizes ${product.sizes.join(', ')}. ${
        product.stretchable ? "It's stretchable." : "It's not stretchable."
      } ${product.availability ? "It's currently in stock." : "It's currently out of stock."}`;
    }
  }
  
  return `I don't have specific information about ${productName}. Would you like me to check with our team and get back to you?`;
}

// Check refund eligibility
function checkRefundEligibility(orderId: string): boolean {
  // Mock logic - even order numbers are eligible, odd are not
  const orderNumber = parseInt(orderId.replace(/\D/g, ''));
  return orderNumber % 2 === 0;
}

// Initiate refund
function initiateRefund(orderId: string): { success: boolean; message: string } {
  // Mock refund processing logic
  if (checkRefundEligibility(orderId)) {
    return {
      success: true,
      message: `Refund initiated for order ${orderId}. You'll receive the amount within 5-7 business days.`
    };
  } else {
    return {
      success: false,
      message: 'This order is not eligible for a refund.'
    };
  }
}

// Initiate exchange
function initiateExchange(orderId: string, reason: string): { success: boolean; message: string } {
  // For demo purposes, we'll accept exchanges for orders with digits that sum to even numbers
  const digits = orderId.replace(/\D/g, '').split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  
  if (sum % 2 === 0) {
    return {
      success: true,
      message: `Exchange initiated for order ${orderId}.`
    };
  } else {
    return {
      success: false,
      message: 'This item is outside the exchange window of 15 days.'
    };
  }
}

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
  const orderNum = parseInt(orderId.replace(/\D/g, '));
  
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
