
import React, { useState, useEffect } from 'react';
import { User, MarketingContent } from './types';
import { storageService } from './services/storageService';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import History from './components/History';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<MarketingContent[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storageService.getUser();
    const savedHistory = storageService.getHistory();
    if (savedUser) setUser(savedUser);
    setHistory(savedHistory);
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    storageService.saveUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    storageService.clearUser();
    setActiveTab('dashboard');
  };

  const handleContentGenerated = (newContent: MarketingContent) => {
    const updatedHistory = storageService.addContent(newContent);
    setHistory(updatedHistory);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          user={user} 
          history={history} 
          onGenerateClick={() => setActiveTab('generate')} 
        />
      )}
      {activeTab === 'generate' && (
        <Generator user={user} onContentGenerated={handleContentGenerated} />
      )}
      {activeTab === 'history' && (
        <History history={history} />
      )}
    </Layout>
  );
};

export default App;
