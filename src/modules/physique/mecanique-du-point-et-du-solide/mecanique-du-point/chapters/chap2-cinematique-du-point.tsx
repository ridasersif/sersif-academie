"use client";

import React from "react";
import LatexMath from "@/components/ui/LatexMath";
import { BookOpen } from "lucide-react";

export default function Chap2CinematiqueDuPoint() {
  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold">
        <span>Chapitre 02 • Cinématique du Point Matériel</span>
      </div>

      <h2 className="text-2xl font-black text-foreground">
        Cinématique du Point Matériel
      </h2>

      <div className="py-12 text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          Module Cinématique en cours d'intégration
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto font-medium leading-relaxed mb-3">
          Vecteur position <LatexMath math="\vec{OM}(t)" />, vitesse <LatexMath math="\vec{v} = \frac{d\vec{OM}}{dt}" />, accélération <LatexMath math="\vec{a}" />, repère de Frenet <LatexMath math="(\vec{\tau}, \vec{n}, \vec{b})" />.
        </p>
      </div>
    </div>
  );
}
