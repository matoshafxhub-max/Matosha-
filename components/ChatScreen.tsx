import React, { useState, useRef, useEffect } from 'react';
import { Match } from '../types';
import { ArrowLeftIcon, PaperclipIcon, SendIcon } from './icons';
import ImageWithLoader from './ImageWithLoader';

interface ChatScreenProps {
  match: Match;
  onSendMessage: (matchId: number | string, message: { text?: string; imageUrl?: string }) => void;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ match, onSendMessage, onBack }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [match.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(match.id, { text: message.trim() });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center p-2 bg-white/80 backdrop-blur-sm shadow-sm z-30 h-16 border-b border-slate-200">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Back to chats">
          <ArrowLeftIcon className="w-6 h-6 text-slate-700" />
        </button>
        <ImageWithLoader src={match.profile.imageUrl} alt={match.profile.name} className="w-10 h-10 rounded-full mx-3" />
        <h2 className="font-bold text-slate-800">{match.profile.name}</h2>
      </header>

      {/* Messages */}
      <main className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
        {match.messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
             {msg.sender === 'them' && (
                <ImageWithLoader src={match.profile.imageUrl} alt={match.profile.name} className="w-8 h-8 rounded-full flex-shrink-0" />
             )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
              <p className="break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="flex-shrink-0 p-2 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <button type="button" className="p-2 rounded-full hover:bg-slate-100">
            <PaperclipIcon className="w-6 h-6 text-slate-500" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Andika ujumbe..."
            className="flex-grow bg-slate-100 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button type="submit" className="p-3 rounded-full bg-teal-500 text-white hover:bg-teal-600 disabled:bg-teal-300 transition-colors" disabled={!message.trim()}>
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;