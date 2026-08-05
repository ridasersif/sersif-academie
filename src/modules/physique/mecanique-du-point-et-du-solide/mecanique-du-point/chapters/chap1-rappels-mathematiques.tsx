"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import ThreeDCoordinateCanvas from "../components/ThreeDCoordinateCanvas";
import VectorProductSimulator from "../components/VectorProductSimulator";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Compass, Activity } from "lucide-react";

export default function Chap1RappelsMathematiques() {
  const [showCylProof, setShowCylProof] = useState(false);
  const [showSphProof, setShowSphProof] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* SECTION 1: PRODUIT SCALAIRE, VECTORIEL & MIXTE AVEC SIMULATEUR INTERACTIF */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <span>Partie 1 • Outils Vectoriels & Simulateur Interactif</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Produit Scalaire, Produit Vectoriel et Produit Mixte
        </h2>

        {/* Produit Scalaire & Vectoriel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          
          {/* A. Produit Scalaire */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-cyan-400 mb-2 flex items-center justify-between">
                <span>A. Produit Scalaire</span>
                <LatexMath math="\vec{u} \cdot \vec{v}" className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 font-mono" />
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Le produit scalaire de deux vecteurs <LatexMath math="\vec{u}" /> et <LatexMath math="\vec{v}" /> est un <strong>scalaire</strong> (nombre réel) correspondant à la projection orthogonale:
              </p>
              
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono text-xs sm:text-sm font-bold text-cyan-400 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos(\theta) = u_x v_x + u_y v_y + u_z v_z" block />
              </div>

              {/* Diagram SVG Produit Scalaire */}
              <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
                <svg width="220" height="90" viewBox="0 0 220 90" className="w-full max-w-[220px]">
                  <line x1="20" y1="70" x2="190" y2="70" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
                  <text x="195" y="74" fill="#38bdf8" fontSize="11" fontWeight="bold">u</text>
                  
                  <line x1="20" y1="70" x2="140" y2="20" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrowPurp)" />
                  <text x="145" y="20" fill="#a855f7" fontSize="11" fontWeight="bold">v</text>
                  
                  <line x1="140" y1="20" x2="140" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                  
                  <path d="M 45 70 A 25 25 0 0 0 38 55" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="50" y="60" fill="#f59e0b" fontSize="10" fontWeight="bold">θ</text>
                  
                  <defs>
                    <marker id="arrowCyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                    </marker>
                    <marker id="arrowPurp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                    </marker>
                  </defs>
                </svg>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Projection: u · v = ||u|| · (||v|| cos θ)</span>
              </div>
            </div>

            {/* Numerical Example Card */}
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs mt-2">
              <strong className="text-cyan-400 block mb-1">💡 Exemple Numérique Concret:</strong>
              <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">
                Soient <LatexMath math="\vec{u} = (3, 4, 0)" /> et <LatexMath math="\vec{v} = (1, 2, 0)" />.<br />
                • <LatexMath math="\vec{u} \cdot \vec{v} = (3 \times 1) + (4 \times 2) + (0 \times 0) = 3 + 8 = 11" /><br />
                • Normes: <LatexMath math="\|\vec{u}\| = 5" />, <LatexMath math="\|\vec{v}\| = \sqrt{5} \approx 2.24" /><br />
                • Angle: <LatexMath math="\cos\theta = \frac{11}{5\sqrt{5}} \approx 0.9838 \implies \theta \approx 10.3^\circ" />
              </p>
            </div>
          </div>

          {/* B. Produit Vectoriel */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-emerald-400 mb-2 flex items-center justify-between">
                <span>B. Produit Vectoriel</span>
                <LatexMath math="\vec{u} \wedge \vec{v}" className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 font-mono" />
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Le produit vectoriel donne un <strong>vecteur orthogonal</strong> au plan formé par <LatexMath math="\vec{u}" /> et <LatexMath math="\vec{v}" /> (Sens: règle de la main droite):
              </p>
              
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono text-xs sm:text-sm font-bold text-emerald-400 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\|\vec{u} \wedge \vec{v}\| = \|\vec{u}\| \|\vec{v}\| \sin(\theta)" block />
              </div>

              {/* Diagram SVG Produit Vectoriel */}
              <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
                <svg width="220" height="90" viewBox="0 0 220 90" className="w-full max-w-[220px]">
                  <polygon points="30,75 140,75 170,45 60,45" fill="#1e293b" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                  
                  <line x1="60" y1="75" x2="140" y2="75" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#arrowEm)" />
                  <text x="145" y="78" fill="#34d399" fontSize="10" fontWeight="bold">u</text>
                  
                  <line x1="60" y1="75" x2="100" y2="48" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
                  <text x="105" y="46" fill="#38bdf8" fontSize="10" fontWeight="bold">v</text>
                  
                  <line x1="60" y1="75" x2="60" y2="15" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrowRose)" />
                  <text x="68" y="20" fill="#f43f5e" fontSize="11" fontWeight="extrabold">u ∧ v</text>
                  
                  <defs>
                    <marker id="arrowEm" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                    </marker>
                    <marker id="arrowRose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                    </marker>
                  </defs>
                </svg>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Orthogonalité: (u ∧ v) ⊥ u  et  (u ∧ v) ⊥ v</span>
              </div>
            </div>

            {/* Numerical Example Card */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs mt-2">
              <strong className="text-emerald-400 block mb-1">💡 Exemple Numérique Concret:</strong>
              <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">
                Soient <LatexMath math="\vec{u} = (2, 1, 0)" /> et <LatexMath math="\vec{v} = (0, 3, 0)" />.<br />
                • <LatexMath math="\vec{u} \wedge \vec{v} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ 2 & 1 & 0 \\ 0 & 3 & 0 \end{vmatrix} = (2 \times 3 - 1 \times 0)\vec{k} = 6\vec{k}" /><br />
                • Norme (Aire du parallélogramme) = <LatexMath math="\|6\vec{k}\| = 6" />.
              </p>
            </div>
          </div>

        </div>

        {/* INTERACTIVE VECTOR PRODUCT SIMULATOR WIDGET */}
        <VectorProductSimulator />

        {/* C. Produit Mixte & Volume 3D */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mt-6">
          <h3 className="text-sm sm:text-base font-bold text-indigo-400 mb-2">
            C. Produit Mixte : <LatexMath math="(\vec{u}, \vec{v}, \vec{w}) = (\vec{u} \wedge \vec{v}) \cdot \vec{w}" />
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 font-medium">
            Le produit mixte donne le <strong>volume orienté</strong> du parallélépipède construit sur les 3 vecteurs <LatexMath math="\vec{u}, \vec{v}, \vec{w}" />.
          </p>
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-center font-bold text-indigo-300 mb-3 overflow-x-auto custom-scrollbar">
            <LatexMath math="(\vec{u} \wedge \vec{v}) \cdot \vec{w} = (\vec{v} \wedge \vec{w}) \cdot \vec{u} = (\vec{w} \wedge \vec{u}) \cdot \vec{v} = \begin{vmatrix} u_x & v_x & w_x \\ u_y & v_y & w_y \\ u_z & v_z & w_z \end{vmatrix}" />
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/40 text-xs font-mono">
            <strong className="text-indigo-400 block mb-1">💡 Exemple de Calcul de Volume 3D:</strong>
            <span className="text-muted-foreground text-[11px]">
              Si <LatexMath math="\vec{u} = (2,0,0)" />, <LatexMath math="\vec{v} = (0,3,0)" />, <LatexMath math="\vec{w} = (0,0,4)" />, alors:<br />
              <LatexMath math="\text{Volume } V = |(\vec{u} \wedge \vec{v}) \cdot \vec{w}| = |(6\vec{k}) \cdot (4\vec{k})| = 24\text{ unités}^3" />.
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: FORMULES DE DÉRIVATION VECTORIELLE */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <span>Partie 2 • Dérivation Vectorielle</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. Rappels de Dérivation et Dérivation de Produit de Vecteurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Dérivation Scalaire Usuelle */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-3">A. Formules de Dérivation Usuelles</h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0 text-muted-foreground">Produit:</span>
                <LatexMath math="(f \cdot g)' = f'g + fg'" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0 text-muted-foreground">Quotient:</span>
                <LatexMath math="\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0 text-muted-foreground">Composée:</span>
                <LatexMath math="(f(g(t)))' = g'(t) \cdot f'(g(t))" />
              </div>
            </div>
          </div>

          {/* Dérivation de Produits Vectoriels par rapport au temps t */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-3">B. Dérivation de Vecteurs par rapport au Temps t</h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0 text-muted-foreground">Scalaire:</span>
                <LatexMath math="\frac{d}{dt}(\vec{u} \cdot \vec{v}) = \frac{d\vec{u}}{dt} \cdot \vec{v} + \vec{u} \cdot \frac{d\vec{v}}{dt}" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0 text-muted-foreground">Vectoriel:</span>
                <LatexMath math="\frac{d}{dt}(\vec{u} \wedge \vec{v}) = \frac{d\vec{u}}{dt} \wedge \vec{v} + \vec{u} \wedge \frac{d\vec{v}}{dt}" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0 text-muted-foreground">Vecteur × f:</span>
                <LatexMath math="\frac{d}{dt}(f(t) \vec{u}) = f'(t) \vec{u} + f(t) \frac{d\vec{u}}{dt}" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THREE.JS 3D INTERACTIVE COORDINATE CANVAS WITH VISUAL ANGLES PHI AND THETA */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <span>Partie 3 • Three.js 3D WebGL Canvas & Angles Visuels (φ, θ)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-2 text-foreground leading-tight">
          3. Repères & Volumes 3D avec Visualization des Angles (φ, θ)
        </h2>

        <p className="text-xs text-muted-foreground font-medium mb-3 sm:mb-4">
          Visualisez directement les <strong>arcs et secteurs d'angles 3D</strong> (l'angle azimutal <span className="text-emerald-400 font-bold">φ</span> en vert et l'angle zénithal <span className="text-amber-400 font-bold">θ</span> en or).
        </p>

        {/* Three.js WebGL Canvas Component with Visual 3D Angle Arcs */}
        <ThreeDCoordinateCanvas />
      </section>

      {/* SECTION 4: DÉRIVATION DES VECTEURS DE LA BASE MOBILE (CORRECTED COMPACT EQUALITY & STEP-BY-STEP PROOFS) */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <span>Partie 4 • Dérivation des Bases Mobiles</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          4. Dérivation des Vecteurs de Base Locaux par rapport au Temps (avec Démonstrations)
        </h2>

        {/* Compact Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          
          {/* Base Cylindrique */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-500 mb-3 flex items-center justify-between">
                <span>A. Base Cylindrique <LatexMath math="(\vec{e}_\rho, \vec{e}_\phi, \vec{e}_z)" /></span>
              </h3>
              
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-start gap-3">
                  <LatexMath math="\frac{d\vec{e}_\rho}{dt} = \dot{\phi} \vec{e}_\phi" />
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-start gap-3">
                  <LatexMath math="\frac{d\vec{e}_\phi}{dt} = -\dot{\phi} \vec{e}_\rho" />
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-start gap-3">
                  <LatexMath math="\frac{d\vec{e}_z}{dt} = \vec{0}" />
                </div>
              </div>
            </div>

            {/* Accordion Toggle Demonstration Cylindrique */}
            <div className="mt-4 pt-3 border-t border-border/40">
              <button
                onClick={() => setShowCylProof(!showCylProof)}
                className="w-full flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 transition-all p-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Démonstration Détaillée (Base Cylindrique)</span>
                </span>
                {showCylProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCylProof && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p className="text-amber-400 font-bold">1. Expression des vecteurs dans la base fixe (i, j, k):</p>
                  <p><LatexMath math="\vec{e}_\rho = \cos\phi\,\vec{i} + \sin\phi\,\vec{j}" /></p>
                  <p><LatexMath math="\vec{e}_\phi = -\sin\phi\,\vec{i} + \cos\phi\,\vec{j}" /></p>
                  
                  <p className="text-amber-400 font-bold mt-2">2. Dérivation par rapport au temps t:</p>
                  <p><LatexMath math="\frac{d\vec{e}_\rho}{dt} = \frac{d(\cos\phi)}{dt}\vec{i} + \frac{d(\sin\phi)}{dt}\vec{j} = -\dot{\phi}\sin\phi\,\vec{i} + \dot{\phi}\cos\phi\,\vec{j}" /></p>
                  <p><LatexMath math="\implies \frac{d\vec{e}_\rho}{dt} = \dot{\phi}\left(-\sin\phi\,\vec{i} + \cos\phi\,\vec{j}\right) = \dot{\phi} \vec{e}_\phi" className="text-cyan-400 font-bold" /></p>
                  
                  <p className="mt-2"><LatexMath math="\frac{d\vec{e}_\phi}{dt} = -\dot{\phi}\cos\phi\,\vec{i} - \dot{\phi}\sin\phi\,\vec{j} = -\dot{\phi}\left(\cos\phi\,\vec{i} + \sin\phi\,\vec{j}\right) = -\dot{\phi}\vec{e}_\rho" className="text-rose-400 font-bold" /></p>
                </div>
              )}
            </div>
          </div>

          {/* Base Sphérique */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-500 mb-3 flex items-center justify-between">
                <span>B. Base Sphérique <LatexMath math="(\vec{e}_r, \vec{e}_\theta, \vec{e}_\phi)" /></span>
              </h3>
              
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-start gap-3">
                  <LatexMath math="\frac{d\vec{e}_r}{dt} = \dot{\theta} \vec{e}_\theta + \dot{\phi}\sin\theta \vec{e}_\phi" />
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-start gap-3">
                  <LatexMath math="\frac{d\vec{e}_\theta}{dt} = -\dot{\theta} \vec{e}_r + \dot{\phi}\cos\theta \vec{e}_\phi" />
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-start gap-3">
                  <LatexMath math="\frac{d\vec{e}_\phi}{dt} = -\dot{\phi}(\sin\theta \vec{e}_r + \cos\theta \vec{e}_\theta)" />
                </div>
              </div>
            </div>

            {/* Accordion Toggle Demonstration Sphérique */}
            <div className="mt-4 pt-3 border-t border-border/40">
              <button
                onClick={() => setShowSphProof(!showSphProof)}
                className="w-full flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 transition-all p-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Démonstration Détaillée (Base Sphérique)</span>
                </span>
                {showSphProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSphProof && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p className="text-amber-400 font-bold">1. Formule de dérivation composée à 2 variables θ(t) et φ(t):</p>
                  <p><LatexMath math="\frac{d\vec{e}_r}{dt} = \frac{\partial\vec{e}_r}{\partial\theta}\dot{\theta} + \frac{\partial\vec{e}_r}{\partial\phi}\dot{\phi}" /></p>
                  
                  <p className="text-amber-400 font-bold mt-2">2. Dérivées partielles de e_r(θ, φ):</p>
                  <p><LatexMath math="\vec{e}_r = \sin\theta\cos\phi\,\vec{i} + \sin\theta\sin\phi\,\vec{j} + \cos\theta\,\vec{k}" /></p>
                  <p><LatexMath math="\frac{\partial\vec{e}_r}{\partial\theta} = \cos\theta\cos\phi\,\vec{i} + \cos\theta\sin\phi\,\vec{j} - \sin\theta\,\vec{k} = \vec{e}_\theta" /></p>
                  <p><LatexMath math="\frac{\partial\vec{e}_r}{\partial\phi} = -\sin\theta\sin\phi\,\vec{i} + \sin\theta\cos\phi\,\vec{j} = \sin\theta\,\vec{e}_\phi" /></p>
                  
                  <p className="text-cyan-400 font-bold mt-2"><LatexMath math="\implies \frac{d\vec{e}_r}{dt} = \dot{\theta}\vec{e}_\theta + \dot{\phi}\sin\theta\vec{e}_\phi" /></p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: OPÉRATEURS DIFFÉRENTIELS COMPLETE (NABLA FIRST + GRAD, DIV, ROT, LAPLACIEN & PHYSICAL MEANING SVG) */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <span>Partie 5 • Champs & Opérateurs Différentiels</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          5. Opérateurs Différentiels : Nabla, Gradient, Divergence, Rotationnel & Laplacien
        </h2>

        <div className="space-y-6">
          
          {/* A. L'OPÉRATEUR NABLA (EXPLICIT FIRST) */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/30">
            <h3 className="text-sm sm:text-base font-bold text-rose-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>A. L'Opérateur Nabla <LatexMath math="\vec{\nabla}" /> dans les 3 Repères (Fondamentale)</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              L'opérateur Nabla <LatexMath math="\vec{\nabla}" /> est un vecteur d'opérateurs de dérivation spatiale. Il constitue la base de tous les opérateurs (Grad, Div, Rot, Laplacien):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 overflow-x-auto custom-scrollbar">
                <div className="text-xs font-sans font-bold text-slate-400 mb-1">Repère Cartésien</div>
                <LatexMath math="\vec{\nabla} = \frac{\partial}{\partial x}\vec{i} + \frac{\partial}{\partial y}\vec{j} + \frac{\partial}{\partial z}\vec{k}" block />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 overflow-x-auto custom-scrollbar">
                <div className="text-xs font-sans font-bold text-slate-400 mb-1">Repère Cylindrique</div>
                <LatexMath math="\vec{\nabla} = \frac{\partial}{\partial \rho}\vec{e}_\rho + \frac{1}{\rho}\frac{\partial}{\partial \phi}\vec{e}_\phi + \frac{\partial}{\partial z}\vec{e}_z" block />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 overflow-x-auto custom-scrollbar">
                <div className="text-xs font-sans font-bold text-slate-400 mb-1">Repère Sphérique</div>
                <LatexMath math="\vec{\nabla} = \frac{\partial}{\partial r}\vec{e}_r + \frac{1}{r}\frac{\partial}{\partial \theta}\vec{e}_\theta + \frac{1}{r\sin\theta}\frac{\partial}{\partial \phi}\vec{e}_\phi" block />
              </div>
            </div>
          </div>

          {/* B. GRADIENT */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-2 flex flex-wrap items-center justify-between gap-1">
              <span>B. Opérateur Gradient : <LatexMath math="\vec{\mathrm{grad}}(f) = \vec{\nabla}f" /></span>
              <span className="text-[10px] sm:text-xs text-cyan-400 font-mono">Champ Scalaire → Champ Vectoriel</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Le gradient pointe dans la direction de la <strong>variation maximale</strong> de la fonction scalaire <LatexMath math="f" />.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs text-center">
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cartésien</div>
                <LatexMath math="\frac{\partial f}{\partial x}\vec{i} + \frac{\partial f}{\partial y}\vec{j} + \frac{\partial f}{\partial z}\vec{k}" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cylindrique</div>
                <LatexMath math="\frac{\partial f}{\partial \rho}\vec{e}_\rho + \frac{1}{\rho}\frac{\partial f}{\partial \phi}\vec{e}_\phi + \frac{\partial f}{\partial z}\vec{e}_z" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Sphérique</div>
                <LatexMath math="\frac{\partial f}{\partial r}\vec{e}_r + \frac{1}{r}\frac{\partial f}{\partial \theta}\vec{e}_\theta + \frac{1}{r\sin\theta}\frac{\partial f}{\partial \phi}\vec{e}_\phi" />
              </div>
            </div>
          </div>

          {/* C. DIVERGENCE */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-2 flex flex-wrap items-center justify-between gap-1">
              <span>C. Divergence : <LatexMath math="\mathrm{div}(\vec{A}) = \vec{\nabla} \cdot \vec{A}" /></span>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Champ Vectoriel → Champ Scalaire</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Mesure le <strong>flux sortant net</strong> par unité de volume autour d'un point (Source si div &gt; 0, Puits si div &lt; 0).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs text-center">
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cartésien</div>
                <LatexMath math="\frac{\partial A_x}{\partial x} + \frac{\partial A_y}{\partial y} + \frac{\partial A_z}{\partial z}" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cylindrique</div>
                <LatexMath math="\frac{1}{\rho}\frac{\partial(\rho A_\rho)}{\partial \rho} + \frac{1}{\rho}\frac{\partial A_\phi}{\partial \phi} + \frac{\partial A_z}{\partial z}" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Sphérique</div>
                <LatexMath math="\frac{1}{r^2}\frac{\partial(r^2 A_r)}{\partial r} + \frac{1}{r\sin\theta}\frac{\partial(\sin\theta A_\theta)}{\partial \theta} + \frac{1}{r\sin\theta}\frac{\partial A_\phi}{\partial \phi}" />
              </div>
            </div>
          </div>

          {/* D. ROTATIONNEL */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-2 flex flex-wrap items-center justify-between gap-1">
              <span>D. Rotationnel : <LatexMath math="\vec{\mathrm{rot}}(\vec{A}) = \vec{\nabla} \wedge \vec{A}" /></span>
              <span className="text-[10px] sm:text-xs text-amber-400 font-mono">Champ Vectoriel → Champ Vectoriel</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Mesure la <strong>circulation locale / tourbillonnement</strong> d'un champ vectoriel autour d'un point.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs text-center">
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cartésien</div>
                <LatexMath math="\begin{vmatrix}\vec{i} & \vec{j} & \vec{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ A_x & A_y & A_z\end{vmatrix}" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cylindrique</div>
                <LatexMath math="\frac{1}{\rho}\begin{vmatrix}\vec{e}_\rho & \rho\vec{e}_\phi & \vec{e}_z \\ \frac{\partial}{\partial \rho} & \frac{\partial}{\partial \phi} & \frac{\partial}{\partial z} \\ A_\rho & \rho A_\phi & A_z\end{vmatrix}" />
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/40 overflow-x-auto custom-scrollbar">
                <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Sphérique</div>
                <LatexMath math="\frac{1}{r^2\sin\theta}\begin{vmatrix}\vec{e}_r & r\vec{e}_\theta & r\sin\theta\vec{e}_\phi \\ \frac{\partial}{\partial r} & \frac{\partial}{\partial \theta} & \frac{\partial}{\partial \phi} \\ A_r & r A_\theta & r\sin\theta A_\phi\end{vmatrix}" />
              </div>
            </div>
          </div>

          {/* E. INTERPRÉTATION PHYSIQUE VISUELLE (GRAD, DIV, ROT SVG DIAGRAMS) */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white">
            <h3 className="text-sm sm:text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Interprétation Physique Visuelle des Opérateurs</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
              
              {/* 1. Gradient SVG */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="font-bold text-cyan-300 mb-2">1. Gradient (Pente Maximale)</span>
                <svg width="160" height="100" viewBox="0 0 160 100" className="w-full max-w-[160px]">
                  <ellipse cx="80" cy="50" rx="70" ry="35" fill="none" stroke="#334155" strokeWidth="1" />
                  <ellipse cx="80" cy="50" rx="45" ry="22" fill="none" stroke="#475569" strokeWidth="1" />
                  <ellipse cx="80" cy="50" rx="20" ry="10" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1" />
                  
                  {/* Gradient Vector */}
                  <line x1="80" y1="50" x2="120" y2="25" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#gradArrow)" />
                  <text x="125" y="22" fill="#38bdf8" fontSize="10" fontWeight="bold">grad f</text>
                  
                  <defs>
                    <marker id="gradArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                    </marker>
                  </defs>
                </svg>
                <p className="text-[10px] text-slate-400 mt-2">Pointe vers les valeurs de <LatexMath math="f" /> croissantes</p>
              </div>

              {/* 2. Divergence SVG */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="font-bold text-emerald-300 mb-2">2. Divergence (Source / Flux)</span>
                <svg width="160" height="100" viewBox="0 0 160 100" className="w-full max-w-[160px]">
                  <circle cx="80" cy="50" r="8" fill="#10b981" />
                  
                  {/* Outward Flow Vectors */}
                  <line x1="80" y1="50" x2="130" y2="50" stroke="#34d399" strokeWidth="2" markerEnd="url(#divArrow)" />
                  <line x1="80" y1="50" x2="30" y2="50" stroke="#34d399" strokeWidth="2" markerEnd="url(#divArrow)" />
                  <line x1="80" y1="50" x2="80" y2="10" stroke="#34d399" strokeWidth="2" markerEnd="url(#divArrow)" />
                  <line x1="80" y1="50" x2="80" y2="90" stroke="#34d399" strokeWidth="2" markerEnd="url(#divArrow)" />
                  
                  <defs>
                    <marker id="divArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                    </marker>
                  </defs>
                </svg>
                <p className="text-[10px] text-slate-400 mt-2">div &gt; 0: Source de fluide (Flux sortant net)</p>
              </div>

              {/* 3. Rotationnel SVG */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                <span className="font-bold text-amber-300 mb-2">3. Rotationnel (Tourbillon)</span>
                <svg width="160" height="100" viewBox="0 0 160 100" className="w-full max-w-[160px]">
                  <path d="M 40 50 A 40 25 0 1 1 120 50" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rotArrow)" />
                  <line x1="80" y1="50" x2="80" y2="15" stroke="#f43f5e" strokeWidth="2.5" markerEnd="url(#rotArrowUp)" />
                  <text x="88" y="20" fill="#f43f5e" fontSize="10" fontWeight="bold">rot A</text>

                  <defs>
                    <marker id="rotArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                    <marker id="rotArrowUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                    </marker>
                  </defs>
                </svg>
                <p className="text-[10px] text-slate-400 mt-2">rot ≠ 0: Rotation locale du fluide (Tourbillon)</p>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
