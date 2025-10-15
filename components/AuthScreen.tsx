import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: (email: string, password?: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onLogin(email.trim(), password.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-bold text-slate-800 mb-2">Pendo la Bongo</h1>
        <p className="text-xl text-slate-600 mb-8">Tafuta pendo lako la maisha.</p>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-slate-700">Karibu!</h2>
          <div>
             <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Barua pepe"
                className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg py-3 px-4 text-slate-900 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                required
                aria-label="Email"
              />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nenosiri"
              className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg py-3 px-4 text-slate-900 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              required
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            disabled={!email.trim() || !password.trim()}
            className="w-full py-3 px-4 bg-teal-500 text-white font-bold rounded-lg text-lg hover:bg-teal-600 transition-colors duration-200 disabled:bg-teal-300 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Ingia / Jisajili
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;