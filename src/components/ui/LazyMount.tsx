"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface LazyMountProps {
  children: React.ReactNode;
  height?: string | number;
  rootMargin?: string;
  fallbackText?: string;
}

export default function LazyMount({ 
  children, 
  height = "400px", 
  rootMargin = "0px", // Unmount strictly when completely out of view
  fallbackText = "Préparation du simulateur 3D..."
}: LazyMountProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Mount if intersecting. Unmount if not intersecting.
        setIsMounted(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={containerRef} style={{ minHeight: height, width: "100%", position: "relative" }} className="w-full flex justify-center">
      {isMounted ? (
        <div className="w-full animate-in fade-in duration-700">
           {children}
        </div>
      ) : (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-md shadow-inner m-auto max-w-[900px]"
          style={{ height }}
        >
          <div className="relative flex items-center justify-center mb-4">
            {/* Outer spinning ring */}
            <div className="absolute w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            {/* Inner pulsing icon */}
            <Loader2 className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[13px] font-black text-slate-200 tracking-wide uppercase">
              {fallbackText}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              Le simulateur est en pause pour économiser vos ressources
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
