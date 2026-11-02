import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { Bot, User, Copy, Check, Sparkles, Database } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple formatting helper for markdown-like bold, lists, and tables
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          // Horizontal line or empty
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Table separator row | :--- | :--- |
          if (line.trim().startsWith('|') && line.includes('---')) {
            return null;
          }

          // Table row | col | col |
          if (line.trim().startsWith('|') && line.endsWith('|')) {
            const cells = line
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim());
            return (
              <div
                key={idx}
                className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-mono"
              >
                {cells.map((cell, cIdx) => (
                  <span key={cIdx} className="font-semibold text-slate-300">
                    {cell.replace(/\*\*/g, '')}
                  </span>
                ))}
              </div>
            );
          }

          // Bullet points
          if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ')) {
            const formatted = line.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: parseBoldAndCode(formatted) }} />
              </div>
            );
          }

          // Numbered lists (1. 2. 3.)
          const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-400 font-bold">{numMatch[1]}.</span>
                <span dangerouslySetInnerHTML={{ __html: parseBoldAndCode(numMatch[2]) }} />
              </div>
            );
          }

          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: parseBoldAndCode(line) }}
              className="text-slate-200 light:text-slate-800"
            />
          );
        })}
      </div>
    );
  };

  const parseBoldAndCode = (str: string) => {
    let res = str;
    // bold
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white light:text-slate-900 font-bold">$1</strong>');
    // italic
    res = res.replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>');
    // inline code or formulas
    res = res.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-indigo-300 text-xs font-mono">$1</code>');
    return res;
  };

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } group transition-all animate-in fade-in duration-200`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
          isUser
            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
            : 'bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
              : 'bg-[#131B2E] dark:bg-[#131B2E] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-200 light:text-slate-800 rounded-tl-none'
          }`}
        >
          {/* Header pill if context used */}
          {!isUser && message.contextUsed && (
            <div className="mb-2 pb-1.5 border-b border-slate-800/80 flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>Context: Financial records synced ({message.contextUsed.savingsRate !== undefined ? `${message.contextUsed.savingsRate}% savings rate` : 'telemetry active'})</span>
            </div>
          )}

          {renderFormattedContent(message.content)}

          {/* Copy button */}
          {!isUser && (
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>FinWise Financial Intelligence</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Copy text"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};
