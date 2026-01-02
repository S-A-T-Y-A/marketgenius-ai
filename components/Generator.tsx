
import React, { useState } from 'react';
import { ContentType, Tone, MarketingContent, User } from '../types';
import { generateMarketingContent, generateMarketingImage } from '../services/geminiService';

interface GeneratorProps {
  user: User;
  onContentGenerated: (content: MarketingContent) => void;
}

const Generator: React.FC<GeneratorProps> = ({ user, onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [result, setResult] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [type, setType] = useState<ContentType>(ContentType.SOCIAL_MEDIA);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PERSUASIVE);
  const [length, setLength] = useState('Medium (~200 words)');
  const [useSearch, setUseSearch] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setIsEditing(false);

    try {
      const { text } = await generateMarketingContent(type, topic, tone, length, useSearch);
      setResult(text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!topic) return;
    setImageLoading(true);
    setError(null);
    try {
      const url = await generateMarketingImage(topic);
      setImageUrl(url);
    } catch (err: any) {
      setError("Image generation failed: " + err.message);
    } finally {
      setImageLoading(false);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    const contentItem: MarketingContent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      topic,
      tone,
      content: result,
      imageUrl: imageUrl || undefined,
      createdAt: Date.now(),
    };
    onContentGenerated(contentItem);
    alert("Saved to history!");
  };

  const isPremium = user.role === 'premium';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-fit">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Content Lab</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-3 items-start">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">Generation Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ContentType).map((cType) => (
                <button
                  key={cType}
                  type="button"
                  onClick={() => setType(cType)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    type === cType 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {cType}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
            <textarea
              required
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="What are we promoting?"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 ${useSearch ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Real-time Search
                  {!isPremium && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">PRO</span>}
                </p>
                <p className="text-xs text-slate-500">Include latest market facts</p>
              </div>
            </div>
            <button
              type="button"
              disabled={!isPremium}
              onClick={() => setUseSearch(!useSearch)}
              className={`w-10 h-6 rounded-full transition-colors relative ${useSearch ? 'bg-indigo-600' : 'bg-slate-300'} ${!isPremium && 'opacity-50 cursor-not-allowed'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useSearch ? 'left-5' : 'left-1'}`} />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Crafting Content...' : 'Generate Copy'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Editor Output</h3>
            <div className="flex gap-2">
              {result && (
                <>
                  <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M17.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button onClick={saveToHistory} className="p-2 text-slate-500 hover:text-emerald-600 rounded-lg" title="Save to History">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-6 flex-1">
            {isEditing ? (
              <textarea
                value={result || ''}
                onChange={(e) => setResult(e.target.value)}
                className="w-full h-full min-h-[300px] p-4 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm leading-relaxed"
              />
            ) : (
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result || <div className="text-slate-300 text-center py-20 italic">Generated content will appear here...</div>}
                
                {imageUrl && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-in zoom-in-95">
                    <img src={imageUrl} alt="Generated visual" className="w-full h-auto" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {result && (
            <div className="p-4 border-t border-slate-100 bg-white">
               <button
                  onClick={handleGenerateImage}
                  disabled={imageLoading || !isPremium}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 transition-all ${(!isPremium || imageLoading) && 'opacity-50 cursor-not-allowed'}`}
                >
                  {imageLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      Generating Visual...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Generate AI Visual {!isPremium && '(PRO)'}
                    </>
                  )}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
