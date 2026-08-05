"use client";

import React from "react";
import katex from "katex";

interface LatexMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export default function LatexMath({ math, block = false, className = "" }: LatexMathProps) {
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
    });

    return (
      <span
        className={`katex-container ${block ? "block text-center my-3 overflow-x-auto py-1" : "inline-block px-1"} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    return <code className="text-red-500 font-mono text-xs">{math}</code>;
  }
}
