"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import KinematicsTrajectory3DCanvas from "../components/KinematicsTrajectory3DCanvas";
import FrenetFrame3DCanvas from "../components/FrenetFrame3DCanvas";
import RelativeMotion3DCanvas from "../components/RelativeMotion3DCanvas";
import ChaslesReferenceFrames3DCanvas from "../components/ChaslesReferenceFrames3DCanvas";
import ExerciseCircleRolling3DCanvas from "../components/ExerciseCircleRolling3DCanvas";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Compass, Activity, Target, CheckCircle2, RefreshCw, Zap, ArrowRight } from "lucide-react";

export default function Chap2CinematiqueDuPoint() {
  // Accordions for step-by-step mathematical proofs matching Sersif Académie notes
  const [showBaseChangeProof, setShowBaseChangeProof] = useState(false);
  const [showVitProof, setShowVitProof] = useState(false);
  const [showAccProof, setShowAccProof] = useState(false);
  const [showFrenetProof, setShowFrenetProof] = useState(false);
  const [showBourProof, setShowBourProof] = useState(false);
  const [showCompVitProof, setShowCompVitProof] = useState(false);
  const [showCompAccProof, setShowCompAccProof] = useState(false);

  // Accordions for 3 Application Exercises Solutions
  const [showEx1Solution, setShowEx1Solution] = useState(false);
  const [showEx2Solution, setShowEx2Solution] = useState(false);
  const [showEx3Solution, setShowEx3Solution] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* PARTIE 1: SYSTÈMES DE COORDONNÉES ET VECTEUR POSITION OM(t) */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <span>Partie 1 • Systèmes de Coordonnées & Vecteur Position OM(t)</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Systèmes de Coordonnées et Expression du Vecteur Position <LatexMath math="\vec{OM}(t)" />
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 font-medium">
          Dans un référentiel d'étude <LatexMath math="\mathcal{R}(O, \vec{i}, \vec{j}, \vec{k})" />, la position du point matériel <LatexMath math="M" /> est repérée par le vecteur position <LatexMath math="\vec{OM}(t)" /> exprimé dans le système de coordonnées adapté à la géométrie du problème.
        </p>

        {/* 3 Coordinate Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          
          {/* Cartésien */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 block mb-1 font-sans">1. Coordonnées Cartésiennes</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-purple-300 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{OM} = x_m\vec{i} + y_m\vec{j} + z_m\vec{k}" block />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                <strong>Vecteurs de base :</strong> <LatexMath math="(\vec{i}, \vec{j}, \vec{k})" /> sont <strong>fixes et immuables dans le temps</strong>.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground font-mono border-t border-border/40 pt-2">
              Domaine : <LatexMath math="-\infty < x, y, z < +\infty" />
            </div>
          </div>

          {/* Cylindrique */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-1 font-sans">2. Coordonnées Cylindriques</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-emerald-300 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{OM} = \rho\vec{e}_\rho + z\vec{e}_z" block />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                <strong>Vecteurs mobiles :</strong> <LatexMath math="\vec{e}_\rho = \cos\theta \vec{e}_x + \sin\theta \vec{e}_y" /> et <LatexMath math="\vec{e}_\theta = -\sin\theta \vec{e}_x + \cos\theta \vec{e}_y" />.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground font-mono border-t border-border/40 pt-2">
              Domaine : <LatexMath math="0 \le \rho < \infty \,;\, 0 \le \theta \le 2\pi \,;\, -\infty < z < +\infty" />
            </div>
          </div>

          {/* Sphérique */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 block mb-1 font-sans">3. Coordonnées Sphériques</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-amber-300 mb-3 overflow-x-auto custom-scrollbar">
                <LatexMath math="\vec{OM} = r\vec{e}_r" block />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                <strong>Vecteurs mobiles :</strong> <LatexMath math="\vec{e}_r = \sin\theta\cos\phi\vec{e}_x + \sin\theta\sin\phi\vec{e}_y + \cos\theta\vec{e}_z" />.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground font-mono border-t border-border/40 pt-2">
              Domaine : <LatexMath math="0 < r < \infty \,;\, 0 \le \theta \le \pi \,;\, 0 \le \phi \le 2\pi" />
            </div>
          </div>

        </div>

        {/* ACCORDION BASE TRANSFORMATIONS PROOF */}
        <div>
          <button
            onClick={() => setShowBaseChangeProof(!showBaseChangeProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 transition-all p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Relations de Passage entre toutes les Bases (Cartésien, Cylindrique & Sphérique)</span>
            </span>
            {showBaseChangeProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBaseChangeProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
                1. Passage de la Base Cartésienne à la Base Cylindrique :
              </div>
              <p>Par projection orthogonale dans le plan horizontal <LatexMath math="(O, \vec{e}_x, \vec{e}_y)" /> :</p>
              <p><LatexMath math="\vec{e}_\rho = \cos\theta \vec{e}_x + \sin\theta \vec{e}_y" /></p>
              <p><LatexMath math="\vec{e}_\theta = \cos\left(\theta + \frac{\pi}{2}\right)\vec{e}_x + \sin\left(\theta + \frac{\pi}{2}\right)\vec{e}_y = -\sin\theta \vec{e}_x + \cos\theta \vec{e}_y" /></p>

              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold mt-3">
                2. Passage de la Base Cylindrique à la Base Sphérique :
              </div>
              <p>Par projection radiale dans le plan méridien <LatexMath math="(O, \vec{e}_\rho, \vec{e}_z)" /> :</p>
              <p><LatexMath math="\vec{e}_r = \sin\theta \vec{e}_\rho + \cos\theta \vec{e}_z" /></p>
              <p><LatexMath math="\vec{e}_\theta = \cos\theta \vec{e}_\rho - \sin\theta \vec{e}_z" /></p>
              <p>En substituant <LatexMath math="\vec{e}_\rho = \cos\phi \vec{e}_x + \sin\phi \vec{e}_y" />, on obtient les expressions cartésiennes complètes :</p>
              <p className="text-amber-400 font-bold">
                <LatexMath math="\vec{e}_r = \sin\theta\cos\phi\vec{e}_x + \sin\theta\sin\phi\vec{e}_y + \cos\theta\vec{e}_z" />
              </p>
              <p className="text-cyan-400 font-bold">
                <LatexMath math="\vec{e}_\theta = \cos\theta\cos\phi\vec{e}_x + \cos\theta\sin\phi\vec{e}_y - \sin\theta\vec{e}_z" />
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PARTIE 2: VECTEUR VITESSE AVEC DÉMONSTRATIONS DANS TOUS LES SYSTEMES & SIMULATEUR 3D */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <span>Partie 2 • Vecteur Vitesse Instantanée V(M/R) & Démonstrations</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. Vecteur Vitesse Instantanée <LatexMath math="\vec{V}(M/\mathcal{R})" /> et Démonstrations Complètes
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Le vecteur vitesse instantanée du point <LatexMath math="M" /> par rapport à <LatexMath math="\mathcal{R}" /> est :
          <LatexMath math="\vec{V}(M/\mathcal{R}) = \left[ \frac{d\vec{OM}}{dt} \right]_\mathcal{R}" className="ml-2 font-bold text-emerald-400 font-mono" />.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
            <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cartésien</div>
            <LatexMath math="\vec{V}(M/\mathcal{R}) = \dot{x}\vec{i} + \dot{y}\vec{j} + \dot{z}\vec{k}" />
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
            <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Cylindrique</div>
            <LatexMath math="\vec{V}(M/\mathcal{R}) = \dot{\rho}\vec{e}_\rho + \rho\dot{\phi}\vec{e}_\phi + \dot{z}\vec{e}_z" />
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
            <div className="text-[10px] text-muted-foreground font-sans font-bold mb-1">Sphérique</div>
            <LatexMath math="\vec{V}(M/\mathcal{R}) = \dot{r}\vec{e}_r + r\dot{\theta}\vec{e}_\theta + r\dot{\phi}\sin\theta\vec{e}_\phi" />
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
              <span>Démonstrations Détaillées : Calcul de V(M/R) dans TOUS les Repères (Cylindrique & Sphérique)</span>
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
                <p><LatexMath math="\vec{V}(M/\mathcal{R}) = \frac{d\rho}{dt}\vec{e}_\rho + \rho \frac{d\vec{e}_\rho}{dt} + \frac{dz}{dt}\vec{e}_z + z \frac{d\vec{e}_z}{dt}" /></p>
                <p>Or <LatexMath math="\frac{d\vec{e}_z}{dt} = \vec{0}" /> et <LatexMath math="\frac{d\vec{e}_\rho}{dt} = -\dot{\phi}\sin\phi\vec{i} + \dot{\phi}\cos\phi\vec{j} = \dot{\phi}\vec{e}_\phi" />.</p>
                <p className="text-emerald-400 font-bold pt-1">
                  <LatexMath math="\implies \vec{V}(M/\mathcal{R}) = \dot{\rho}\vec{e}_\rho + \rho\dot{\phi}\vec{e}_\phi + \dot{z}\vec{e}_z" />
                </p>
              </div>

              {/* Proof Sphérique */}
              <div className="border-t border-slate-800 pt-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold mb-1.5">
                  B. Démonstration en Coordonnées Sphériques :
                </div>
                <p>On dérive <LatexMath math="\vec{OM} = r \vec{e}_r" /> par rapport au temps :</p>
                <p><LatexMath math="\vec{V}(M/\mathcal{R}) = \frac{dr}{dt}\vec{e}_r + r \frac{d\vec{e}_r}{dt}" /></p>
                <p>D'après les dérivées de la base sphérique : <LatexMath math="\frac{d\vec{e}_r}{dt} = \dot{\theta}\vec{e}_\theta + \dot{\phi}\sin\theta\vec{e}_\phi" />.</p>
                <p className="text-amber-400 font-bold pt-1">
                  <LatexMath math="\implies \vec{V}(M/\mathcal{R}) = \dot{r}\vec{e}_r + r\dot{\theta}\vec{e}_\theta + r\dot{\phi}\sin\theta\vec{e}_\phi" />
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
          <span>Partie 3 • Vecteur Accélération γ(M/R) & Démonstrations</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          3. Vecteur Accélération Instantanée <LatexMath math="\vec{\gamma}(M/\mathcal{R})" /> et Démonstrations Complètes
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          L'accélération est la dérivée du vecteur vitesse : <LatexMath math="\vec{\gamma}(M/\mathcal{R}) = \left[\frac{d\vec{V}}{dt}\right]_\mathcal{R} = \left[\frac{d^2\vec{OM}}{dt^2}\right]_\mathcal{R}" className="font-bold text-rose-400 font-mono ml-1" />.
        </p>

        {/* Acceleration Formulas Grid */}
        <div className="space-y-3 font-mono text-xs mb-4">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="font-sans font-bold text-purple-400 text-xs block mb-1.5">A. Cartésien :</span>
            <LatexMath math="\vec{\gamma}(M/\mathcal{R}) = \ddot{x}\vec{i} + \ddot{y}\vec{j} + \ddot{z}\vec{k}" />
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="font-sans font-bold text-emerald-400 text-xs block mb-1.5">B. Cylindrique (termes de Coriolis et centripètes) :</span>
            <LatexMath math="\vec{\gamma}(M/\mathcal{R}) = (\ddot{\rho} - \rho\dot{\phi}^2)\vec{e}_\rho + (\rho\ddot{\phi} + 2\dot{\rho}\dot{\phi})\vec{e}_\phi + \ddot{z}\vec{e}_z" />
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="font-sans font-bold text-amber-400 text-xs block mb-1.5">C. Sphérique :</span>
            <LatexMath math="\vec{\gamma}(M/\mathcal{R}) = (\ddot{r} - r\dot{\theta}^2 - r\dot{\phi}^2\sin^2\theta)\vec{e}_r + (r\ddot{\theta} + 2\dot{r}\dot{\theta} - r\dot{\phi}^2\sin\theta\cos\theta)\vec{e}_\theta + (r\ddot{\phi}\sin\theta + 2\dot{r}\dot{\phi}\sin\theta + 2r\dot{\theta}\dot{\phi}\cos\theta)\vec{e}_\phi" />
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
              <span>Démonstration Détaillée : Calcul de l'Accélération γ(M/R) en Coordonnées Cylindriques</span>
            </span>
            {showAccProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAccProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-rose-400 font-bold">1. Dérivation du vecteur vitesse <LatexMath math="\vec{V} = \dot{\rho}\vec{e}_\rho + \rho\dot{\phi}\vec{e}_\phi + \dot{z}\vec{e}_z" /> :</p>
              <p><LatexMath math="\vec{\gamma} = \frac{d}{dt}(\dot{\rho}\vec{e}_\rho) + \frac{d}{dt}(\rho\dot{\phi}\vec{e}_\phi) + \frac{d}{dt}(\dot{z}\vec{e}_z)" /></p>
              <p>• <LatexMath math="\frac{d}{dt}(\dot{\rho}\vec{e}_\rho) = \ddot{\rho}\vec{e}_\rho + \dot{\rho}\frac{d\vec{e}_\rho}{dt} = \ddot{\rho}\vec{e}_\rho + \dot{\rho}\dot{\phi}\vec{e}_\phi" /></p>
              <p>• <LatexMath math="\frac{d}{dt}(\rho\dot{\phi}\vec{e}_\phi) = \dot{\rho}\dot{\phi}\vec{e}_\phi + \rho\ddot{\phi}\vec{e}_\phi + \rho\dot{\phi}\frac{d\vec{e}_\phi}{dt} = \dot{\rho}\dot{\phi}\vec{e}_\phi + \rho\ddot{\phi}\vec{e}_\phi - \rho\dot{\phi}^2\vec{e}_\rho" /></p>
              <p>• <LatexMath math="\frac{d}{dt}(\dot{z}\vec{e}_z) = \ddot{z}\vec{e}_z" /></p>
              
              <p className="text-amber-300 font-bold mt-2">2. Regroupement des termes selon les 3 vecteurs unitaires :</p>
              <p className="text-cyan-400 font-bold">
                <LatexMath math="\implies \vec{\gamma}(M/\mathcal{R}) = (\ddot{\rho} - \rho\dot{\phi}^2)\vec{e}_\rho + (\rho\ddot{\phi} + 2\dot{\rho}\dot{\phi})\vec{e}_\phi + \ddot{z}\vec{e}_z" />
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
              <LatexMath math="\vec{V}(M/\mathcal{R}) = \frac{ds}{dt}\vec{\tau} = \dot{s}\vec{\tau}" block />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-sans font-bold text-rose-400 mb-2 text-xs">B. Accélération Intrinsèque</h3>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center font-bold text-rose-300">
              <LatexMath math="\vec{\gamma}(M/\mathcal{R}) = a_T\vec{\tau} + a_N\vec{n} = \ddot{s}\vec{\tau} + \frac{\dot{s}^2}{R_c}\vec{n}" block />
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
              <span>Démonstration Détaillée : Formule de Frenet-Serret et obtention de a_N = v²/Rc</span>
            </span>
            {showFrenetProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFrenetProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-purple-400 font-bold">1. Dérivation du vecteur vitesse <LatexMath math="\vec{V} = \dot{s} \vec{\tau}" /> par rapport à $t$ :</p>
              <p><LatexMath math="\vec{\gamma} = \frac{d(\dot{s}\vec{\tau})}{dt} = \ddot{s}\vec{\tau} + \dot{s} \frac{d\vec{\tau}}{dt}" /></p>
              
              <p className="text-purple-400 font-bold mt-2">2. Règle de dérivation composée par l'angle $\theta$ et l'abscisse curviligne $s$ :</p>
              <p><LatexMath math="\frac{d\vec{\tau}}{dt} = \frac{d\vec{\tau}}{d\theta} \cdot \frac{d\theta}{dt} = \dot{\theta} \vec{n}" /></p>
              <p>Or <LatexMath math="ds = R_c d\theta \implies \frac{d\theta}{dt} = \frac{1}{R_c}\frac{ds}{dt} = \frac{\dot{s}}{R_c}" />.</p>
              
              <p className="text-cyan-400 font-bold mt-2">
                <LatexMath math="\implies \dot{s} \frac{d\vec{\tau}}{dt} = \frac{\dot{s}^2}{R_c}\vec{n} \implies \vec{\gamma}(M/\mathcal{R}) = \ddot{s}\vec{\tau} + \frac{\dot{s}^2}{R_c}\vec{n}" />
              </p>
            </div>
          )}
        </div>

        {/* 3D FRENET CANVAS SIMULATOR */}
        <FrenetFrame3DCanvas />
      </section>

      {/* PARTIE 5: TYPES DE MOUVEMENTS REMARQUABLES */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <span>Partie 5 • Types de Mouvements Remarquables</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          5. Classification des Mouvements Remarquables
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Synthèse des équations horaires, de vitesse et d'accélération pour les mouvements fondamentaux.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* MRUV */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-amber-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>A. Mouvement Rectiligne Uniformément Varié (MRUV)</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>• Accélération constante : <LatexMath math="a(t) = a_0 = \text{Cte}" /></p>
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
              <p>• Accélération centripète : <LatexMath math="\vec{\gamma} = -R\omega^2 \vec{e}_r" /></p>
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
              <p>• Rotation uniforme <LatexMath math="\phi(t) = \omega t" /> + Translation uniforme <LatexMath math="z(t) = v_z t" /></p>
              <p>• Hélice 3D de pas <LatexMath math="h = \frac{2\pi v_z}{\omega}" /></p>
            </div>
          </div>

          {/* Mouvement Parabolique */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <h3 className="font-bold text-rose-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>D. Mouvement Parabolique (Champ de pesanteur)</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>• Accélération constante : <LatexMath math="\vec{\gamma} = -g\vec{j}" /></p>
              <p>• Équation de trajectoire : <LatexMath math="y(x) = -\frac{g}{2 v_0^2 \cos^2\alpha} x^2 + x\tan\alpha" /></p>
            </div>
          </div>

        </div>
      </section>

      {/* PARTIE 6: CHANGEMENT DE RÉFÉRENTIELS, FORMULE DE BOUR & COMPOSITION DES VITESSES ET ACCÉLÉRATIONS */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <span>Partie 6 • Changement de Référentiels, Formule de Bour & Composition</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          6. Formule de Bour, Composition des Vitesses et des Accélérations (Coriolis)
        </h2>

        {/* 3D REFERENCE FRAMES & CHASLES CANVAS */}
        <div className="mb-6">
          <ChaslesReferenceFrames3DCanvas />
        </div>

        {/* Formule de Bour Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 mb-4">
          <h3 className="text-sm sm:text-base font-bold text-rose-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>A. La Formule Fondamentale de Bour (Dérivation Vectorielle Relative)</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Soit un référentiel mobile <LatexMath math="\mathcal{R}_1(O_1, \vec{i}_1, \vec{j}_1, \vec{k}_1)" /> tournant à la vitesse angulaire instantanée <LatexMath math="\vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0)" /> par rapport au référentiel fixe <LatexMath math="\mathcal{R}_0(O, \vec{i}_0, \vec{j}_0, \vec{k}_0)" />. Pour tout vecteur <LatexMath math="\vec{V}_1" /> :
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs sm:text-sm font-bold text-rose-300 overflow-x-auto custom-scrollbar">
            <LatexMath math="\left[ \frac{d\vec{V}_1}{dt} \right]_{\mathcal{R}_0} = \left[ \frac{d\vec{V}_1}{dt} \right]_{\mathcal{R}_1} + \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{V}_1" block />
          </div>
        </div>

        {/* ACCORDION DEMONSTRATION FORMULE DE BOUR */}
        <div className="mb-6">
          <button
            onClick={() => setShowBourProof(!showBourProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-rose-400 hover:text-rose-300 transition-all p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Dérivation de la Formule de Bour et des Vecteurs de Base Mobiles</span>
            </span>
            {showBourProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBourProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-rose-400 font-bold">1. Expression d'un vecteur <LatexMath math="\vec{V}_1 = X_1\vec{i}_1 + Y_1\vec{j}_1 + Z_1\vec{k}_1" /> dans la base mobile de <LatexMath math="\mathcal{R}_1" /> :</p>
              <p>En dérivant dans le repère fixe <LatexMath math="\mathcal{R}_0" /> :</p>
              <p><LatexMath math="\left[\frac{d\vec{V}_1}{dt}\right]_{\mathcal{R}_0} = \left(\dot{X}_1\vec{i}_1 + \dot{Y}_1\vec{j}_1 + \dot{Z}_1\vec{k}_1\right) + \left(X_1\left[\frac{d\vec{i}_1}{dt}\right]_{\mathcal{R}_0} + Y_1\left[\frac{d\vec{j}_1}{dt}\right]_{\mathcal{R}_0} + Z_1\left[\frac{d\vec{k}_1}{dt}\right]_{\mathcal{R}_0}\right)" /></p>
              
              <p className="text-amber-300 font-bold mt-2">2. Dérivées des vecteurs unitaires de la base mobile :</p>
              <p>Or par rotation angulaire <LatexMath math="\vec{\Omega}" />, la variation temporelle des vecteurs de base s'écrit :</p>
              <p><LatexMath math="\left[\frac{d\vec{i}_1}{dt}\right]_{\mathcal{R}_0} = \vec{\Omega} \wedge \vec{i}_1 \,;\, \left[\frac{d\vec{j}_1}{dt}\right]_{\mathcal{R}_0} = \vec{\Omega} \wedge \vec{j}_1 \,;\, \left[\frac{d\vec{k}_1}{dt}\right]_{\mathcal{R}_0} = \vec{\Omega} \wedge \vec{k}_1" /></p>

              <p className="text-cyan-400 font-bold mt-2">3. Substitution et factorisation par le produit vectoriel :</p>
              <p><LatexMath math="\left[\frac{d\vec{V}_1}{dt}\right]_{\mathcal{R}_0} = \left[\frac{d\vec{V}_1}{dt}\right]_{\mathcal{R}_1} + \vec{\Omega} \wedge (X_1\vec{i}_1 + Y_1\vec{j}_1 + Z_1\vec{k}_1) = \left[\frac{d\vec{V}_1}{dt}\right]_{\mathcal{R}_1} + \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{V}_1" /></p>
            </div>
          )}
        </div>

        {/* Composition des Vitesses et Accélérations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Composition des Vitesses */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
            <h3 className="font-bold text-cyan-400 text-xs sm:text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>B. Loi de Composition des Vitesses</span>
            </h3>

            {/* Vitesse Absolue Banner */}
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-center font-mono text-xs sm:text-sm font-bold text-cyan-300 mb-3 shadow-inner">
              <span className="text-slate-400 text-[11px] block font-sans mb-1">Vitesse Absolue (Dans le repère fixe R0) :</span>
              <LatexMath math="\vec{V}_a(M) = \vec{V}_r(M) + \vec{V}_e(M)" block />
            </div>

            <div className="space-y-2 text-xs font-sans">
              {/* Vitesse Relative */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 transition-all hover:border-emerald-500/60 shadow-sm">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Vitesse Relative Vr (dans R1 mobile) :</span>
                </span>
                <div className="font-mono text-[11px] text-emerald-200">
                  <LatexMath math="\vec{V}_r(M) = \vec{V}(M/\mathcal{R}_1) = \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_1}" />
                </div>
              </div>

              {/* Vitesse d'Entraînement */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 transition-all hover:border-amber-500/60 shadow-sm">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>Vitesse d'Entraînement Ve :</span>
                </span>
                <div className="font-mono text-[11px] text-amber-200">
                  <LatexMath math="\vec{V}_e(M) = \vec{V}(O_1/\mathcal{R}_0) + \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{O_1 M}" />
                </div>
              </div>
            </div>
          </div>

          {/* Composition des Accélérations */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
            <h3 className="font-bold text-rose-400 text-xs sm:text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>C. Loi de Composition des Accélérations</span>
            </h3>

            {/* Accélération Absolue Banner */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-center font-mono text-xs sm:text-sm font-bold text-rose-300 mb-3 shadow-inner">
              <span className="text-slate-400 text-[11px] block font-sans mb-1">Accélération Absolue (Dans le repère fixe R0) :</span>
              <LatexMath math="\vec{\gamma}_a(M) = \vec{\gamma}_r(M) + \vec{\gamma}_e(M) + \vec{\gamma}_c(M)" block />
            </div>

            <div className="space-y-2 text-xs font-sans">
              {/* Accélération Relative */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 transition-all hover:border-emerald-500/60 shadow-sm">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Accélération Relative γr :</span>
                </span>
                <div className="font-mono text-[11px] text-emerald-200">
                  <LatexMath math="\vec{\gamma}_r(M) = \vec{\gamma}(M/\mathcal{R}_1)" />
                </div>
              </div>

              {/* Accélération d'Entraînement */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 transition-all hover:border-amber-500/60 shadow-sm">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>Accélération d'Entraînement γe :</span>
                </span>
                <div className="font-mono text-[11px] text-amber-200">
                  <LatexMath math="\vec{\gamma}_e(M) = \vec{\gamma}(O_1/\mathcal{R}_0) + \frac{d\vec{\Omega}}{dt}\Big|_{\mathcal{R}_0} \wedge \vec{O_1 M} + \vec{\Omega} \wedge (\vec{\Omega} \wedge \vec{O_1 M})" />
                </div>
              </div>

              {/* Accélération de Coriolis (Glowing Box) */}
              <div className="p-3 rounded-xl bg-rose-500/20 border-2 border-rose-500/70 shadow-lg shadow-rose-500/10 transition-all hover:border-rose-400">
                <span className="font-extrabold text-rose-400 flex items-center gap-1.5 mb-1 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  <span>Accélération Complementaire de Coriolis γc (Essentiel) :</span>
                </span>
                <div className="font-mono text-[11px] font-bold text-rose-200">
                  <LatexMath math="\vec{\gamma}_c(M) = 2 \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{V}_r(M)" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ACCORDION DEMONSTRATION COMPOSITION VITESSES */}
        <div className="mb-4">
          <button
            onClick={() => setShowCompVitProof(!showCompVitProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Loi de Composition des Vitesses (partant de OM = OO1 + O1M)</span>
            </span>
            {showCompVitProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompVitProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-cyan-400 font-bold">1. Relation de Chasles : <LatexMath math="\vec{OM} = \vec{OO}_1 + \vec{O_1 M}" /></p>
              <p>On dérive par rapport au temps dans le référentiel fixe <LatexMath math="\mathcal{R}_0" /> :</p>
              <p><LatexMath math="\vec{V}_a(M) = \left[\frac{d\vec{OM}}{dt}\right]_{\mathcal{R}_0} = \left[\frac{d\vec{OO}_1}{dt}\right]_{\mathcal{R}_0} + \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_0}" /></p>
              <p>2. Application de la formule de Bour au vecteur <LatexMath math="\vec{O_1 M}" /> :</p>
              <p><LatexMath math="\left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_0} = \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_1} + \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{O_1 M} = \vec{V}_r(M) + \vec{\Omega} \wedge \vec{O_1 M}" /></p>
              <p>3. En regroupant les termes :</p>
              <p className="text-emerald-400 font-bold">
                <LatexMath math="\implies \vec{V}_a(M) = \vec{V}_r(M) + \underbrace{\vec{V}(O_1/\mathcal{R}_0) + \vec{\Omega} \wedge \vec{O_1 M}}_{\vec{V}_e(M)} = \vec{V}_r(M) + \vec{V}_e(M)" />
              </p>
            </div>
          )}
        </div>

        {/* ACCORDION DEMONSTRATION COMPOSITION ACCÉLÉRATIONS & CORIOLIS */}
        <div className="mb-6">
          <button
            onClick={() => setShowCompAccProof(!showCompAccProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-rose-400 hover:text-rose-300 transition-all p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration Détaillée : Établissement et Origine de l'Accélération de Coriolis <LatexMath math="\vec{\gamma}_c = 2\vec{\Omega} \wedge \vec{V}_r" /></span>
            </span>
            {showCompAccProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompAccProof && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
              <p className="text-rose-400 font-bold">1. Dérivation de <LatexMath math="\vec{V}_a = \vec{V}_r + \vec{V}_e" /> dans <LatexMath math="\mathcal{R}_0" /> :</p>
              <p><LatexMath math="\vec{\gamma}_a(M) = \left[\frac{d\vec{V}_r}{dt}\right]_{\mathcal{R}_0} + \left[\frac{d\vec{V}_e}{dt}\right]_{\mathcal{R}_0}" /></p>
              
              <p className="text-amber-300 font-bold mt-2">2. Dérivation de la vitesse relative par la formule de Bour :</p>
              <p><LatexMath math="\left[\frac{d\vec{V}_r}{dt}\right]_{\mathcal{R}_0} = \left[\frac{d\vec{V}_r}{dt}\right]_{\mathcal{R}_1} + \vec{\Omega} \wedge \vec{V}_r = \vec{\gamma}_r(M) + \vec{\Omega} \wedge \vec{V}_r" /></p>
              
              <p className="text-amber-300 font-bold mt-2">3. Dérivation de la vitesse d'entraînement <LatexMath math="\vec{V}_e = \vec{V}(O_1/\mathcal{R}_0) + \vec{\Omega} \wedge \vec{O_1 M}" /> :</p>
              <p><LatexMath math="\left[\frac{d\vec{V}_e}{dt}\right]_{\mathcal{R}_0} = \vec{\gamma}(O_1/\mathcal{R}_0) + \frac{d\vec{\Omega}}{dt}\Big|_{\mathcal{R}_0} \wedge \vec{O_1 M} + \vec{\Omega} \wedge \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_0}" /></p>
              <p>En remplaçant <LatexMath math="\left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_0} = \vec{V}_r + \vec{\Omega} \wedge \vec{O_1 M}" /> :</p>
              <p><LatexMath math="\vec{\Omega} \wedge \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_0} = \vec{\Omega} \wedge \vec{V}_r + \vec{\Omega} \wedge (\vec{\Omega} \wedge \vec{O_1 M})" /></p>

              <p className="text-cyan-400 font-bold mt-2">4. Regroupement des deux termes <LatexMath math="\vec{\Omega} \wedge \vec{V}_r" /> :</p>
              <p>Le terme <LatexMath math="\vec{\Omega} \wedge \vec{V}_r" /> apparaît deux fois (une fois dans la dérivée de <LatexMath math="\vec{V}_r" /> et une fois dans la dérivée de <LatexMath math="\vec{V}_e" />), d'où le facteur 2 de Coriolis :</p>
              <p className="text-emerald-400 font-bold">
                <LatexMath math="\implies \vec{\gamma}_c(M) = 2 \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{V}_r(M)" />
              </p>
            </div>
          )}
        </div>

        {/* 3D RELATIVE MOTION SIMULATOR */}
        <RelativeMotion3DCanvas />
      </section>

      {/* SECTION EXERCICE 1 */}
      <ExerciseCircleRolling3DCanvas />

    </div>
  );
}
