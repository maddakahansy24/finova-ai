import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ChatMessage } from '../../types';
import {
  generateAssistantResponse,
  SUGGESTED_QUESTIONS,
  FINANCIAL_SAFETY_DISCLAIMER,
  ChatContext,
} from '../../services/finWiseChatbot';
import { ChatMessageItem } from './ChatMessageItem';
import {
  Send,
  Trash2,
  Sparkles,
  Bot,
  Shield,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const { summary, budget, transactions, settings } = useFinance();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-01',
      sender: 'assistant',
      content:
        `Hello ${settings.userName}! I am **FinWise Assistant**, your personal AI finance guide.\n\n` +
        `I am connected directly to your current financial ledger (Total Balance: **₹${summary.totalBalance.toLocaleString('en-IN')}**, Recorded Expenses: **₹${summary.totalExpenses.toLocaleString('en-IN')}**).\n\n` +
        `You can ask me how to optimize your spending, understand budgeting strategies like the 50/30/20 rule, plan emergency savings, or explore investment vehicles like Fixed Deposits and Mutual Funds. How can I assist your financial journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (messageText: string = input) => {
    const trimmed = messageText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now().toString(),
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Context for Assistant
    const context: ChatContext = {
      summary,
      budget,
      transactions,
      userName: settings.userName,
    };

    // Realistic typing delay for natural conversation
    setTimeout(() => {
      const response = generateAssistantResponse(trimmed, context);

      const assistantMsg: ChatMessage = {
        id: 'asst-' + Date.now().toString(),
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextUsed: response.contextUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-cleared-' + Date.now(),
        sender: 'assistant',
        content: `Conversation refreshed! How can I assist you with your budget or financial queries, ${settings.userName}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800/80 light:border-slate-200 flex items-center justify-between bg-slate-900/60 light:bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0D1424] light:bg-white rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0D1424]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white light:text-slate-900">
                FinWise Assistant
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Your friendly personal finance guide.</p>
          </div>
        </div>

        {/* Clear Chat Button */}
        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          title="Clear Conversation History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Safety Notice Bar */}
      <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-500/20 flex items-center gap-2 text-[11px] text-slate-300">
        <Shield className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <span className="truncate">{FINANCIAL_SAFETY_DISCLAIMER}</span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic px-3 py-2 bg-slate-900/50 rounded-xl max-w-[200px] border border-slate-800 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>FinWise Assistant analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Carousel / Chips */}
      <div className="px-4 py-2 border-t border-slate-800/60 light:border-slate-200 bg-slate-900/30 light:bg-slate-50 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Suggestions:</span>
        </div>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="flex-shrink-0 text-[11px] font-medium px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 border border-slate-700/60 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-800/80 light:border-slate-200 bg-slate-900/60 light:bg-slate-50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask a question about your budget, loans, investments, or savings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isTyping
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          FinWise AI uses deterministic telemetry and conversational financial intelligence. Press Enter to send.
        </p>
      </div>
    </div>
  );
};
