"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Zap, Calculator, HelpCircle, CheckCircle2, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lazy load 3D Canvas
const RedoxScale3DCanvas = dynamic(
  () => import("../components/RedoxScale3DCanvas"),
  { ssr: false }
);

export function Chap5OxydoreductionNernst() {
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});

  const handleQcmSelect = (questionIndex: number, optionIndex: number) => {
    if (qcmAnswers[questionIndex] !== undefined) return;
    setQcmAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const qcmData = [
    {
      question: "Laquelle de ces propositions décrit correctement un oxydant ?",
      options: [
        "Il cède des électrons au cours d'une réaction",
        "Il capte des électrons au cours d'une réaction",
        "Son nombre d'oxydation augmente",
        "Il libère des protons H+"
      ],
      correct: 1,
      explanation: "Un oxydant est une espèce chimique capable de capter un ou plusieurs électrons. Ce faisant, il se réduit (son nombre d'oxydation diminue)."
    },
    {
      question: "D'après la formule de Nernst, comment évolue le potentiel E d'une électrode si on augmente la concentration de l'oxydant ?",
      options: [
        "Le potentiel E augmente",
        "Le potentiel E diminue",
        "Le potentiel E reste constant",
        "Le potentiel standard E° augmente"
      ],
      correct: 0,
      explanation: "Dans la formule E = E° + (0.059/n) * log([Ox]/[Red]), [Ox] est au numérateur du logarithme. Si [Ox] augmente, log([Ox]/[Red]) augmente, donc E augmente."
    },
    {
      question: "La règle du gamma (γ) stipule que la réaction spontanée a lieu entre :",
      options: [
        "L'oxydant le plus faible et le réducteur le plus fort",
        "L'oxydant le plus fort et le réducteur le plus faible",
        "L'oxydant le plus fort et le réducteur le plus fort",
        "L'acide le plus fort et la base la plus forte"
      ],
      correct: 2,
      explanation: "La réaction spontanée se produit entre l'oxydant le plus fort (celui dont le E° est le plus élevé) et le réducteur le plus fort (celui dont le E° est le plus faible)."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black mb-4">
          <Zap className="w-4 h-4" />
          <span>Module 05 • Chapitre 05 • Oxydo-Réduction</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Oxydo-Réduction & Formule de Nernst
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Maîtrisez les transferts d'électrons, l'établissement du potentiel d'électrode via l'équation de Nernst, et la prévision des réactions spontanées grâce à la règle du gamma.
        </p>
      </section>

      {/* Introduction au Redox */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-500" />
          1. Oxydants et Réducteurs
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Une réaction d'oxydo-réduction (ou réaction redox) implique un transfert d'électrons 
            entre deux espèces chimiques.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
            <li><strong className="text-rose-400">Oxydant :</strong> Capte des électrons. (Il subit une réduction).</li>
            <li><strong className="text-blue-400">Réducteur :</strong> Cède des électrons. (Il subit une oxydation).</li>
          </ul>
          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/20 text-center font-mono">
            <LatexMath math="Ox + n \cdot e^- \rightleftharpoons Red" />
          </div>
          <p className="mt-4">
            <strong>Nombre d'Oxydation (n.o.) :</strong> C'est la charge fictive portée par un atome. Lors d'une oxydation, le n.o. augmente. Lors d'une réduction, il diminue.
          </p>
        </div>
      </section>

      {/* 3D Laboratory (Gamma Rule) */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Activity className="w-5 h-5 text-amber-500" />
          2. Simulateur Interactif : L'Échelle des Potentiels & Règle du Gamma
        </h2>
        <p className="text-sm text-muted-foreground">
          Visualisez l'échelle des potentiels standard <LatexMath math="E^\circ" /> en 3D. 
          Sélectionnez un couple oxydant et un couple réducteur pour vérifier si la réaction respecte la règle du gamma (réaction spontanée <LatexMath math="\Delta E > 0" />).
        </p>
        <RedoxScale3DCanvas />
      </section>

      {/* Formule de Nernst */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm mt-12">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5 text-amber-500" />
          3. La Formule de Nernst
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Le potentiel <LatexMath math="E" /> d'un couple redox en solution n'est pas toujours égal au potentiel standard <LatexMath math="E^\circ" />. 
            Il dépend de l'activité (ou concentration) des espèces en présence. Walther Nernst a établi la relation suivante :
          </p>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 my-4 text-center">
            <LatexMath math="E = E^\circ + \frac{RT}{nF} \ln \left( \frac{a(Ox)}{a(Red)} \right)" />
          </div>
          <p>
            À <LatexMath math="25^\circ C" /> (298 K), en convertissant le logarithme népérien en logarithme décimal (<LatexMath math="\ln x \approx 2,3 \log_{10} x" />), 
            la constante <LatexMath math="\frac{2,3 RT}{F}" /> vaut environ <strong>0,059 V</strong> :
          </p>
          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/30 my-4 text-center font-bold text-amber-200 text-base">
            <LatexMath math="E = E^\circ + \frac{0,059}{n} \log_{10} \frac{[Ox]}{[Red]}" />
          </div>
          <ul className="list-disc pl-6 space-y-1 text-xs">
            <li><LatexMath math="E" /> : Potentiel d'électrode (en Volts)</li>
            <li><LatexMath math="E^\circ" /> : Potentiel standard du couple</li>
            <li><LatexMath math="n" /> : Nombre d'électrons échangés</li>
            <li>Rappel : L'activité d'un solide ou du solvant (eau) est égale à 1.</li>
          </ul>
        </div>
      </section>

      {/* Exercice d'application */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-amber-500 tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5" />
          Exercice d'Application
        </h2>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            On plonge une lame d'argent (<LatexMath math="Ag_{(s)}" />) dans une solution de nitrate d'argent 
            (<LatexMath math="Ag^+ + NO_3^-" />) de concentration <LatexMath math="[Ag^+] = 1,0 \times 10^{-3} \text{ mol/L}" />. 
            On donne <LatexMath math="E^\circ(Ag^+/Ag) = 0,80 \text{ V}" />.
          </p>
          <div className="pl-4 border-l-2 border-amber-500/30">
            <p className="text-xs font-bold text-foreground mb-1">Question :</p>
            <p className="text-xs text-muted-foreground">Calculer le potentiel de cette électrode à 25°C.</p>
          </div>
          <details className="group mt-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <summary className="p-4 font-semibold cursor-pointer text-xs text-amber-400 hover:text-amber-300 transition-colors">
              Voir la correction
            </summary>
            <div className="p-4 pt-0 border-t border-slate-800 text-xs text-muted-foreground space-y-3">
              <p>1. Demi-équation :</p>
              <div className="text-center font-mono">
                <LatexMath math="Ag^+_{(aq)} + 1 e^- \rightleftharpoons Ag_{(s)}" />
              </div>
              <p>Donc <LatexMath math="n = 1" /> électron échangé.</p>
              <p>2. Application de la formule de Nernst :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="E = E^\circ + \frac{0,059}{1} \log \left( \frac{[Ag^+]}{1} \right)" />
              </div>
              <p className="text-xs text-slate-400 italic text-center">(L'activité de Ag(s) vaut 1)</p>
              <p>3. Calcul :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="E = 0,80 + 0,059 \times \log(10^{-3}) = 0,80 + 0,059 \times (-3) = 0,80 - 0,177 = 0,623 \text{ V}" />
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* QCM SECTION */}
      <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8 mt-12 shadow-sm">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
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
                  <span className="text-amber-500 mr-2">Q{qIdx + 1}.</span>
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
