import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

export const MobileDualModeHeader: React.FC = () => {
  const { deviceMode, setDeviceMode } = useApp();

  return (
    <div className="bg-black border-b border-neutral-800 text-white px-3 py-1.5 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
        <span className="font-bold tracking-wider text-white text-sm">
          AMICA
        </span>
      </div>

      <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-full border border-neutral-800">
        <button
          onClick={() => setDeviceMode('responsive')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            deviceMode === 'responsive'
              ? 'bg-[#E11D48] text-white font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>自适应</span>
        </button>

        <button
          onClick={() => setDeviceMode('mobile_app')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            deviceMode === 'mobile_app'
              ? 'bg-[#E11D48] text-white font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3 h-3" />
          <span>手机版</span>
        </button>

        <button
          onClick={() => setDeviceMode('web')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            deviceMode === 'web'
              ? 'bg-white text-black font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3 h-3" />
          <span>网页版</span>
        </button>
      </div>
    </div>
  );
};
