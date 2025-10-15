import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { PROFILES } from './constants';
import { Profile, Match, Message } from './types';
import { generateOpeningLine } from './services/geminiService';

// Components
import AuthScreen from './components/AuthScreen';
import MyProfileScreen from './components/MyProfileScreen';
import Header from './components/Header';
import ChatListScreen from './components/ChatListScreen';
import ChatScreen from './components/ChatScreen';
import OpeningLineModal from './components/OpeningLineModal';
import ProfileCard from './components/ProfileCard';

type Screen = 'swipe' | 'chat' | 'profile';
type ChatSubScreen = { screen: 'list' } | { screen: 'conversation'; matchId: number | string };

const App: React.FC = () => {
  const { user, userData, allUsersData, login, logout, updateUserData, isLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('swipe');
  const [chatSubScreen, setChatSubScreen] = useState<ChatSubScreen>({ screen: 'list' });

  // AI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [openingLine, setOpeningLine] = useState('');
  
  // Mark chat as read when conversation is opened
  useEffect(() => {
    if (chatSubScreen.screen === 'conversation' && userData) {
        const matchId = chatSubScreen.matchId;
        const match = userData.matches.find(m => m.id === matchId);

        if (match && match.unread) {
            const updatedMatches = userData.matches.map(m =>
                m.id === matchId ? { ...m, unread: false } : m
            );
            updateUserData({ ...userData, matches: updatedMatches });
        }
    }
  }, [chatSubScreen, userData, updateUserData]);

  const unswipedProfiles = useMemo(() => {
    if (!userData || !userData.profile.gender || !userData.profile.interestedIn) return [];
    
    const otherUsersProfiles = Object.values(allUsersData)
      .filter((u: any) => u.email !== userData.email && u.isProfileVisible)
      .map((u: any) => u.profile);

    const allVisibleProfiles = [...PROFILES, ...otherUsersProfiles];
    const uniqueProfiles = allVisibleProfiles.filter((p, index, self) => 
        index === self.findIndex((t) => (t.id === p.id))
    );

    return uniqueProfiles.filter(p => 
        p.id !== userData.profile.id && 
        !userData.swipedProfileIds.includes(p.id) &&
        p.gender === userData.profile.interestedIn &&
        (p.interestedIn === userData.profile.gender || !p.interestedIn)
    );
  }, [userData, allUsersData]);

  const handleLike = (profileId: number | string) => {
    if (!userData) return;
    const swipedProfileIds = [...userData.swipedProfileIds, profileId];
    const likedProfile = [...PROFILES, ...Object.values(allUsersData).map(u => u.profile)].find(p => p.id === profileId);

    if (likedProfile) {
        const newMatch: Match = {
          id: profileId,
          profile: likedProfile,
          messages: [],
          unread: false,
        };
        const matches = [...userData.matches, newMatch];
        updateUserData({ ...userData, swipedProfileIds, matches });
        handleGenerateLine(likedProfile);
    } else {
        updateUserData({ ...userData, swipedProfileIds });
    }
  };
  
  const handleReject = (profileId: number | string) => {
     if (!userData) return;
     const swipedProfileIds = [...userData.swipedProfileIds, profileId];
     updateUserData({ ...userData, swipedProfileIds });
  };

  const handleGenerateLine = async (profile: Profile) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setOpeningLine('');
    try {
        const line = await generateOpeningLine(profile.bio);
        setOpeningLine(line);
    } catch (error) {
        console.error("Failed to generate opening line:", error);
        setOpeningLine("Habari! Wasifu wako umenivutia sana.");
    } finally {
        setIsModalLoading(false);
    }
  };

  const handleSendMessage = (matchId: number | string, messageContent: { text?: string; imageUrl?: string }) => {
    if (!userData) return;
    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      ...messageContent,
      timestamp: new Date(),
    };

    const updatedMatches = userData.matches.map(match => {
      if (match.id === matchId) {
        return { ...match, messages: [...match.messages, newMessage] };
      }
      return match;
    });

    updateUserData({ ...userData, matches: updatedMatches });
    
    setTimeout(() => {
        const replyMessage: Message = {
            id: Date.now() + 1,
            sender: 'them',
            text: "Asante kwa ujumbe wako! Nimefurahi kuongea na wewe.",
            timestamp: new Date(),
        };
        const matchesWithReply = updatedMatches.map(match => {
            if (match.id === matchId) {
                return { ...match, messages: [...match.messages, replyMessage], unread: true };
            }
            return match;
        });
        updateUserData({ ...userData, matches: matchesWithReply });
    }, 2000);
  };

  const handleSaveProfile = (updates: { profile: Profile, isProfileVisible: boolean }) => {
    if (!userData) return;
    const newUserData = { ...userData, profile: updates.profile, isProfileVisible: updates.isProfileVisible };
    updateUserData(newUserData);
    setScreen('swipe');
  };

  const handleStartChat = (matchId: number | string) => {
    setScreen('chat');
    setChatSubScreen({ screen: 'conversation', matchId });
  };
  
  const renderContent = () => {
    if (!userData) return null;

    if (screen === 'profile') {
      return <MyProfileScreen userData={userData} onSave={handleSaveProfile} onLogout={logout} isSetupMode={false} />;
    }

    if (screen === 'chat') {
      if (chatSubScreen.screen === 'list') {
        return <ChatListScreen matches={userData.matches} onSelectChat={handleStartChat} />;
      }
      const match = userData.matches.find(m => m.id === chatSubScreen.matchId);
      if (match) {
        return <ChatScreen match={match} onSendMessage={handleSendMessage} onBack={() => setChatSubScreen({ screen: 'list' })} />;
      }
    }

    const mainContentClass = "h-full pt-16 overflow-y-auto bg-slate-100 p-2 md:p-4";

    return (
      <main className={mainContentClass}>
         <div className="space-y-4">
            {unswipedProfiles.length > 0 ? (
              unswipedProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onLike={() => handleLike(profile.id)}
                  onReject={() => handleReject(profile.id)}
                  onChat={() => handleStartChat(profile.id)}
                  isMatch={userData.matches.some(m => m.id === profile.id)}
                />
              ))
            ) : (
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-700">Hakuna Watu Zaidi</h2>
                <p className="text-slate-500 mt-2">Umeona wasifu wote. Rudi tena baadaye!</p>
              </div>
            )}
        </div>
      </main>
    );
  };
  
  const showMainHeader = !(screen === 'chat' && chatSubScreen.screen === 'conversation');

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-slate-100"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500"></div></div>;
  }

  if (!user || !userData) {
    return <AuthScreen onLogin={login} />;
  }

  if (!userData.profile.gender || !userData.profile.interestedIn) {
    return <MyProfileScreen userData={userData} onSave={handleSaveProfile} onLogout={logout} isSetupMode={true} />;
  }
  
  const unreadCount = userData.matches.filter(m => m.unread).length;

  return (
    <div className="max-w-lg mx-auto h-screen bg-white shadow-lg overflow-hidden relative">
      {showMainHeader && <Header activeScreen={screen} onNavigate={setScreen} unreadCount={unreadCount} />}
      {renderContent()}
      <OpeningLineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isModalLoading}
        openingLine={openingLine}
      />
    </div>
  );
};

export default App;