"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import KinematicsTrajectory3DCanvas from "../components/KinematicsTrajectory3DCanvas";
import FrenetFrame3DCanvas from "../components/FrenetFrame3DCanvas";
import RelativeMotion3DCanvas from "../components/RelativeMotion3DCanvas";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Compass, Activity, Target, CheckCircle2, RefreshCw, Zap } from "lucide-react";

export default function Chap2CinematiqueDuPoint() {
  // Accordions for step-by-step mathematical proofs
  const [showVectPosProof, setShowVectPosProof] = useState(false);
  const [showVitProof, setShowVitProof] = useState(false);
  const [showAccProof, setShowAccProof] = useState(false);
  const [showFrenetProof, setShowFrenetProof] = useState(false);
  const [showBourProof, setShowBourProof] = useState(false);
  const [showCompProof, setShowCompProof] = useState(false);

  // Accordions for Exercise Solutions
  const [showEx1Solution, setShowEx1Solution] = useState(false);
  const [showEx2Solution, setShowEx2Solution] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* PARTIE 1: VECTEUR POSITION OM(t) DANS TOUS LES SYSTÈMES DE COORDONNÉES */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <span>Partie 1 • Repérage du Mouvement & Vecteur Position OM(t)</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Vecteur Position <LatexMath math="\vec{OM}(t)" /> dans tous les Systèmes de Coordonnées
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 font-medium">
          La cinématique étudie le mouvement d'un point matériel <LatexMath math="M" /> au cours du temps <LatexMath math="t" /> par rapport à un <strong>référentiel d'étude <LatexMath math="\mathcal{R}(O, \vec{i}, \vec{j}, \vec{k})" /></strong>. La position est repérée par le vecteur <LatexMath math="\vec{OM}(t)" />.
        </p>

        {/* 3 Coordinate Systems Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          
          {/* Cartésien */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 block mb-1 font-sans">1. Coordonnées Cartésiennes</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-purple-300 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{OM}(t) = x(t)\vec{i} + y(t)\vec{j} + z(t)\vec{k}" block />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                <strong>Description :</strong> Projections orthogonales indépendantes sur 3 axes fixes. Les vecteurs unitaires <LatexMath math="(\vec{i},\vec{j},\vec{k})" /> sont immobiles.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground font-mono border-t border-border/40 pt-2">
              Norme : <LatexMath math="\|\vec{OM}\| = \sqrt{x^2 + y^2 + z^2}" />
            </div>
          </div>

          {/* Cylindrique */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-1 font-sans">2. Coordonnées Cylindriques</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-emerald-300 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{OM}(t) = \rho(t)\vec{e}_\rho + z(t)\vec{e}_z" block />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                <strong>Description :</strong> Somme de la projection horizontale <LatexMath math="\vec{OH} = \rho\vec{e}_\rho" /> et de la hauteur <LatexMath math="z\vec{e}_z" />. L'angle <LatexMath math="\phi" /> est intégré dans <LatexMath math="\vec{e}_\rho" />.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground font-mono border-t border-border/40 pt-2">
              Norme : <LatexMath math="\|\vec{OM}\| = \sqrt{\rho^2 + z^2}" />
            </div>
          </div>

          {/* Sphérique */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 block mb-1 font-sans">3. Coordonnées Sphériques</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-amber-300 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{OM}(t) = r(t)\vec{e}_r" block />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                <strong>Description :</strong> Le vecteur radial <LatexMath math="\vec{e}_r" /> pointe directement de <LatexMath math="O" /> vers <LatexMath math="M" />. Les angles <LatexMath math="(\theta, \phi)" /> orientent <LatexMath math="\vec{e}_r" /> f 3D.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground font-mono border-t border-border/40 pt-2">
              Norme : <LatexMath math="\|\vec{OM}\| = r(t)" />
            </div>
          </div>

        </div>
      </section>

      {/* PARTIE 2: VECTEUR VITESSE AVEC DÉMONSTRATIONS DANS TOUS LES SYSTEMES & SIMULATEUR 3D */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <span>Partie 2 • Vecteur Vitesse Instantanée & Démonstrations</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. Vecteur Vitesse Instantanée <LatexMath math="\vec{v}(t)" /> et Démonstrations Complètes
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Le vecteur vitesse instantanée du point <LatexMath math="M" /> par rapport à <LatexMath math="\mathcal{R}" /> est défini par :
          <LatexMath math="\vec{v}(M/\mathcal{R}) = \left[ \frac{d\vec{OM}}{dt} \right]_\mathcal{R}" className="ml-2 font-bold text-emerald-400 font-mono" />.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
            <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cartésien</div>
            <LatexMath math="\vec{v} = \dot{x}\vec{i} + \dot{y}\vec{j} + \dot{z}\vec{k}" />
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
            <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cylindrique</div>
            <LatexMath math="\vec{v} = \dot{\rho}\vec{e}_\rho + \rho\dot{\phi}\vec{e}_\phi + \dot{z}\vec{e}_z" />
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
            <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Sphérique</div>
            <LatexMath math="\vec{v} = \dot{r}\vec{e}_r + r\dot{\theta}\vec{e}_\theta + r\dot{\phi}\sin\theta\vec{e}_\phi" />
          </div>
        </div>

        {/* ACCORDION DEMONSTRATIONS VITESSE */}
        <div className="mb-6">
          <button
            onClick={() => setShowVitProof(!showVitProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstrations Détaillées : Calcul du Vecteur Vitesse dans les 3 Repères</span>
            </span>
            {showVitProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showVitProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-4 leading-relaxed animate-in fade-in duration-200">
              
              {/* Proof Cylindrique */}
              <div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold mb-1.5">
                  A. Démonstration en Coordonnées Cylindriques :
                </div>
                <p>On dérive <LatexMath math="\vec{OM} = \rho \vec{e}_\rho + z \vec{e}_z" /> par rapport au temps :</p>
                <p><LatexMath math="\frac{d\vec{OM}}{dt} = \frac{d\rho}{dt}\vec{e}_\rho + \rho \frac{d\vec{e}_\rho}{dt} + \frac{dz}{dt}\vec{e}_z + z \frac{d\vec{e}_z}{dt}" /></p>
                <p>Or <LatexMath math="\frac{d\vec{e}_z}{dt} = \vec{0}" /> et <LatexMath math="\frac{d\vec{e}_\rho}{dt} = \dot{\phi}\vec{e}_\phi" />.</p>
                <p className="text-emerald-400 font-bold pt-1">
                  <LatexMath math="\implies \vec{v} = \dot{\rho}\vec{e}_\rho + \rho\dot{\phi}\vec{e}_\phi + \dot{z}\vec{e}_z" />
                </p>
              </div>

              {/* Proof Sphérique */}
              <div className="border-t border-slate-800 pt-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold mb-1.5">
                  B. Démonstration en Coordonnées Sphériques :
                </div>
                <p>On dérive <LatexMath math="\vec{OM} = r \vec{e}_r" /> par rapport au temps :</p>
                <p><LatexMath math="\frac{d\vec{OM}}{dt} = \frac{dr}{dt}\vec{e}_r + r \frac{d\vec{e}_r}{dt}" /></p>
                <p>D'après les dérivées de la base sphérique : <LatexMath math="\frac{d\vec{e}_r}{dt} = \dot{\theta}\vec{e}_\theta + \dot{\phi}\sin\theta\vec{e}_\phi" />.</p>
                <p className="text-amber-400 font-bold pt-1">
                  <LatexMath math="\implies \vec{v} = \dot{r}\vec{e}_r + r\dot{\theta}\vec{e}_\theta + r\dot{\phi}\sin\theta\vec{e}_\phi" />
                </p>
              </div>

            </div>
          )}
        </div>

        {/* 3D WEBGL TRAJECTORY SIMULATOR */}
        <KinematicsTrajectory3DCanvas />
      </section>

      {/* PARTIE 3: VECTEUR ACCÉLÉRATION AVEC DÉMONSTRATIONS DANS TOUS LES SYSTÈMES */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <span>Partie 3 • Vecteur Accélération Instantanée & Démonstrations</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          3. Vecteur Accélération Instantanée <LatexMath math="\vec{a}(t)" /> et Démonstrations Complètes
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          L'accélération est la dérivée du vecteur vitesse : <LatexMath math="\vec{a}(M/\mathcal{R}) = \left[\frac{d\vec{v}}{dt}\right]_\mathcal{R} = \left[\frac{d^2\vec{OM}}{dt^2}\right]_\mathcal{R}" className="font-bold text-rose-400 font-mono ml-1" />.
        </p>

        {/* Acceleration Formulas Grid */}
        <div className="space-y-3 font-mono text-xs mb-4">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="font-sans font-bold text-purple-400 text-xs block mb-1.5">A. Cartésien :</span>
            <LatexMath math="\vec{a} = \ddot{x}\vec{i} + \ddot{y}\vec{j} + \ddot{z}\vec{k}" />
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="font-sans font-bold text-emerald-400 text-xs block mb-1.5">B. Cylindrique (avec termes de Coriolis et centripètes) :</span>
            <LatexMath math="\vec{a} = (\ddot{\rho} - \rho\dot{\phi}^2)\vec{e}_\rho + (\rho\ddot{\phi} + 2\dot{\rho}\dot{\phi})\vec{e}_\phi + \ddot{z}\vec{e}_z" />
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="font-sans font-bold text-amber-400 text-xs block mb-1.5">C. Sphérique :</span>
            <LatexMath math="\vec{a} = (\ddot{r} - r\dot{\theta}^2 - r\dot{\phi}^2\sin^2\theta)\vec{e}_r + (r\ddot{\theta} + 2\dot{r}\dot{\theta} - r\dot{\phi}^2\sin\theta\cos\theta)\vec{e}_\theta + (r\ddot{\phi}\sin\theta + 2\dot{r}\dot{\phi}\sin\theta + 2r\dot{\theta}\dot{\phi}\cos\theta)\vec{e}_\phi" />
          </div>
        </div>

        {/* ACCORDION DEMONSTRATION ACCÉLÉRATION CYLINDRIQUE */}
        <div>
          <button
            onClick={() => setShowAccProof(!showAccProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-rose-400 hover:text-rose-300 transition-all p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Calcul de l'Accélération en Coordonnées Cylindriques</span>
            </span>
            {showAccProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAccProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-rose-400 font-bold">1. Dérivation du vecteur vitesse <LatexMath math="\vec{v} = \dot{\rho}\vec{e}_\rho + \rho\dot{\phi}\vec{e}_\phi + \dot{z}\vec{e}_z" /> :</p>
              <p><LatexMath math="\frac{d\vec{v}}{dt} = \frac{d}{dt}(\dot{\rho}\vec{e}_\rho) + \frac{d}{dt}(\rho\dot{\phi}\vec{e}_\phi) + \frac{d}{dt}(\dot{z}\vec{e}_z)" /></p>
              <p>• <LatexMath math="\frac{d}{dt}(\dot{\rho}\vec{e}_\rho) = \ddot{\rho}\vec{e}_\rho + \dot{\rho}\frac{d\vec{e}_\rho}{dt} = \ddot{\rho}\vec{e}_\rho + \dot{\rho}\dot{\phi}\vec{e}_\phi" /></p>
              <p>• <LatexMath math="\frac{d}{dt}(\rho\dot{\phi}\vec{e}_\phi) = \dot{\rho}\dot{\phi}\vec{e}_\phi + \rho\ddot{\phi}\vec{e}_\phi + \rho\dot{\phi}\frac{d\vec{e}_\phi}{dt} = \dot{\rho}\dot{\phi}\vec{e}_\phi + \rho\ddot{\phi}\vec{e}_\phi - \rho\dot{\phi}^2\vec{e}_\rho" /></p>
              <p>• <LatexMath math="\frac{d}{dt}(\dot{z}\vec{e}_z) = \ddot{z}\vec{e}_z" /></p>
              
              <p className="text-amber-300 font-bold mt-2">2. Regroupement des termes selon les 3 vecteurs unitaires :</p>
              <p className="text-cyan-400 font-bold">
                <LatexMath math="\implies \vec{a} = (\ddot{\rho} - \rho\dot{\phi}^2)\vec{e}_\rho + (\rho\ddot{\phi} + 2\dot{\rho}\dot{\phi})\vec{e}_\phi + \ddot{z}\vec{e}_z" />
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PARTIE 4: REPÈRE DE FRENET & COMPOSANTES INTRINSÈQUES */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <span>Partie 4 • Repère Local de Frenet & Composantes Intrinsèques</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          4. Repère Local de Frenet <LatexMath math="(\vec{\tau}, \vec{n}, \vec{b})" /> et Rayon de Courbure <LatexMath math="R_c" />
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Le repère de Frenet est le repère intrinsèque lié au point mobile <LatexMath math="M" /> sur la trajectoire orientée par l'abscisse curviligne <LatexMath math="s(t)" />.
        </p>

        {/* Intrinsic Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-sans font-bold text-cyan-400 mb-2 text-xs">A. Vitesse Intrinsèque</h3>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center font-bold text-cyan-300">
              <LatexMath math="\vec{v} = v\vec{\tau} = \frac{ds}{dt}\vec{\tau}" block />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-sans font-bold text-rose-400 mb-2 text-xs">B. Accélération Intrinsèque</h3>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center font-bold text-rose-300">
              <LatexMath math="\vec{a} = a_t\vec{\tau} + a_n\vec{n} = \frac{dv}{dt}\vec{\tau} + \frac{v^2}{R_c}\vec{n}" block />
            </div>
          </div>
        </div>

        {/* ACCORDION DEMONSTRATION FRENET */}
        <div className="mb-6">
          <button
            onClick={() => setShowFrenetProof(!showFrenetProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-purple-400 hover:text-purple-300 transition-all p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Formule de Frenet-Serret et d(tau)/dt = (v/Rc) n</span>
            </span>
            {showFrenetProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFrenetProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-purple-400 font-bold">1. Dérivation de <LatexMath math="\vec{v} = v \vec{\tau}" /> par rapport à $t$ :</p>
              <p><LatexMath math="\vec{a} = \frac{d(v\vec{\tau})}{dt} = \frac{dv}{dt}\vec{\tau} + v \frac{d\vec{\tau}}{dt}" /></p>
              
              <p className="text-purple-400 font-bold mt-2">2. Règle de dérivation composée par l'abscisse curviligne $s$ :</p>
              <p><LatexMath math="\frac{d\vec{\tau}}{dt} = \frac{d\vec{\tau}}{ds} \cdot \frac{ds}{dt} = v \cdot \frac{d\vec{\tau}}{ds}" /></p>
              <p>Par géométrie de la courbure, <LatexMath math="\frac{d\vec{\tau}}{ds} = \frac{\vec{n}}{R_c}" /> (où $R_c$ est le rayon du cercle osculateur).</p>
              
              <p className="text-cyan-400 font-bold mt-2">
                <LatexMath math="\implies v \frac{d\vec{\tau}}{dt} = \frac{v^2}{R_c}\vec{n} \implies \vec{a} = \frac{dv}{dt}\vec{\tau} + \frac{v^2}{R_c}\vec{n}" />
              </p>
            </div>
          )}
        </div>

        {/* 3D FRENET CANVAS SIMULATOR */}
        <FrenetFrame3DCanvas />
      </section>

      {/* PARTIE 5: TYPES DE MOUVEMENTS REMARQUABLES */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <span>Partie 5 • Types de Mouvements Remarquables</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          5. Classification des Mouvements Remarquables
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* MRUV */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-amber-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>A. Mouvement Rectiligne Uniformément Varié (MRUV)</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>• Accélération : <LatexMath math="a(t) = a_0 = \text{Cte}" /></p>
              <p>• Vitesse : <LatexMath math="v(t) = a_0 t + v_0" /></p>
              <p>• Position : <LatexMath math="x(t) = \frac{1}{2}a_0 t^2 + v_0 t + x_0" /></p>
              <p>• Torricelli : <LatexMath math="v^2 - v_0^2 = 2 a_0 (x - x_0)" /></p>
            </div>
          </div>

          {/* MCU */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-cyan-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>B. Mouvement Circulaire Uniforme (MCU)</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>• Rayon <LatexMath math="R = \text{Cte}" />, Vitesse angulaire <LatexMath math="\omega = \dot{\theta} = \text{Cte}" /></p>
              <p>• Vitesse linéaire : <LatexMath math="v = R \omega" /></p>
              <p>• Accélération purement centripète : <LatexMath math="\vec{a} = -R\omega^2 \vec{e}_r" /></p>
              <p>• Période : <LatexMath math="T = \frac{2\pi}{\omega}" /></p>
            </div>
          </div>

          {/* Mouvement Hélicoïdal */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-emerald-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>C. Mouvement Hélicoïdal (Vis sans fin)</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>• Rotation circulaire uniforme <LatexMath math="\phi(t) = \omega t" /> + Translation uniforme <LatexMath math="z(t) = v_z t" /></p>
              <p>• Trajectoire en hélice de pas <LatexMath math="h = \frac{2\pi v_z}{\omega}" /></p>
            </div>
          </div>

          {/* Mouvement Parabolique */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-rose-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>D. Mouvement Parabolique (Champ de pesanteur)</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>• Accélération constante : <LatexMath math="\vec{a} = -g\vec{j}" /></p>
              <p>• Équation de trajectoire : <LatexMath math="y(x) = -\frac{g}{2 v_0^2 \cos^2\alpha} x^2 + x\tan\alpha" /></p>
            </div>
          </div>

        </div>
      </section>

      {/* PARTIE 6: CHANGEMENT DE RÉFÉRENTIEL, FORMULE DE BOUR & COMPOSITION DES VITESSES/ACCÉLÉRATIONS */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <span>Partie 6 • Changement de Référentiel, Formule de Bour & Composition</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          6. Formule de Bour, Composition des Vitesses et des Accélérations (Coriolis)
        </h2>

        {/* Formule de Bour Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 mb-6">
          <h3 className="text-sm sm:text-base font-bold text-rose-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>A. La Formule Fondamentale de Bour (Dérivation Vectorielle Relative)</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Soit un référentiel mobile <LatexMath math="\mathcal{R}'(O', \vec{i}', \vec{j}', \vec{k}')" /> tournant à la vitesse angulaire instantanée <LatexMath math="\vec{\Omega}(\mathcal{R}'/\mathcal{R})" /> par rapport au référentiel fixe <LatexMath math="\mathcal{R}(O, \vec{i}, \vec{j}, \vec{k})" />. Pour tout vecteur <LatexMath math="\vec{A}" /> :
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs sm:text-sm font-bold text-rose-300 overflow-x-auto custom-scrollbar">
            <LatexMath math="\left[ \frac{d\vec{A}}{dt} \right]_\mathcal{R} = \left[ \frac{d\vec{A}}{dt} \right]_{\mathcal{R}'} + \vec{\Omega}(\mathcal{R}'/\mathcal{R}) \wedge \vec{A}" block />
          </div>
        </div>

        {/* Composition des Vitesses et Accélérations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Composition des Vitesses */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-cyan-400 text-xs sm:text-sm mb-2">B. Loi de Composition des Vitesses</h3>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-xs font-bold text-cyan-300 mb-2">
              <LatexMath math="\vec{v}_a = \vec{v}_r + \vec{v}_e" block />
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 font-sans">
              <p>• <strong>Vitesse Absolue :</strong> <LatexMath math="\vec{v}_a = \vec{v}(M/\mathcal{R})" /></p>
              <p>• <strong>Vitesse Relative :</strong> <LatexMath math="\vec{v}_r = \vec{v}(M/\mathcal{R}')" /></p>
              <p>• <strong>Vitesse d'Entraînement :</strong> <LatexMath math="\vec{v}_e = \vec{v}(O'/\mathcal{R}) + \vec{\Omega}(\mathcal{R}'/\mathcal{R}) \wedge \vec{O'M}" /></p>
            </div>
          </div>

          {/* Composition des Accélérations */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-rose-400 text-xs sm:text-sm mb-2">C. Loi de Composition des Accélérations</h3>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-xs font-bold text-rose-300 mb-2">
              <LatexMath math="\vec{a}_a = \vec{a}_r + \vec{a}_e + \vec{a}_c" block />
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 font-sans">
              <p>• <strong>Accélération Relative :</strong> <LatexMath math="\vec{a}_r = \vec{a}(M/\mathcal{R}')" /></p>
              <p>• <strong>Accélération d'Entraînement :</strong> <LatexMath math="\vec{a}_e = \vec{a}(O'/\mathcal{R}) + \dot{\vec{\Omega}} \wedge \vec{O'M} + \vec{\Omega} \wedge (\vec{\Omega} \wedge \vec{O'M})" /></p>
              <p>• <strong>Accélération de Coriolis :</strong> <LatexMath math="\vec{a}_c = 2 \vec{\Omega}(\mathcal{R}'/\mathcal{R}) \wedge \vec{v}_r" className="text-rose-400 font-bold" /></p>
            </div>
          </div>

        </div>

        {/* ACCORDION DEMONSTRATION BOUR & COMPOSITION */}
        <div className="mb-6">
          <button
            onClick={() => setShowCompProof(!showCompProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-rose-400 hover:text-rose-300 transition-all p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Dérivation de va = vr + ve et Accélération de Coriolis</span>
            </span>
            {showCompProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-rose-400 font-bold">1. Décomposition du vecteur position : <LatexMath math="\vec{OM} = \vec{OO'} + \vec{O'M}" /></p>
              <p>En dérivant dans <LatexMath math="\mathcal{R}" /> :</p>
              <p><LatexMath math="\vec{v}_a = \left[\frac{d\vec{OM}}{dt}\right]_\mathcal{R} = \left[\frac{d\vec{OO'}}{dt}\right]_\mathcal{R} + \left[\frac{d\vec{O'M}}{dt}\right]_\mathcal{R}" /></p>
              <p>En exprimant <LatexMath math="\vec{O'M} = x'\vec{i}' + y'\vec{j}' + z'\vec{k}'" /> et en appliquant la formule de Bour :</p>
              <p><LatexMath math="\left[\frac{d\vec{O'M}}{dt}\right]_\mathcal{R} = \left[\frac{d\vec{O'M}}{dt}\right]_{\mathcal{R}'} + \vec{\Omega} \wedge \vec{O'M} = \vec{v}_r + \vec{\Omega} \wedge \vec{O'M}" /></p>
              <p className="text-cyan-400 font-bold"><LatexMath math="\implies \vec{v}_a = \vec{v}_r + \left( \vec{v}(O'/\mathcal{R}) + \vec{\Omega} \wedge \vec{O'M} \right) = \vec{v}_r + \vec{v}_e" /></p>
              
              <p className="text-rose-400 font-bold mt-3">2. Dérivation pour obtenir l'accélération absolue :</p>
              <p><LatexMath math="\vec{a}_a = \left[\frac{d\vec{v}_a}{dt}\right]_\mathcal{R} = \left[\frac{d(\vec{v}_r + \vec{v}_e)}{dt}\right]_\mathcal{R}" /></p>
              <p>En appliquant la formule de Bour à <LatexMath math="\vec{v}_r" /> : <LatexMath math="\left[\frac{d\vec{v}_r}{dt}\right]_\mathcal{R} = \left[\frac{d\vec{v}_r}{dt}\right]_{\mathcal{R}'} + \vec{\Omega} \wedge \vec{v}_r = \vec{a}_r + \vec{\Omega} \wedge \vec{v}_r" />.</p>
              <p>La dérivation de <LatexMath math="\vec{v}_e" /> fait apparaître un deuxième terme <LatexMath math="\vec{\Omega} \wedge \vec{v}_r" />, ce qui donne le terme de Coriolis :</p>
              <p className="text-emerald-400 font-bold"><LatexMath math="\implies \vec{a}_c = 2 \vec{\Omega} \wedge \vec{v}_r" /></p>
            </div>
          )}
        </div>

        {/* 3D RELATIVE MOTION SIMULATOR */}
        <RelativeMotion3DCanvas />
      </section>

      {/* PARTIE 7: EXERCICES D'APPLICATION RÉSOLUS TYPE CONCOURS */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold mb-3">
          <span>Partie 7 • Applications Pratiques & Exercices Type Concours</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          7. Exercices d'Application Résolus (CPGE / Concours)
        </h2>

        {/* Exercice 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Exercice 1 : Coulissement sur une Tige en Rotation (Coriolis)</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">Niveau Concours</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Une tige <LatexMath math="OA" /> tourne dans un plan horizontal autour de <LatexMath math="O" /> avec une vitesse angulaire constante <LatexMath math="\vec{\Omega} = \omega \vec{k}" /> par rapport à un repère fixe <LatexMath math="\mathcal{R}" />. Un manchon <LatexMath math="M" /> se déplace le long de la tige avec la loi <LatexMath math="r(t) = v_0 t" />.<br />
            1. Calculer la vitesse relative <LatexMath math="\vec{v}_r" /> et la vitesse d'entraînement <LatexMath math="\vec{v}_e" />.<br />
            2. Calculer l'accélération de Coriolis <LatexMath math="\vec{a}_c" />.
          </p>

          <button
            onClick={() => setShowEx1Solution(!showEx1Solution)}
            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showEx1Solution ? "Masquer la Solution" : "Afficher la Solution Détaillée"}</span>
            {showEx1Solution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showEx1Solution && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
              <p className="text-indigo-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Vitesses :</span>
              </p>
              <p>• Vitesse relative (dans le repère lié à la tige) : <LatexMath math="\vec{v}_r = \dot{r}\vec{e}_r = v_0 \vec{e}_r" /></p>
              <p>• Vitesse d'entraînement : <LatexMath math="\vec{v}_e = \vec{\Omega} \wedge \vec{OM} = (\omega \vec{k}) \wedge (r\vec{e}_r) = r\omega \vec{e}_\theta = v_0 \omega t \vec{e}_\theta" /></p>
              <p>• Vitesse absolue : <LatexMath math="\vec{v}_a = v_0 \vec{e}_r + v_0 \omega t \vec{e}_\theta" className="text-cyan-400 font-bold" /></p>

              <p className="text-indigo-400 font-bold flex items-center gap-1.5 mt-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Accélération de Coriolis :</span>
              </p>
              <p>• <LatexMath math="\vec{a}_c = 2 \vec{\Omega} \wedge \vec{v}_r = 2 (\omega \vec{k}) \wedge (v_0 \vec{e}_r) = 2 v_0 \omega \vec{e}_\theta" className="text-rose-400 font-bold" /></p>
            </div>
          )}
        </div>

        {/* Exercice 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Exercice 2 : Rayon de Courbure au Sommet d'une Trajectoire Parabolique</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">Niveau Concours</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Un projectile est lancé avec une vitesse initiale <LatexMath math="\vec{v}_0 = v_{0x}\vec{i} + v_{0y}\vec{j}" /> dans un champ de pesanteur uniforme <LatexMath math="\vec{g} = -g\vec{j}" />.<br />
            Déterminer le rayon de courbure <LatexMath math="R_c" /> de la trajectoire au sommet <LatexMath math="S" />.
          </p>

          <button
            onClick={() => setShowEx2Solution(!showEx2Solution)}
            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showEx2Solution ? "Masquer la Solution" : "Afficher la Solution Détaillée"}</span>
            {showEx2Solution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showEx2Solution && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
              <p className="text-indigo-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solution Étape par Étape :</span>
              </p>
              <p>1. Au sommet <LatexMath math="S" />, la vitesse verticale est nulle : <LatexMath math="v_y(S) = 0 \implies \vec{v}_S = v_{0x}\vec{i}" />.</p>
              <p>2. L'accélération est <LatexMath math="\vec{a} = -g\vec{j}" /> (orientée vers le bas).</p>
              <p>3. Au sommet <LatexMath math="S" />, le vecteur unitaire normal de Frenet est <LatexMath math="\vec{n} = -\vec{j}" />.</p>
              <p>4. Donc <LatexMath math="a_n = g = \frac{v_S^2}{R_c} = \frac{v_{0x}^2}{R_c}" />.</p>
              <p className="text-emerald-400 font-bold pt-1 border-t border-slate-800/80">
                <LatexMath math="\implies R_c(S) = \frac{v_{0x}^2}{g}" />
              </p>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
