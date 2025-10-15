import { useState, useEffect, useCallback } from 'react';
import { UserData, AllUsersData, Profile } from '../types';

const ALL_USERS_STORAGE_KEY = 'pendo-la-bongo-all-users';
const CURRENT_USER_STORAGE_KEY = 'pendo-la-bongo-current-user-email';

const getInitialAllUsers = (): AllUsersData => {
  try {
    const data = localStorage.getItem(ALL_USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to parse all users data from localStorage", error);
    return {};
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null); // This will now be the email
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allUsersData, setAllUsersData] = useState<AllUsersData>(getInitialAllUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserEmail = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedUserEmail && allUsersData[storedUserEmail]) {
        setUser(storedUserEmail);
        setUserData(allUsersData[storedUserEmail]);
      }
    } catch (error) {
      console.error("Failed to read current user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, [allUsersData]);

  const login = (email: string, password?: string) => {
    try {
      let existingUserData = allUsersData[email];
      
      if (existingUserData) {
        // User exists, check password for login
        // NOTE: This is an insecure way to handle passwords and is for demo purposes only.
        if (existingUserData.password !== password) {
          alert("Nenosiri si sahihi.");
          return;
        }
      } else {
        // New user sign-up
        const defaultProfile: Profile = {
          id: email,
          name: email.split('@')[0], // Default name from email
          age: 18,
          bio: 'Karibu Pendo la Bongo! Hariri wasifu wako ili uonekane.',
          imageUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${email.split('@')[0]}`,
          interests: [],
          gender: undefined,
          interestedIn: undefined,
        };
        existingUserData = {
          email,
          password, // Store password
          profile: defaultProfile,
          matches: [],
          swipedProfileIds: [],
          isProfileVisible: false, // Force new users to setup profile
        };
        
        const newAllUsersData = { ...allUsersData, [email]: existingUserData };
        setAllUsersData(newAllUsersData);
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(newAllUsersData));
      }
      
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, email);
      setUser(email);
      setUserData(existingUserData);
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      setUser(null);
      setUserData(null);
    } catch (error)      {
      console.error("Failed to remove user from localStorage", error);
    }
  };
  
  const updateUserData = useCallback((newUserData: UserData) => {
      setUserData(newUserData);
      // Ensure the email is used as the key
      const newAllUsersData = { ...allUsersData, [newUserData.email]: newUserData };
      setAllUsersData(newAllUsersData);
      try {
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(newAllUsersData));
      } catch (error) {
        console.error("Failed to update user data in localStorage", error);
      }
  }, [allUsersData]);

  return { user, userData, allUsersData, login, logout, updateUserData, isLoading };
};