
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'generate', name: 'Generator', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'history', name: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
          <span className="text-xl font-bold tracking-tight">MarketGenius</span>
        </div>
        
        <nav className="flex-1 px-4 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                activeTab === item.id ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-indigo-300 capitalize">{user?.role} Plan</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left text-sm text-indigo-300 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Mobile */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-900">MarketGenius</span>
          <button onClick={onLogout} className="text-sm text-slate-500">Sign Out</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
