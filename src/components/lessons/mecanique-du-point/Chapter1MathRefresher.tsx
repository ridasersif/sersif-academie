"use client";

import React from "react";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const ThreeDCoordinateCanvas = dynamic(() => import("@/components/3d/ThreeDCoordinateCanvas"), { ssr: false });

import LatexMath from "@/components/ui/LatexMath";

import { CheckCircle2, Sparkles, BookOpen } from "lucide-react";

export default function Chapter1MathRefresher() {
  return (
    <div className="space-y-8">
      
      {/* SECTION 1: PRODUIT SCALAIRE, VECTORIEL & MIXTE */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <span>Partie 1 • Outils Vectoriels</span>
        </div>
        
        <h2 className="text-2xl font-black mb-4 text-foreground">
          1. Produit Scalaire, Produit Vectoriel et Produit Mixte
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Produit Scalaire Card */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-base font-bold text-primary mb-2 flex items-center justify-between">
              <span>A. Produit Scalaire</span>
              <LatexMath math="\vec{u} \cdot \vec{v}" className="text-xs px-2 py-0.5 rounded bg-primary/10 font-mono" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Le produit scalaire de deux vecteurs <LatexMath math="\vec{u}" /> et <LatexMath math="\vec{v}" /> est un <strong>scalaire</strong> (nombre réel) défini par:
            </p>
            
            <div className="p-3 rounded-xl bg-card border border-border/60 text-center font-mono text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
              <LatexMath math="\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos(\theta) = u_x v_x + u_y v_y + u_z v_z" block />
            </div>

            <ul className="text-xs text-muted-foreground space-y-1 font-medium list-disc list-inside">
              <li><strong>Orthogonalité:</strong> <LatexMath math="\vec{u} \cdot \vec{v} = 0 \iff \vec{u} \perp \vec{v}" /></li>
              <li><strong>Norme:</strong> <LatexMath math="\|\vec{u}\| = \sqrt{\vec{u} \cdot \vec{u}}" /></li>
              <li><strong>Projection:</strong> Représente la projection orthogonale d'un vecteur sur l'axe porté par l'autre.</li>
            </ul>
          </div>

          {/* Produit Vectoriel Card */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-between">
              <span>B. Produit Vectoriel</span>
              <LatexMath math="\vec{u} \wedge \vec{v}" className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 font-mono" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Le produit vectoriel est un <strong>vecteur</strong> orthogonal à la fois à <LatexMath math="\vec{u}" /> et à <LatexMath math="\vec{v}" />:
            </p>
            
            <div className="p-3 rounded-xl bg-card border border-border/60 text-center font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              <LatexMath math="\|\vec{u} \wedge \vec{v}\| = \|\vec{u}\| \|\vec{v}\| \sin(\theta)" block />
            </div>

            <ul className="text-xs text-muted-foreground space-y-1 font-medium list-disc list-inside">
              <li><strong>Sens:</strong> Règle de la main droite (trièdre direct <LatexMath math="(\vec{u}, \vec{v}, \vec{u} \wedge \vec{v})" />).</li>
              <li><strong>Colinéarité:</strong> <LatexMath math="\vec{u} \wedge \vec{v} = \vec{0} \iff \vec{u} // \vec{v}" />.</li>
              <li><strong>Anti-commutativité:</strong> <LatexMath math="\vec{u} \wedge \vec{v} = - (\vec{v} \wedge \vec{u})" />.</li>
            </ul>
          </div>
        </div>

        {/* Produit Mixte Card */}
        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
          <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            C. Produit Mixte : <LatexMath math="(\vec{u}, \vec{v}, \vec{w}) = (\vec{u} \wedge \vec{v}) \cdot \vec{w}" />
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2 font-medium">
            Le produit mixte représente le <strong>volume orienté</strong> du parallélépipède construit sur les trois vecteurs <LatexMath math="\vec{u}, \vec{v}, \vec{w}" />.
          </p>
          <div className="p-3 rounded-xl bg-card border border-border/60 font-mono text-xs text-center font-bold text-foreground">
            <LatexMath math="(\vec{u} \wedge \vec{v}) \cdot \vec{w} = (\vec{v} \wedge \vec{w}) \cdot \vec{u} = (\vec{w} \wedge \vec{u}) \cdot \vec{u}" />
          </div>
        </div>
      </section>

      {/* SECTION 2: FORMULES DE DÉRIVATION VECTORIELLE */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <span>Partie 2 • Dérivation Vectorielle</span>
        </div>

        <h2 className="text-2xl font-black mb-4 text-foreground">
          2. Rappels de Dérivation et Dérivation de Produit de Vecteurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dérivation Scalaire Usuelle */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-sm font-bold text-foreground mb-3">A. Formules de Dérivation Usuelles</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span>Produit:</span>
                <LatexMath math="(f \cdot g)' = f'g + fg'" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span>Quotient:</span>
                <LatexMath math="\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span>Composée:</span>
                <LatexMath math="(f(g(t)))' = g'(t) \cdot f'(g(t))" />
              </div>
            </div>
          </div>

          {/* Dérivation de Produits Vectoriels par rapport au temps t */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-sm font-bold text-foreground mb-3">B. Dérivation de Vecteurs par rapport au Temps t</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span>Produit Scalaire:</span>
                <LatexMath math="\frac{d}{dt}(\vec{u} \cdot \vec{v}) = \frac{d\vec{u}}{dt} \cdot \vec{v} + \vec{u} \cdot \frac{d\vec{v}}{dt}" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span>Produit Vectoriel:</span>
                <LatexMath math="\frac{d}{dt}(\vec{u} \wedge \vec{v}) = \frac{d\vec{u}}{dt} \wedge \vec{v} + \vec{u} \wedge \frac{d\vec{v}}{dt}" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span>Fonction × Vecteur:</span>
                <LatexMath math="\frac{d}{dt}(f(t) \cdot \vec{u}) = f'(t) \vec{u} + f(t) \frac{d\vec{u}}{dt}" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THREE.JS 3D INTERACTIVE COORDINATE CANVAS */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <span>Partie 3 • Three.js 3D WebGL Canvas</span>
        </div>

        <h2 className="text-2xl font-black mb-2 text-foreground">
          3. Systèmes de Coordonnées (Cartésien, Cylindrique, Sphérique)
        </h2>

        <p className="text-xs text-muted-foreground font-medium mb-4">
          Manipulez les curseurs ci-dessous et faites glisser la souris directement dans l'espace 3D WebGL pour tourner autour du repère mobile et observer les vecteurs de base.
        </p>

        {/* Three.js WebGL Canvas Component */}
        <LazyMount fallbackText="Préparation de ThreeDCoordinate..."><ThreeDCoordinateCanvas /></LazyMount>
      </section>

      {/* SECTION 4: DÉRIVATION DES VECTEURS DE LA BASE MOBILE */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <span>Partie 4 • Dérivation des Base Mobiles</span>
        </div>

        <h2 className="text-2xl font-black mb-4 text-foreground">
          4. Dérivation des Vecteurs de Base Locaux par rapport au Temps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Cylindrique */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">A. Base Cylindrique <LatexMath math="(\vec{e}_\rho, \vec{e}_\phi, \vec{e}_z)" /></h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span><LatexMath math="\frac{d\vec{e}_\rho}{dt} :" /></span>
                <LatexMath math="\dot{\phi} \vec{e}_\phi" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span><LatexMath math="\frac{d\vec{e}_\phi}{dt} :" /></span>
                <LatexMath math="-\dot{\phi} \vec{e}_\rho" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span><LatexMath math="\frac{d\vec{e}_z}{dt} :" /></span>
                <LatexMath math="\vec{0}" />
              </div>
            </div>
          </div>

          {/* Base Sphérique */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">B. Base Sphérique <LatexMath math="(\vec{e}_r, \vec{e}_\theta, \vec{e}_\phi)" /></h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span><LatexMath math="\frac{d\vec{e}_r}{dt} :" /></span>
                <LatexMath math="\dot{\theta} \vec{e}_\theta + \dot{\phi}\sin\theta \vec{e}_\phi" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span><LatexMath math="\frac{d\vec{e}_\theta}{dt} :" /></span>
                <LatexMath math="-\dot{\theta} \vec{e}_r + \dot{\phi}\cos\theta \vec{e}_\phi" />
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border/40 flex justify-between items-center">
                <span><LatexMath math="\frac{d\vec{e}_\phi}{dt} :" /></span>
                <LatexMath math="-\dot{\phi} (\sin\theta \vec{e}_r + \cos\theta \vec{e}_\theta)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: OPÉRATEURS DIFFÉRENTIELS (NABLA, GRAD, DIV, ROT, CIRCULATION) */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <span>Partie 5 • Champs & Opérateurs Différentiels</span>
        </div>

        <h2 className="text-2xl font-black mb-4 text-foreground">
          5. Opérateurs Différentiels : Nabla, Gradient, Divergence, Rotationnel & Circulation
        </h2>

        <div className="space-y-4">
          {/* Gradient */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center justify-between">
              <span>A. Opérateur Gradient : <LatexMath math="\vec{\mathrm{grad}}(f) = \vec{\nabla}f" /></span>
              <span className="text-xs text-muted-foreground">Transforme un champ scalaire en champ vectoriel</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
              <div className="p-3 rounded-xl bg-card border border-border/40">
                <div className="text-[11px] text-muted-foreground font-sans font-bold mb-1">Cartésien</div>
                <LatexMath math="\frac{\partial f}{\partial x}\vec{i} + \frac{\partial f}{\partial y}\vec{j} + \frac{\partial f}{\partial z}\vec{k}" />
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/40">
                <div className="text-[11px] text-muted-foreground font-sans font-bold mb-1">Cylindrique</div>
                <LatexMath math="\frac{\partial f}{\partial \rho}\vec{e}_\rho + \frac{1}{\rho}\frac{\partial f}{\partial \phi}\vec{e}_\phi + \frac{\partial f}{\partial z}\vec{e}_z" />
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/40">
                <div className="text-[11px] text-muted-foreground font-sans font-bold mb-1">Sphérique</div>
                <LatexMath math="\frac{\partial f}{\partial r}\vec{e}_r + \frac{1}{r}\frac{\partial f}{\partial \theta}\vec{e}_\theta + \frac{1}{r\sin\theta}\frac{\partial f}{\partial \phi}\vec{e}_\phi" />
              </div>
            </div>
          </div>

          {/* Divergence & Rotationnel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
              <h3 className="text-sm font-bold text-foreground mb-1">B. Divergence : <LatexMath math="\mathrm{div}(\vec{A}) = \vec{\nabla} \cdot \vec{A}" /></h3>
              <p className="text-xs text-muted-foreground font-medium mb-2">Mesure le flux sortant net par unité de volume (champ scalaire).</p>
              <div className="p-3 rounded-xl bg-card border border-border/40 text-center font-bold">
                <LatexMath math="\mathrm{div}(\vec{A}) = \frac{\partial A_x}{\partial x} + \frac{\partial A_y}{\partial y} + \frac{\partial A_z}{\partial z}" block />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
              <h3 className="text-sm font-bold text-foreground mb-1">C. Rotationnel : <LatexMath math="\vec{\mathrm{rot}}(\vec{A}) = \vec{\nabla} \wedge \vec{A}" /></h3>
              <p className="text-xs text-muted-foreground font-medium mb-2">Mesure la circulation locale / le tourbillonnement (champ vectoriel).</p>
              <div className="p-3 rounded-xl bg-card border border-border/40 text-center font-bold">
                <LatexMath math="\vec{\mathrm{rot}}(\vec{A}) = \left(\frac{\partial A_z}{\partial y} - \frac{\partial A_y}{\partial z}\right)\vec{i} + \dots" block />
              </div>
            </div>
          </div>

          {/* Circulation & Flux (Stokes & Ostrogradsky) */}
          <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-2">D. Circulation, Flux & Théorèmes d'Intégration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-card border border-border/40 text-center">
                <div className="font-sans font-bold text-foreground mb-1">Théorème d'Ostrogradsky (Flux):</div>
                <LatexMath math="\iint_S \vec{A} \cdot d\vec{S} = \iiint_V \mathrm{div}(\vec{A})\,dV" block />
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border/40 text-center">
                <div className="font-sans font-bold text-foreground mb-1">Théorème de Stokes (Circulation):</div>
                <LatexMath math="\oint_C \vec{A} \cdot d\vec{\ell} = \iint_S \vec{\mathrm{rot}}(\vec{A}) \cdot d\vec{S}" block />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
