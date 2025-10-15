import React from 'react';
import { Match } from '../types';
import ImageWithLoader from './ImageWithLoader';

interface ChatListScreenProps {
  matches: Match[];
  onSelectChat: (matchId: number | string) => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ matches, onSelectChat }) => {
  const getLastMessage = (match: Match) => {
    if (match.messages.length === 0) {
      return { text: `Umelingana na ${match.profile.name}. Anzisha mazungumzo!`, time: '' };
    }
    const lastMsg = match.messages[match.messages.length - 1];
    const time = new Date(lastMsg.timestamp).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
    const text = lastMsg.text ? (lastMsg.sender === 'me' ? `Wewe: ${lastMsg.text}` : lastMsg.text) : 'Picha';
    return { text: text.length > 30 ? text.substring(0, 30) + '...' : text, time };
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-16 text-center text-slate-500 p-4">
        <h2 className="text-xl font-semibold">Hakuna Ulinganifu Bado</h2>
        <p className="mt-2">Endelea kutelezesha kidole ili kupata mtu!</p>
      </div>
    );
  }

  return (
    <div className="pt-16 h-full overflow-y-auto">
      <div className="p-2">
        <h1 className="text-2xl font-bold text-slate-800 p-2">Ulinganifu</h1>
        <ul>
          {matches.map((match) => {
            const lastMessage = getLastMessage(match);
            return (
              <li key={match.id}>
                <button
                  onClick={() => onSelectChat(match.id)}
                  className="flex items-center w-full p-3 text-left rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="relative w-14 h-14">
                    <ImageWithLoader src={match.profile.imageUrl} alt={match.profile.name} className="w-full h-full rounded-full" />
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-slate-800">{match.profile.name}</h3>
                      <span className="text-xs text-slate-400">{lastMessage.time}</span>
                    </div>
                    <p className="text-sm text-slate-500">{lastMessage.text}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatListScreen;
