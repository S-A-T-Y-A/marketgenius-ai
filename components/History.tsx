
import React, { useState } from 'react';
import { MarketingContent } from '../types';

interface HistoryProps {
  history: MarketingContent[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketingContent | null>(null);

  const filteredHistory = history.filter(item => 
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Archive</h1>
          <p className="text-slate-500">Your collection of marketing assets.</p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer overflow-hidden group"
            onClick={() => setSelectedItem(item)}
          >
            {item.imageUrl && (
              <div className="h-32 overflow-hidden border-b border-slate-100">
                <img src={item.imageUrl} alt="Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-bold uppercase tracking-wider">{item.type}</span>
                <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{item.topic}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 mb-4">{item.content}</p>
              <div className="flex items-center text-indigo-600 text-xs font-bold">
                View Full Assets
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95">
            {selectedItem.imageUrl && (
              <div className="md:w-1/2 bg-slate-100 h-64 md:h-auto overflow-hidden">
                <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt="Marketing visual" />
              </div>
            )}
            <div className={`flex-1 flex flex-col min-w-0 ${selectedItem.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{selectedItem.topic}</h2>
                  <p className="text-xs text-indigo-600 font-semibold">{selectedItem.type}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-sm md:text-base">
                  {selectedItem.content}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.content);
                    alert('Copied!');
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-sm"
                 >
                   Copy Text
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
