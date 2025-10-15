import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '../types';
import ImageWithLoader from './ImageWithLoader';
import ActionButton from './ActionButton';
import { XIcon, HeartIcon, ChatIcon } from './icons';

interface ProfileCardProps {
  profile: Profile;
  isMatch: boolean;
  onLike: () => void;
  onReject: () => void;
  onChat: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isMatch, onLike, onReject, onChat }) => {
  const [actionsVisible, setActionsVisible] = useState(false);

  // Use a separate handler to allow buttons to stop propagation
  const handleCardClick = () => {
    setActionsVisible(prev => !prev);
  };
  
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
      e.stopPropagation(); // Prevent card click from firing
      setActionsVisible(false); // Hide actions after one is chosen
      action();
  };

  return (
    <div 
        className="relative aspect-[3/4] w-full rounded-2xl shadow-lg overflow-hidden cursor-pointer" 
        onClick={handleCardClick}
    >
      <ImageWithLoader src={profile.imageUrl} alt={profile.name} className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
        <h2 className="text-3xl font-bold">{profile.name}, {profile.age}</h2>
        <p className="mt-2 text-lg">{profile.bio}</p>
      </div>

      <AnimatePresence>
        {actionsVisible && (
          <motion.div 
            className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ActionButton onClick={(e) => handleActionClick(e, onReject)} ariaLabel="Reject" className="bg-white text-rose-500 ring-rose-300">
                <XIcon className="w-10 h-10" />
            </ActionButton>
            
            {isMatch ? (
                <ActionButton onClick={(e) => handleActionClick(e, onChat)} ariaLabel="Chat" className="bg-white text-blue-500 ring-blue-300">
                    <ChatIcon className="w-8 h-8" />
                </ActionButton>
            ) : (
                <ActionButton onClick={(e) => handleActionClick(e, onLike)} ariaLabel="Like" className="bg-white text-teal-500 ring-teal-300">
                    <HeartIcon className="w-10 h-10" />
                </ActionButton>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileCard;