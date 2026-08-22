"use client";

import React from "react";
import katex from "katex";

interface LatexMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export default function LatexMath({ math, block = false, className = "" }: LatexMathProps) {
  let html = "";
  let hasError = false;

  try {
    html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
    });
  } catch (error) {
    hasError = true;
  }

  if (hasError) {
    return <code className="text-red-500 font-mono text-xs">{math}</code>;
  }

  return (
    <span
      className={`katex-container ${block ? "block text-center my-3 overflow-x-auto py-1" : "inline-block px-1"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
