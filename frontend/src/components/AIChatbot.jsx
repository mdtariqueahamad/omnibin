import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Leaf } from 'lucide-react';

const WELCOME_MESSAGES = [
  {
    role: 'bot',
    text: "Welcome to OmniBin AI! 🌿 I'm your smart waste management assistant.",
  },
  {
    role: 'bot',
    text: "I can help you with route optimization insights, bin status queries, and waste management analytics. How can I assist you today?",
  },
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(WELCOME_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated bot response (UI-only, future RAG integration point)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Thanks for your message! I'm currently in preview mode. Full AI capabilities with RAG database integration will be available soon. 🚀",
      }]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-bubble"
          id="ai-chatbot-toggle"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 text-eco-deep stroke-[2.5]" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" id="ai-chatbot-window">
          {/* Header */}
          <div className="p-4 border-b border-emerald-500/10 flex items-center justify-between bg-eco-forest/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-eco-emerald to-eco-teal rounded-xl">
                <Leaf className="w-4 h-4 text-eco-deep stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  OmniBin AI
                  <Sparkles className="w-3 h-3 text-eco-emerald" />
                </h3>
                <p className="text-[10px] text-emerald-400/40">Smart Waste Intelligence Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-eco-forest text-emerald-400/50 hover:text-white transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3.5 py-2.5 max-w-[85%] text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'chat-msg-user text-emerald-100'
                      : 'chat-msg-bot text-emerald-200/80'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-emerald-500/10 bg-eco-deep/40">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask OmniBin AI..."
                className="glass-input !py-2.5 !px-3.5 !text-xs !rounded-xl flex-1"
                id="chat-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-eco-emerald/20 border border-eco-emerald/20 text-eco-emerald hover:bg-eco-emerald/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
