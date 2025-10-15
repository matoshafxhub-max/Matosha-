export interface Profile {
  id: number | string;
  name: string;
  age: number;
  bio: string;
  imageUrl: string;
  gender?: 'male' | 'female';
  interestedIn?: 'male' | 'female';
  interests?: string[];
}

export interface Message {
  id: number;
  sender: 'me' | 'them';
  text?: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Match {
  id: number | string;
  profile: Profile;
  messages: Message[];
  unread?: boolean;
}

export interface UserData {
  email: string;
  password?: string; // Storing password in localStorage is not secure. For demo purposes only.
  profile: Profile;
  matches: Match[];
  swipedProfileIds: (number | string)[];
  isProfileVisible: boolean;
}

export interface AllUsersData {
  [email: string]: UserData;
}