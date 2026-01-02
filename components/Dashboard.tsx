
import React from 'react';
import { User, MarketingContent } from '../types';

interface DashboardProps {
  user: User;
  history: MarketingContent[];
  onGenerateClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, history, onGenerateClick }) => {
  const stats = [
    { label: 'Total Generated', value: history.length, color: 'bg-blue-500' },
    { label: 'Plan Status', value: user.role.toUpperCase(), color: 'bg-emerald-500' },
    { label: 'This Month', value: history.filter(h => h.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000).length, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hello, {user.name}! 👋</h1>
          <p className="text-slate-500">Welcome back to your marketing command center.</p>
        </div>
        <button
          onClick={onGenerateClick}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Content
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold text-slate-900`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Recent Creations</h2>
          {history.length > 0 && (
            <span className="text-indigo-600 text-sm font-medium cursor-pointer">View All</span>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {history.length > 0 ? (
            history.slice(0, 5).map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-slate-900 truncate max-w-xs">{item.topic}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{item.type}</span>
                    <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p>You haven't generated any content yet.</p>
              <button onClick={onGenerateClick} className="text-indigo-600 font-medium mt-2">Create your first post</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
