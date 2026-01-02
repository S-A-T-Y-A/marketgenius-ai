
import React, { useState } from 'react';
import { ContentType, Tone, MarketingContent, User } from '../types';
import { generateMarketingContent, generateMarketingImage, generateMarketingVideo } from '../services/geminiService';

interface GeneratorProps {
  user: User;
  onContentGenerated: (content: MarketingContent) => void;
}

const Generator: React.FC<GeneratorProps> = ({ user, onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState<'image' | 'video' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [result, setResult] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [type, setType] = useState<ContentType>(ContentType.SOCIAL_MEDIA);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PERSUASIVE);

  const suggestions = [
    "Luxury skincare line for men",
    "Eco-friendly home cleaning pod",
    "SaaS tool for remote recruiters",
    "Smart water bottle that tracks intake"
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setVideoUrl(null);
    try {
      const { text } = await generateMarketingContent(type, topic, tone, 'Medium');
      setResult(text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenImage = async () => {
    setMediaLoading('image');
    try {
      const url = await generateMarketingImage(topic);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMediaLoading(null);
    }
  };

  const handleGenVideo = async () => {
    setMediaLoading('video');
    try {
      const url = await generateMarketingVideo(topic, (msg) => setStatusMsg(msg));
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMediaLoading(null);
      setStatusMsg('');
    }
  };

  const isPremium = user.role === 'premium';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Input Side */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">1</div>
          Campaign Setup
        </h2>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Format</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(ContentType).map((cType) => (
                <button
                  key={cType}
                  type="button"
                  onClick={() => setType(cType)}
                  className={`px-4 py-3 text-sm rounded-xl border-2 transition-all font-semibold ${
                    type === cType 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm' 
                      : 'border-slate-100 text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  {cType}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Product/Service Topic</label>
            <textarea
              required
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-sm leading-relaxed transition-all"
              placeholder="What are we promoting today?"
            />
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Popular Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button key={i} type="button" onClick={() => setTopic(s)} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] rounded-full border border-slate-200 hover:bg-white hover:border-indigo-500 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? 'Analyzing Market...' : 'Generate Campaign'}
          </button>
        </form>
      </div>

      {/* Output Side (The "Magic" Part) */}
      <div className="flex flex-col gap-6">
        <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative border-4 border-slate-800">
          {/* Visual Platform Header */}
          <div className="px-6 py-4 bg-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">{type} PREVIEW</span>
            <div className="w-8" />
          </div>

          {/* Platform Mockup Rendering */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-100">
            {result ? (
              <div className="max-w-md mx-auto animate-in zoom-in-95 duration-300">
                {/* Instagram/LinkedIn Style Post */}
                {type === ContentType.SOCIAL_MEDIA && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600" />
                      <span className="font-bold text-xs">your_brand</span>
                    </div>
                    <div className="aspect-square bg-slate-100 relative group">
                      {mediaLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                          <p className="text-xs font-bold text-indigo-600 animate-pulse uppercase tracking-widest">{statusMsg || 'Generating Visual...'}</p>
                        </div>
                      ) : videoUrl ? (
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                      ) : imageUrl ? (
                        <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-300">
                          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <p className="text-xs uppercase font-bold">No Visual Asset</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3 mb-3">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </div>
                      <div className="text-[13px] text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">
                        {result}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Style Post */}
                {type === ContentType.EMAIL && (
                  <div className="bg-white rounded-sm shadow-md border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b bg-slate-50 text-[11px] text-slate-500 font-medium">
                      <p>From: MarketGenius AI &lt;campaign@brand.com&gt;</p>
                      <p>Subject: {result?.split('\n')[0]?.replace('Subject:', '') || 'New Campaign'}</p>
                    </div>
                    <div className="p-8">
                      {imageUrl && <img src={imageUrl} className="w-full h-48 object-cover rounded mb-6" alt="Header" />}
                      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {result}
                      </div>
                    </div>
                  </div>
                )}

                {/* Default/Ad View */}
                {(type === ContentType.AD_COPY || type === ContentType.BLOG_OUTLINE) && (
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                     <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded mb-4 inline-block font-bold">SPONSORED</span>
                     <div className="text-slate-800 whitespace-pre-wrap font-medium">{result}</div>
                     {imageUrl && <img src={imageUrl} className="mt-6 w-full rounded-lg" alt="Ad" />}
                   </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                <div className="w-20 h-20 bg-slate-200 rounded-3xl animate-pulse" />
                <p className="font-bold uppercase tracking-widest text-sm">Awaiting Instructions...</p>
              </div>
            )}
          </div>

          {/* Action Bar for Assets */}
          {result && (
            <div className="p-4 bg-slate-800 border-t border-slate-700 grid grid-cols-2 gap-3">
              <button 
                onClick={handleGenImage}
                disabled={!!mediaLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-tighter flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {mediaLoading === 'image' ? 'Generating...' : 'Generate Image'}
              </button>
              <button 
                onClick={handleGenVideo}
                disabled={!!mediaLoading || !isPremium}
                className="bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-tighter flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {mediaLoading === 'video' ? 'Processing...' : 'Generate Video (PRO)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
