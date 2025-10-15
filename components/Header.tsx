import React from 'react';
import { UserIcon, ChatIcon } from './icons';
import { motion } from 'framer-motion';

type Screen = 'swipe' | 'chat' | 'profile';

interface HeaderProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  unreadCount: number;
}

interface NavButtonProps {
  screen: Screen;
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ activeScreen, onNavigate, unreadCount }) => {
  // FIX: Explicitly type NavButton as a React.FC to ensure TypeScript recognizes it as a component and correctly handles the 'children' prop.
  const NavButton: React.FC<NavButtonProps> = (props) => (
    <button
      onClick={() => onNavigate(props.screen)}
      className={`relative p-3 rounded-full transition-colors duration-300 ${activeScreen === props.screen ? 'text-teal-500 bg-teal-100' : 'text-slate-400 hover:bg-slate-100'}`}
      aria-label={`Go to ${props.screen} screen`}
    >
      {props.children}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto bg-white/80 backdrop-blur-sm shadow-md z-40">
      <nav className="flex items-center justify-between p-2">
        <NavButton screen="profile">
          <UserIcon className="w-7 h-7" />
        </NavButton>

        <motion.div 
            onClick={() => onNavigate('swipe')} 
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-teal-500">
            Pendo
          </h1>
        </motion.div>

        <NavButton screen="chat">
          <ChatIcon className="w-7 h-7" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavButton>
      </nav>
    </header>
  );
};

export default Header;