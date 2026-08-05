"use client";

import React from "react";
import LatexMath from "@/components/ui/LatexMath";
import ThreeDCoordinateCanvas from "../components/ThreeDCoordinateCanvas";
import VectorProductSimulator from "../components/VectorProductSimulator";

export default function Chap1RappelsMathematiques() {
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
          Visualisez directement les <strong>arcs d'angles 3D</strong> (l'angle azimutal <span className="text-emerald-400 font-bold">φ</span> en vert et l'angle zénithal <span className="text-amber-400 font-bold">θ</span> en or).
        </p>

        {/* Three.js WebGL Canvas Component with Visual 3D Angle Arcs */}
        <ThreeDCoordinateCanvas />
      </section>

      {/* SECTION 4: DÉRIVATION DES VECTEURS DE LA BASE MOBILE */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <span>Partie 4 • Dérivation des Base Mobiles</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          4. Dérivation des Vecteurs de Base Locaux par rapport au Temps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Base Cylindrique */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">A. Base Cylindrique <LatexMath math="(\vec{e}_\rho, \vec{e}_\phi, \vec{e}_z)" /></h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0"><LatexMath math="\frac{d\vec{e}_\rho}{dt} :" /></span>
                <LatexMath math="\dot{\phi} \vec{e}_\phi" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0"><LatexMath math="\frac{d\vec{e}_\phi}{dt} :" /></span>
                <LatexMath math="-\dot{\phi} \vec{e}_\rho" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0"><LatexMath math="\frac{d\vec{e}_z}{dt} :" /></span>
                <LatexMath math="\vec{0}" />
              </div>
            </div>
          </div>

          {/* Base Sphérique */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">B. Base Sphérique <LatexMath math="(\vec{e}_r, \vec{e}_\theta, \vec{e}_\phi)" /></h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0"><LatexMath math="\frac{d\vec{e}_r}{dt} :" /></span>
                <LatexMath math="\dot{\theta} \vec{e}_\theta + \dot{\phi}\sin\theta \vec{e}_\phi" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0"><LatexMath math="\frac{d\vec{e}_\theta}{dt} :" /></span>
                <LatexMath math="-\dot{\theta} \vec{e}_r + \dot{\phi}\cos\theta \vec{e}_\phi" />
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-card border border-border/40 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="shrink-0"><LatexMath math="\frac{d\vec{e}_\phi}{dt} :" /></span>
                <LatexMath math="-\dot{\phi} (\sin\theta \vec{e}_r + \cos\theta \vec{e}_\theta)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: OPÉRATEURS DIFFÉRENTIELS (NABLA, GRAD, DIV, ROT, CIRCULATION) */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <span>Partie 5 • Champs & Opérateurs Différentiels</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          5. Opérateurs Différentiels : Nabla, Gradient, Divergence, Rotationnel & Circulation
        </h2>

        <div className="space-y-4">
          {/* Gradient */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-3 flex flex-wrap items-center justify-between gap-1">
              <span>A. Opérateur Gradient : <LatexMath math="\vec{\mathrm{grad}}(f) = \vec{\nabla}f" /></span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Champ scalaire → vectoriel</span>
            </h3>
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

          {/* Divergence & Rotationnel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">B. Divergence : <LatexMath math="\mathrm{div}(\vec{A}) = \vec{\nabla} \cdot \vec{A}" /></h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-2">Flux sortant net par unité de volume (scalaire).</p>
              <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border/40 text-center font-bold overflow-x-auto custom-scrollbar">
                <LatexMath math="\mathrm{div}(\vec{A}) = \frac{\partial A_x}{\partial x} + \frac{\partial A_y}{\partial y} + \frac{\partial A_z}{\partial z}" block />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50">
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">C. Rotationnel : <LatexMath math="\vec{\mathrm{rot}}(\vec{A}) = \vec{\nabla} \wedge \vec{A}" /></h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-2">Circulation locale / tourbillonnement (vecteur).</p>
              <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border/40 text-center font-bold overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{\mathrm{rot}}(\vec{A}) = \left(\frac{\partial A_z}{\partial y} - \frac{\partial A_y}{\partial z}\right)\vec{i} + \dots" block />
              </div>
            </div>
          </div>

          {/* Circulation & Flux (Stokes & Ostrogradsky) */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-2">D. Circulation, Flux & Théorèmes d'Intégration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-card border border-border/40 text-center overflow-x-auto custom-scrollbar">
                <div className="font-sans font-bold text-foreground mb-1 text-[11px] sm:text-xs">Théorème d'Ostrogradsky (Flux):</div>
                <LatexMath math="\iint_S \vec{A} \cdot d\vec{S} = \iiint_V \mathrm{div}(\vec{A})\,dV" block />
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/40 text-center overflow-x-auto custom-scrollbar">
                <div className="font-sans font-bold text-foreground mb-1 text-[11px] sm:text-xs">Théorème de Stokes (Circulation):</div>
                <LatexMath math="\oint_C \vec{A} \cdot d\vec{\ell} = \iint_S \vec{\mathrm{rot}}(\vec{A}) \cdot d\vec{S}" block />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
