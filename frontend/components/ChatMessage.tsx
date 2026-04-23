import React from 'react';
import { marked } from 'marked';
import { Message } from '../types.js';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Parse markdown safely. We use marked to convert text to HTML.
  const createMarkup = (text: string) => {
    // Configure marked to open links in a new tab
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => {
      return `<a target="_blank" rel="noopener noreferrer" href="${href}" title="${title || ''}">${text}</a>`;
    };
    
    const html = marked(text, { renderer: renderer, breaks: true });
    return { __html: html as string };
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            JC
          </div>
        </div>
      )}
      
      <div 
        className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.text}</div>
        ) : (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={createMarkup(message.text)} 
          />
        )}
        <div className={`text-xs mt-2 ${isUser ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
