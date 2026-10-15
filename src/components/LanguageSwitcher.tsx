import React, { useState, useRef, useEffect } from 'react';
import { useI18n, SupportedLang, SUPPORTED_LANGUAGES } from '../i18n';
import { Globe, Check, Sparkles, RefreshCw } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'dropdown' | 'pill';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { lang, setLang, currentMeta, isAutoDetected, resetToBrowser, browserLang, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLang = (code: SupportedLang) => {
    setLang(code, true);
    setIsOpen(false);
  };

  const handleResetToAuto = () => {
    resetToBrowser();
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 transition-all shadow-xs"
          title={isAutoDetected ? t('lang.autoDetected') : t('lang.switch')}
        >
          <span className="text-sm">{currentMeta.flag}</span>
          <span className="hidden sm:inline-block font-semibold">{currentMeta.nativeName}</span>
          {isAutoDetected && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_6px_#00F2FE]" title="Browser Auto" />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 text-xs font-medium border border-white/10 transition-all select-none"
          title={isAutoDetected ? t('lang.autoDetected') : t('lang.switch')}
        >
          <Globe className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span className="text-xs">{currentMeta.flag}</span>
          <span className="font-semibold text-[11px]">{currentMeta.nativeName}</span>
          {isAutoDetected && (
            <span className="text-[9px] text-[#00F2FE] font-mono px-1 rounded-xs bg-[#00F2FE]/10 border border-[#00F2FE]/30">
              Auto
            </span>
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 p-2 text-white animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              {t('lang.current')}
            </span>
            {isAutoDetected ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#00F2FE] font-medium bg-[#00F2FE]/10 px-1.5 py-0.5 rounded-md border border-[#00F2FE]/20">
                <Sparkles className="w-3 h-3" /> Auto ({browserLang})
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResetToAuto}
                className="inline-flex items-center gap-1 text-[10px] text-pink-400 hover:text-pink-300 font-medium hover:underline"
                title="Ripristina rilevamento automatico del browser"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Auto
              </button>
            )}
          </div>

          {/* Languages list */}
          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectLang(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#CC09E6]/25 border border-[#CC09E6]/40 text-white font-semibold'
                      : 'hover:bg-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div className="text-left">
                      <div className="text-xs text-white">{item.nativeName}</div>
                      <div className="text-[10px] text-neutral-400">{item.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#00F2FE]" />}
                </button>
              );
            })}
          </div>

          {/* Browser auto switch reset button */}
          {!isAutoDetected && (
            <div className="mt-1 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetToAuto}
                className="w-full text-center py-1.5 text-[11px] text-neutral-400 hover:text-[#00F2FE] hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#00F2FE]" />
                <span>智能跟随浏览器语言 ({browserLang})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
