
import React from 'react';
import { GenerationSettings, ProductCategory } from '../types';
import { PRODUCT_TYPES, BACKGROUND_STYLES, FINISHES, MATERIALS } from '../constants';

interface SidebarProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onGenerate: () => void;
  isGenerating: boolean;
  hasLabel: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  settings, 
  setSettings, 
  onGenerate, 
  isGenerating,
  hasLabel 
}) => {
  const categories: { id: ProductCategory; name: string }[] = [
    { id: 'COSMETIC', name: 'Beauty & Wellness' },
    { id: 'MERCHANDISE', name: 'Merchandise' },
    { id: 'PRINT', name: 'Print & Publishing' }
  ];

  const filteredProducts = PRODUCT_TYPES.filter(p => p.category === settings.category);
  const selectedProduct = filteredProducts.find(p => p.id === settings.productTypeId);

  const luxuryColors = [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Obsidian', hex: '#1A1A1A' },
    { name: 'Amber', hex: '#7E481C' },
    { name: 'Cobalt', hex: '#002E5D' },
    { name: 'Emerald', hex: '#022C22' },
    { name: 'Champagne', hex: '#F7E7CE' },
  ];

  return (
    <div className="w-full lg:w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-slate-100 bg-blue-50/30">
        <h1 className="text-xl font-bold tracking-tight text-blue-600">BrandStudio <span className="text-blue-300">CORE</span></h1>
        <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-widest font-bold">Asset Control Center</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Category Selection */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 1: Category</label>
          <div className="flex flex-col gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  const firstProdInCat = PRODUCT_TYPES.find(p => p.category === cat.id)!;
                  setSettings(prev => ({ 
                    ...prev, 
                    category: cat.id, 
                    productTypeId: firstProdInCat.id,
                    size: firstProdInCat.sizes[0]
                  }));
                }}
                className={`text-left px-4 py-2.5 rounded-xl border transition-all text-xs font-semibold ${
                  settings.category === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Product & Material */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 2: Product & Material</label>
          <div className="space-y-2">
            <select
              value={settings.productTypeId}
              onChange={(e) => {
                const prod = PRODUCT_TYPES.find(p => p.id === e.target.value)!;
                setSettings(prev => ({ ...prev, productTypeId: prod.id, size: prod.sizes[0] }));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-400 outline-none transition-all cursor-pointer"
            >
              {filteredProducts.map(prod => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={settings.material}
                onChange={(e) => setSettings(prev => ({ ...prev, material: e.target.value as any }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-tighter"
              >
                {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select
                value={settings.finish}
                onChange={(e) => setSettings(prev => ({ ...prev, finish: e.target.value as any }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-tighter"
              >
                {FINISHES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Color Customization */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 3: Color Palette</label>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Body</span>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.bodyColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, bodyColor: e.target.value }))}
                  className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{settings.bodyColor}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Accent</span>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.capColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, capColor: e.target.value }))}
                  className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{settings.capColor}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {luxuryColors.map(c => (
              <button 
                key={c.hex}
                onClick={() => setSettings(prev => ({ ...prev, bodyColor: c.hex }))}
                className="w-5 h-5 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-125"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </section>

        {/* Size Selection */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 4: Dimensions</label>
          <div className="flex flex-wrap gap-1.5">
            {selectedProduct?.sizes.map(sz => (
              <button
                key={sz}
                onClick={() => setSettings(prev => ({ ...prev, size: sz }))}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                  settings.size === sz
                    ? 'bg-blue-100 border-blue-200 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </section>

        {/* Background Selection */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 5: Environment</label>
          <div className="grid grid-cols-1 gap-2">
            {BACKGROUND_STYLES.map(bg => (
              <button
                key={bg.id}
                onClick={() => setSettings(prev => ({ ...prev, backgroundId: bg.id }))}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${
                  settings.backgroundId === bg.id 
                    ? 'bg-blue-50 border-blue-400 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] font-bold">{bg.name}</div>
                <div className="text-[9px] text-slate-400 leading-tight mt-0.5">{bg.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Variations */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Step 6: Render Variation</label>
            <span className="text-[10px] font-black bg-blue-50 px-2 py-0.5 rounded text-blue-600">{settings.variations} {settings.variations === 1 ? 'Frame' : 'Frames'}</span>
          </div>
          <div className="px-1">
            <input 
              type="range" 
              min="1" 
              max="4" 
              step="1"
              value={settings.variations}
              onChange={(e) => setSettings(prev => ({ ...prev, variations: parseInt(e.target.value) }))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer appearance-none"
            />
            <div className="flex justify-between mt-1.5 px-0.5">
              {[1, 2, 3, 4].map(v => (
                <span key={v} className="text-[8px] font-bold text-slate-300">{v}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <button
          disabled={!hasLabel || isGenerating}
          onClick={onGenerate}
          className={`w-full py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl ${
            !hasLabel || isGenerating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 active:translate-y-0'
          }`}
        >
          {isGenerating ? 'RENDERING...' : 'START PRODUCTION'}
        </button>
        {!hasLabel && (
          <p className="text-[9px] font-bold text-center mt-3 text-slate-400 uppercase tracking-widest">Design Upload Required</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
