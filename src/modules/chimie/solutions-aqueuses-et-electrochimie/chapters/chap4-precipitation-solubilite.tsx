"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, AlertTriangle, Layers, Calculator, HelpCircle, CheckCircle2 } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lazy load 3D Canvas
const Precipitation3DCanvas = dynamic(
  () => import("../components/Precipitation3DCanvas"),
  { ssr: false }
);

export function Chap4PrecipitationSolubilite() {
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});

  const handleQcmSelect = (questionIndex: number, optionIndex: number) => {
    if (qcmAnswers[questionIndex] !== undefined) return;
    setQcmAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const qcmData = [
    {
      question: "Quelle est l'expression du produit de solubilité Ks pour le fluorure de calcium (CaF2) ?",
      options: [
        "Ks = [Ca2+][F-]",
        "Ks = [Ca2+][F-]^2",
        "Ks = [Ca2+]^2[F-]",
        "Ks = [CaF2] / ([Ca2+][F-]^2)"
      ],
      correct: 1,
      explanation: "L'équation de dissolution est CaF2(s) <=> Ca2+(aq) + 2F-(aq). D'après la loi d'action de masse, Ks = [Ca2+][F-]^2. Le solide n'intervient pas dans l'expression (activité = 1)."
    },
    {
      question: "Comment évolue la solubilité 's' d'un sel peu soluble si on ajoute un ion commun à la solution ?",
      options: [
        "Elle augmente",
        "Elle diminue",
        "Elle reste constante",
        "Le produit de solubilité Ks diminue"
      ],
      correct: 1,
      explanation: "C'est l'effet d'ion commun. L'ajout d'un des ions constitutifs du précipité déplace l'équilibre vers la formation du solide (Le Châtelier), ce qui fait diminuer la solubilité. Le Ks, lui, ne dépend que de la température."
    },
    {
      question: "Le produit de solubilité de AgCl est Ks = 10^-10. Quelle est sa solubilité 's' dans l'eau pure ?",
      options: [
        "10^-10 mol/L",
        "10^-5 mol/L",
        "2*10^-5 mol/L",
        "10^-20 mol/L"
      ],
      correct: 1,
      explanation: "La dissolution donne AgCl(s) <=> Ag+ + Cl-. Donc Ks = s * s = s^2. s = sqrt(Ks) = sqrt(10^-10) = 10^-5 mol/L."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-black mb-4">
          <Layers className="w-4 h-4" />
          <span>Module 05 • Chapitre 04 • Solubilité</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Équilibres de Précipitation & Solubilité
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Étudiez la formation et la dissolution des solides ioniques en milieu aqueux. Comprenez le produit de solubilité Ks, l'effet d'ion commun et l'influence du pH.
        </p>
      </section>

      {/* Introduction Ks */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-cyan-500" />
          1. Produit de Solubilité (Ks) et Solubilité (s)
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Lorsqu'un composé ionique solide <LatexMath math="M_aX_b" /> est mis en présence d'eau, un équilibre hétérogène s'établit 
            (s'il y a un excès de solide) entre le précipité et ses ions dissous :
          </p>
          <div className="bg-black/30 p-4 rounded-xl border border-border/30 my-4 text-center">
            <LatexMath math="M_aX_b(s) \rightleftharpoons a M^{b+}_{(aq)} + b X^{a-}_{(aq)}" />
          </div>
          <p>
            La constante d'équilibre associée est le <strong>produit de solubilité</strong> <LatexMath math="K_s" /> :
          </p>
          <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-500/20 my-4 text-center text-cyan-200 font-mono">
            <LatexMath math="K_s = [M^{b+}]^a \cdot [X^{a-}]^b" />
          </div>
          <p>
            La <strong>solubilité</strong> <LatexMath math="s" /> est la quantité maximale de solide (en moles) que l'on peut dissoudre dans un litre de solution. 
            Elle s'exprime en <LatexMath math="\text{mol.L}^{-1}" />.
          </p>
        </div>
      </section>

      {/* 3D Laboratory */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Layers className="w-5 h-5 text-cyan-500" />
          2. Simulateur de Précipitation (Chlorure d'Argent)
        </h2>
        <p className="text-sm text-muted-foreground">
          Ajoutez des ions <LatexMath math="Ag^+" /> et <LatexMath math="Cl^-" /> dans la solution. 
          Tant que le quotient de réaction <LatexMath math="Q < K_s" />, la solution reste limpide. 
          Dès que <LatexMath math="Q > K_s" />, un précipité d'AgCl se forme au fond du bécher.
        </p>
        <Precipitation3DCanvas />
      </section>

      {/* Facteurs influençant la solubilité */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          3. Facteurs Influençant la Solubilité
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/20">
            <h4 className="text-amber-400 font-bold mb-3">L'effet d'ion commun</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              L'ajout à une solution saturée d'un sel soluble contenant un ion commun avec le précipité 
              déplace l'équilibre de dissolution dans le sens de la formation du solide (principe de Le Châtelier). 
              <strong>La solubilité diminue.</strong>
            </p>
          </div>

          <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-500/20">
            <h4 className="text-rose-400 font-bold mb-3">Influence du pH</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Si l'anion du précipité est une base faible (ex: <LatexMath math="S^{2-}, CO_3^{2-}, OH^-" />), l'ajout d'un acide fort le protonera. 
              La concentration de l'anion libre diminue, l'équilibre se déplace pour dissoudre le précipité. 
              <strong>La solubilité augmente.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Exercice d'application */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-cyan-500 tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5" />
          Exercice d'Application
        </h2>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            On considère le précipité d'hydroxyde de magnésium <LatexMath math="Mg(OH)_2" /> dont le produit de solubilité 
            vaut <LatexMath math="K_s = 1,0 \times 10^{-11}" /> à 25°C.
          </p>
          <div className="pl-4 border-l-2 border-cyan-500/30">
            <p className="text-xs font-bold text-foreground mb-1">Questions :</p>
            <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-1">
              <li>Calculer la solubilité <LatexMath math="s" /> dans l'eau pure.</li>
              <li>Calculer la solubilité <LatexMath math="s'" /> dans une solution d'hydroxyde de sodium (NaOH) à <LatexMath math="0,1 \text{ mol/L}" />.</li>
            </ol>
          </div>
          <details className="group mt-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <summary className="p-4 font-semibold cursor-pointer text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Voir la correction
            </summary>
            <div className="p-4 pt-0 border-t border-slate-800 text-xs text-muted-foreground space-y-3">
              <p>1. Dans l'eau pure : <LatexMath math="Mg(OH)_2 \rightleftharpoons Mg^{2+} + 2 OH^-" /></p>
              <div className="text-center font-mono text-cyan-300">
                <LatexMath math="K_s = (s)(2s)^2 = 4s^3" />
                <br />
                <LatexMath math="s = \sqrt[3]{\frac{K_s}{4}} = \sqrt[3]{2,5 \times 10^{-12}} = 1,36 \times 10^{-4} \text{ mol/L}" />
              </div>
              
              <p className="mt-4">2. Dans NaOH 0.1 M (effet d'ion commun) :</p>
              <p>La concentration en OH- est imposée par la base forte : <LatexMath math="[OH^-] \approx 0,1 \text{ M}" /> (s' étant négligeable devant 0.1).</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="K_s = s' \cdot (0,1)^2 \implies s' = \frac{K_s}{0,01} = 1,0 \times 10^{-9} \text{ mol/L}" />
              </div>
              <p>Conclusion : La solubilité a été divisée par plus de 100 000 ! C'est l'effet d'ion commun.</p>
            </div>
          </details>
        </div>
      </section>

      {/* QCM SECTION */}
      <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8 mt-12 shadow-sm">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-500" />
          Testez vos connaissances (QCM)
        </h2>
        
        <div className="space-y-6">
          {qcmData.map((q, qIdx) => {
            const answeredOption = qcmAnswers[qIdx];
            const isAnswered = answeredOption !== undefined;
            const isCorrect = answeredOption === q.correct;

            return (
              <div key={qIdx} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60 space-y-4">
                <h3 className="text-sm font-bold text-foreground leading-relaxed">
                  <span className="text-cyan-500 mr-2">Q{qIdx + 1}.</span>
                  {q.question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    let optStyle = "border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-600 text-muted-foreground";
                    
                    if (isAnswered) {
                      if (optIdx === q.correct) {
                        optStyle = "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold ring-1 ring-emerald-500/50";
                      } else if (optIdx === answeredOption) {
                        optStyle = "border-rose-500/60 bg-rose-500/10 text-rose-300 font-semibold";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleQcmSelect(qIdx, optIdx)}
                        disabled={isAnswered}
                        className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                    isCorrect 
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200" 
                      : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                  }`}>
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {isCorrect ? "✅ Bravo ! Bonne réponse." : "❌ Réponse incorrecte."}
                    </div>
                    <p className="text-muted-foreground text-[11px]">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
