"use client";

import { useState, useEffect } from "react";
import { Monitor, X } from "lucide-react";

export default function MobileWarningToast() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const isMobile = window.innerWidth < 768;
    const hasDismissed = sessionStorage.getItem("mobile-warning-dismissed");

    if (isMobile && !hasDismissed) {
      // Delay slightly for better UX
      const timer = setTimeout(() => {
        setShow(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !show) return null;

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("mobile-warning-dismissed", "true");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/40">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Meilleure Expérience sur PC</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Pour profiter pleinement des simulateurs interactifs, il est préférable d'utiliser un ordinateur.
            </p>
          </div>
        </div>
        <button 
          onClick={dismiss}
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
