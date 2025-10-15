import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserData, Profile } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { CameraIcon } from './icons';

interface MyProfileScreenProps {
  userData: UserData;
  onSave: (updates: { profile: Profile; isProfileVisible: boolean }) => void;
  onLogout: () => void;
  isSetupMode: boolean;
}

const MyProfileScreen: React.FC<MyProfileScreenProps> = ({ userData, onSave, onLogout, isSetupMode }) => {
  const [profile, setProfile] = useState<Profile>(userData.profile);
  const [isVisible, setIsVisible] = useState(userData.isProfileVisible);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProfileComplete = profile.name && profile.age >= 18 && profile.bio && profile.gender && profile.interestedIn;

  const handleSave = () => {
    if (isSetupMode && !isProfileComplete) {
      alert("Tafadhali jaza taarifa zote muhimu (jina, umri, jinsia, na unayemtafuta).");
      return;
    }
    onSave({ profile, isProfileVisible: isVisible });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) || 18 : value }));
  };

  const handleGenderSelect = (field: 'gender' | 'interestedIn', value: 'male' | 'female') => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setProfile(prev => ({ ...prev, imageUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-teal-50 p-4 pt-20 overflow-y-auto">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">{isSetupMode ? 'Kamilisha Wasifu Wako' : 'Wasifu Wangu'}</h1>
        
        <div className="relative w-36 h-36 mx-auto mb-6 group" onClick={() => fileInputRef.current?.click()}>
          <ImageWithLoader src={profile.imageUrl} alt={profile.name} className="w-full h-full rounded-full shadow-lg" />
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <CameraIcon className="w-8 h-8"/>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>

        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md p-4">
            <label htmlFor="name" className="block text-sm font-bold text-slate-600 mb-1">Jina</label>
            <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} className="mt-1 block w-full p-3 bg-slate-100 rounded-md border-transparent text-black focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500" required />
          </motion.div>

          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md p-4">
            <label htmlFor="age" className="block text-sm font-bold text-slate-600 mb-1">Umri</label>
            <input type="number" name="age" id="age" value={profile.age} onChange={handleInputChange} className="mt-1 block w-full p-3 bg-slate-100 rounded-md border-transparent text-black focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500" required min="18"/>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md p-4">
            <label className="block text-sm font-bold text-slate-600 mb-2">Jinsia Yangu</label>
            <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => handleGenderSelect('gender', 'male')} className={`p-3 rounded-lg font-semibold transition-colors ${profile.gender === 'male' ? 'bg-teal-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>Mwanaume</button>
                <button type="button" onClick={() => handleGenderSelect('gender', 'female')} className={`p-3 rounded-lg font-semibold transition-colors ${profile.gender === 'female' ? 'bg-teal-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>Mwanamke</button>
            </div>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md p-4">
            <label className="block text-sm font-bold text-slate-600 mb-2">Natafuta</label>
             <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => handleGenderSelect('interestedIn', 'male')} className={`p-3 rounded-lg font-semibold transition-colors ${profile.interestedIn === 'male' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>Mwanaume</button>
                <button type="button" onClick={() => handleGenderSelect('interestedIn', 'female')} className={`p-3 rounded-lg font-semibold transition-colors ${profile.interestedIn === 'female' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>Mwanamke</button>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md p-4">
            <label htmlFor="bio" className="block text-sm font-bold text-slate-600 mb-1">Kuhusu Mimi</label>
            <textarea name="bio" id="bio" rows={4} value={profile.bio} onChange={handleInputChange} className="mt-1 block w-full p-3 bg-slate-100 rounded-md border-transparent text-black focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500" required maxLength={200}/>
          </motion.div>

          {!isSetupMode && (
            <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
              <span className="font-bold text-slate-600">Onyesha Wasifu Wangu</span>
              <button onClick={() => setIsVisible(!isVisible)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVisible ? 'bg-teal-500' : 'bg-slate-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>

      <div className="mt-8 space-y-3 pb-4">
        <button onClick={handleSave} disabled={isSetupMode && !isProfileComplete} className="w-full py-4 px-4 bg-teal-500 text-white font-bold rounded-xl text-lg hover:bg-teal-600 transition-all duration-200 disabled:bg-teal-300 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg">
          {isSetupMode ? 'Endelea' : 'Hifadhi Mabadiliko'}
        </button>
        {!isSetupMode && (
          <button onClick={onLogout} className="w-full py-3 px-4 bg-white text-rose-500 font-bold rounded-xl text-lg hover:bg-rose-50 transition-colors">
            Toka
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfileScreen;