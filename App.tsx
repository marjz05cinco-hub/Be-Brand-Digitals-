
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import { GenerationSettings, MockupResult } from './types';
import { PRODUCT_TYPES, BACKGROUND_STYLES } from './constants';
import { generateMockup } from './services/geminiService';

interface HistoryState {
  settings: GenerationSettings;
  uploadedLabel: string | null;
}

const App: React.FC = () => {
  const [settings, setSettings] = useState<GenerationSettings>({
    category: 'COSMETIC',
    productTypeId: 'jar',
    size: '50g / 1.7 oz',
    backgroundId: 'studio_white',
    variations: 1,
    finish: 'matte',
    material: 'glass',
    bodyColor: '#FFFFFF',
    capColor: '#000000'
  });

  const [uploadedLabel, setUploadedLabel] = useState<string | null>(null);
  const [results, setResults] = useState<MockupResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Undo/Redo History
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Initialize history
  useEffect(() => {
    const initialState = { settings, uploadedLabel };
    setHistory([initialState]);
    setCurrentIndex(0);
  }, []);

  // Update history when settings or label change
  const addToHistory = useCallback((newSettings: GenerationSettings, newLabel: string | null) => {
    setHistory(prev => {
      const updatedHistory = prev.slice(0, currentIndex + 1);
      const newState = { settings: newSettings, uploadedLabel: newLabel };
      
      // Don't add if identical to current
      if (
        currentIndex >= 0 && 
        JSON.stringify(updatedHistory[currentIndex].settings) === JSON.stringify(newSettings) &&
        updatedHistory[currentIndex].uploadedLabel === newLabel
      ) {
        return prev;
      }

      return [...updatedHistory, newState];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevState = history[prevIndex];
      setSettings(prevState.settings);
      setUploadedLabel(prevState.uploadedLabel);
      setCurrentIndex(prevIndex);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextState = history[nextIndex];
      setSettings(nextState.settings);
      setUploadedLabel(nextState.uploadedLabel);
      setCurrentIndex(nextIndex);
    }
  };

  const handleSettingsChange = (newSettings: React.SetStateAction<GenerationSettings>) => {
    setSettings(prev => {
      const updated = typeof newSettings === 'function' ? newSettings(prev) : newSettings;
      addToHistory(updated, uploadedLabel);
      return updated;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const label = reader.result as string;
        setUploadedLabel(label);
        addToHistory(settings, label);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLabel = () => {
    setUploadedLabel(null);
    addToHistory(settings, null);
  };

  const clearResults = () => {
    if (window.confirm("Delete all gallery items?")) {
      setResults([]);
    }
  };

  const onGenerate = async () => {
    if (!uploadedLabel) return;
    
    setIsGenerating(true);
    setError(null);

    const product = PRODUCT_TYPES.find(p => p.id === settings.productTypeId)!;
    const background = BACKGROUND_STYLES.find(b => b.id === settings.backgroundId)!;

    try {
      const newResults: MockupResult[] = [];
      
      for (let i = 0; i < settings.variations; i++) {
        const variationNote = i > 0 ? ` from a slightly different angle (variation ${i + 1})` : "";
        const prompt = `A professional commercial photo of a ${settings.size} ${settings.material} ${product.name}${variationNote}. 
        The container body is colored ${settings.bodyColor} and the cap/lid is colored ${settings.capColor}. 
        The provided label has a ${settings.finish} finish and is perfectly applied to the surface. 
        Scene: ${background.description}. 
        Ultra-realistic 8k render, precise ${settings.material} material behavior, luxury lighting, soft shadows, 100% focused.`;
        
        const imageUrl = await generateMockup(uploadedLabel, prompt);
        
        newResults.push({
          id: `${Date.now()}-${i}`,
          url: imageUrl,
          timestamp: Date.now(),
          config: {
            product: product.name,
            size: settings.size,
            background: background.name,
            finish: settings.finish,
            material: settings.material,
            bodyColor: settings.bodyColor,
            capColor: settings.capColor
          }
        });
      }

      setResults(prev => [...newResults, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError("Production Failed. Please ensure your configuration is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDownloadFilename = (result: MockupResult) => {
    const name = result.config.product.toLowerCase().replace(/\s+/g, '-');
    const finish = result.config.finish;
    const date = new Date(result.timestamp).toISOString().split('T')[0];
    return `brand-studio-${name}-${finish}-${date}.png`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar 
        settings={settings} 
        setSettings={handleSettingsChange} 
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        hasLabel={!!uploadedLabel}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-12">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-blue-600 uppercase leading-none">Brand Digital Studio</h2>
            <p className="text-slate-500 text-lg font-medium leading-tight">
              Generate Studio-Quality Product Visuals — Instantly.
            </p>
          </div>
          
          {/* Undo/Redo Controls */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={undo}
              disabled={currentIndex <= 0}
              className="p-3 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all"
              title="Undo Change"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <button 
              onClick={redo}
              disabled={currentIndex >= history.length - 1}
              className="p-3 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all"
              title="Redo Change"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path></svg>
            </button>
          </div>
        </div>

        {/* Branding Info & Upload */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
              <p className="text-slate-600 leading-relaxed font-medium">
                Brand Digital Studio is a powerful visual creation platform that helps businesses turn a single label or design into professional, photorealistic product images in minutes.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Simply upload your label, choose your product type, size, and background, and instantly generate high-quality visuals that look like they were captured in a professional studio — without photoshoots, designers, or long production timelines.
              </p>
            </div>
          </div>
          
          <div className="relative group h-64 md:h-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-100 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white hover:border-blue-500 transition-all cursor-pointer overflow-hidden shadow-sm" onClick={() => !uploadedLabel && fileInputRef.current?.click()}>
              {uploadedLabel ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="h-24 w-24 relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100 p-2 shadow-inner">
                    <img src={uploadedLabel} alt="Preview" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-700 transition-all"
                    >
                      Change
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveLabel(); }}
                      className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto border border-blue-100 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-800">Drop Label Design</div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PNG / JPG / WebP up to 10MB</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/png, image/jpeg, image/webp" />
          </div>
        </div>

        {/* Global Status Area */}
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-50 text-red-600 px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <span className="h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
              {error}
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="w-20 h-1 bg-blue-100 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-600 w-1/3 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Generating Commercial Assets</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Computing light physics and material density...</div>
              </div>
            </div>
          )}
        </div>

        {/* Production Gallery */}
        <div className="max-w-6xl mx-auto space-y-8">
          {results.length > 0 && (
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                Gallery Archive
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold">{results.length}</span>
              </h3>
              <button 
                onClick={clearResults}
                className="text-[10px] font-black text-slate-300 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
              >
                Clear Results
              </button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {results.map((result) => (
                <div key={result.id} className="group flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 relative">
                    <img 
                      src={result.url} 
                      alt="Mockup result" 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    />
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <a 
                        href={result.url} 
                        download={getDownloadFilename(result)}
                        className="w-full bg-blue-600/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 active:scale-95 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4 4v12"></path></svg>
                        Export HQ PNG
                      </a>
                    </div>
                  </div>
                  <div className="px-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{result.config.product}</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: result.config.bodyColor }} />
                        <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: result.config.capColor }} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="text-sm font-black text-slate-800">{result.config.background} Context</div>
                       <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 rounded-md">{result.config.finish}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Rendered {new Date(result.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : !isGenerating && (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-slate-100 rounded-[3rem] bg-white shadow-inner">
              <svg className="w-24 h-24 text-blue-50 mb-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
              <h4 className="text-slate-900 font-black uppercase tracking-[0.2em] text-xs">No Production Assets Found</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Configure parameters and launch production to begin</p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes progress {
          0% { left: -30%; width: 30%; }
          100% { left: 100%; width: 30%; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
