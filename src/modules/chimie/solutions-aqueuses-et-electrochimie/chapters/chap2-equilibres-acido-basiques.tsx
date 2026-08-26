"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Lightbulb, Calculator, HelpCircle, CheckCircle2 } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lazy load 3D Canvas
const PhSimulator3DCanvas = dynamic(
  () => import("../components/PhSimulator3DCanvas"),
  { ssr: false }
);

export function Chap2EquilibresAcidoBasiques() {
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});

  const handleQcmSelect = (questionIndex: number, optionIndex: number) => {
    if (qcmAnswers[questionIndex] !== undefined) return;
    setQcmAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const qcmData = [
    {
      question: "Selon la théorie de Brønsted, qu'est-ce qu'une base ?",
      options: [
        "Un donneur de paires d'électrons",
        "Un accepteur de protons H+",
        "Un donneur de protons H+",
        "Un composé qui libère des ions OH- dans l'eau"
      ],
      correct: 1,
      explanation: "Une base de Brønsted est une espèce capable de capter (accepter) un proton H+. (Le donneur de paire d'électrons correspond à la théorie de Lewis)."
    },
    {
      question: "La formule approchée du pH d'une base faible de concentration C0 s'écrit :",
      options: [
        "pH = 7 + 0,5*(pKa + log C0)",
        "pH = 14 + log C0",
        "pH = 0,5*(pKa - log C0)",
        "pH = 14 - pKb"
      ],
      correct: 0,
      explanation: "Pour une base faible peu protonée, le pH est donné par la relation : pH = 7 + 1/2(pKa + log C0)."
    },
    {
      question: "Soit un couple AH/A- de pKa = 4,8. Si le pH de la solution est de 6,0, quelle espèce prédomine ?",
      options: [
        "L'acide AH",
        "La base A-",
        "Les deux espèces sont en quantités égales",
        "Impossible à déterminer"
      ],
      correct: 1,
      explanation: "Puisque pH (6,0) > pKa (4,8), c'est la forme basique A- qui prédomine. On le vérifie via la relation de Henderson-Hasselbalch."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Module 05 • Chapitre 02 • Équilibres Acido-Basiques</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Équilibres Acido-Basiques & Calculs de pH
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Maîtrisez la théorie de Brønsted, la constante d'acidité Ka et les diagrammes de prédominance. Apprenez à effectuer des calculs de pH rigoureux avec la méthode RP.
        </p>
      </section>

      {/* Introduction */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          1. Théorie de Brønsted-Lowry
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Selon la théorie de Joannes Brønsted et Thomas Lowry (1923), les réactions acido-basiques 
            impliquent un transfert de protons <LatexMath math="H^+" />.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong className="text-foreground">Un Acide</strong> est une espèce chimique (molécule ou ion) 
              capable de céder au moins un proton <LatexMath math="H^+" />.
            </li>
            <li>
              <strong className="text-foreground">Une Base</strong> est une espèce chimique capable 
              de capter au moins un proton <LatexMath math="H^+" />.
            </li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-2">Demi-équation acido-basique :</span>
            <LatexMath math="Acide \rightleftharpoons Base + H^+" />
          </div>
        </div>
      </section>

      {/* 3D Laboratory */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-500" />
          2. Simulation Interactive : Diagramme de Prédominance
        </h2>
        <p className="text-sm text-muted-foreground">
          Expérimentez avec différents couples acide/base. Observez comment le pH du milieu 
          influence la proportion d'acide <LatexMath math="AH" /> (rouge) et de base <LatexMath math="A^-" /> (bleu) en solution.
        </p>
        <PhSimulator3DCanvas />
      </section>

      {/* Constante d'acidité et calculs */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5 text-emerald-500" />
          3. Constante d'Acidité et Calcul de pH
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            La force d'un acide dans l'eau est caractérisée par sa constante d'acidité <LatexMath math="K_a" />.
            Pour l'équilibre : <LatexMath math="AH_{(aq)} + H_2O_{(l)} \rightleftharpoons A^-_{(aq)} + H_3O^+_{(aq)}" />
          </p>
          <div className="bg-black/30 p-4 rounded-lg overflow-x-auto text-center border border-border/30 my-4">
            <LatexMath math="K_a = \frac{[A^-]_{eq} \cdot [H_3O^+]_{eq}}{[AH]_{eq} \cdot C^\circ}" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <h4 className="text-rose-400 font-bold mb-2 text-sm">Acide Fort</h4>
              <p className="text-xs">
                Dissociation totale. <LatexMath math="K_a \gg 1" />. 
                <br/>Calcul du pH (si <LatexMath math="C_0 > 10^{-6} M" />) :
              </p>
              <div className="mt-2 font-mono text-center text-rose-300">
                <LatexMath math="pH = - \log(C_0)" />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h4 className="text-blue-400 font-bold mb-2 text-sm">Acide Faible</h4>
              <p className="text-xs">
                Dissociation partielle. <LatexMath math="K_a < 1" />.
                <br/>Calcul du pH (si peu dissocié) :
              </p>
              <div className="mt-2 font-mono text-center text-blue-300">
                <LatexMath math="pH = \frac{1}{2} (pK_a - \log(C_0))" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exercice d'application */}
      <section className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calculator className="w-24 h-24 text-emerald-500" />
        </div>
        <h2 className="text-xl font-black text-emerald-500 tracking-tight mb-4 flex items-center gap-3 relative z-10">
          Exercice d'Application
        </h2>
        <div className="relative z-10 space-y-4">
          <p className="text-muted-foreground text-sm">
            On prépare une solution d'acide méthanoïque (<LatexMath math="HCOOH" />, <LatexMath math="pK_a = 3,75" />) 
            de concentration initiale <LatexMath math="C_0 = 1,0 \times 10^{-2} \text{ mol.L}^{-1}" />.
          </p>
          <div className="pl-4 border-l-2 border-emerald-500/30">
            <p className="text-xs font-bold text-foreground mb-1">Question :</p>
            <p className="text-xs text-muted-foreground">Calculer le pH de la solution en supposant que l'acide est faiblement dissocié. Vérifier l'hypothèse.</p>
          </div>
          <details className="group mt-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <summary className="p-4 font-semibold cursor-pointer text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Voir la solution détaillée
            </summary>
            <div className="p-4 pt-0 border-t border-slate-700/50 text-xs text-muted-foreground space-y-3">
              <p>1. Formule approchée de l'acide faible :</p>
              <div className="text-center">
                <LatexMath math="pH = \frac{1}{2} (pK_a - \log C_0)" />
              </div>
              <p>2. Application Numérique :</p>
              <div className="text-center text-emerald-300 font-mono">
                <LatexMath math="pH = \frac{1}{2} (3,75 - \log(10^{-2})) = \frac{1}{2} (3,75 + 2) = 2,87" />
              </div>
              <p>3. Vérification des hypothèses :</p>
              <p>
                L'acide est-il faiblement dissocié ? Il faut que <LatexMath math="pH < pK_a - 1" />.
                <br/>Ici <LatexMath math="pH = 2,87" /> et <LatexMath math="pK_a - 1 = 2,75" />. 
                <span className="text-rose-400 ml-2">L'hypothèse n'est pas strictement vérifiée.</span> 
                Il faudrait résoudre l'équation du second degré pour un résultat rigoureux.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* QCM SECTION */}
      <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8 mt-12 shadow-sm">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
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
                  <span className="text-emerald-500 mr-2">Q{qIdx + 1}.</span>
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
