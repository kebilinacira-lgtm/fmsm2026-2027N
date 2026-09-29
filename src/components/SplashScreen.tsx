import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft, ShieldCheck, Atom } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 18;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071739] text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center space-y-6">
        {/* Ministerial header */}
        <div className="space-y-1 text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
          <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
          <p className="text-amber-300/90 font-semibold">وزارة التعليم العالي والبحث العلمي</p>
        </div>

        {/* Official University Logo */}
        <div className="relative p-3 rounded-full bg-white shadow-2xl border-4 border-[#0B3D91] ring-4 ring-amber-400/30">
          <img
            src="/logo_univ_ouargla.png"
            alt="شعار جامعة قاصدي مرباح ورقلة"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#0B3D91] text-amber-300 p-2 rounded-full border-2 border-white shadow-md">
            <Atom className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            جامعة قاصدي مرباح - ورقلة
          </h1>
          <div className="inline-block bg-[#0B3D91] text-amber-300 border border-amber-400/30 px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-xs">
            كلية الرياضيات وعلوم المادة (FMSM)
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed pt-1">
            البوابة الرقمية الموحدة للطلبة، الأساتذة، والإدارة
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs space-y-2 pt-4">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
            <div
              className="h-full bg-linear-to-r from-blue-500 via-teal-400 to-amber-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>تهيئة الفضاءات الرقمية...</span>
            <span className="font-mono">{progress}%</span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            setFadeOut(true);
            setTimeout(onComplete, 200);
          }}
          className="mt-4 inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl border border-white/20 transition-all cursor-pointer"
        >
          <span>تخطي والدخول للمنصة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
