"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Battery, Calculator, HelpCircle, CheckCircle2, Zap } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lazy load 3D Canvas
const DaniellCell3DCanvas = dynamic(
  () => import("../components/DaniellCell3DCanvas"),
  { ssr: false }
);

export function Chap6PilesElectrolyse() {
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});

  const handleQcmSelect = (questionIndex: number, optionIndex: number) => {
    if (qcmAnswers[questionIndex] !== undefined) return;
    setQcmAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const qcmData = [
    {
      question: "Dans une pile électrochimique fonctionnant en générateur, où a lieu l'oxydation ?",
      options: [
        "À l'anode, qui est le pôle négatif (-)",
        "À l'anode, qui est le pôle positif (+)",
        "À la cathode, qui est le pôle négatif (-)",
        "À la cathode, qui est le pôle positif (+)"
      ],
      correct: 0,
      explanation: "L'oxydation a toujours lieu à l'anode. Dans une pile, les électrons y sont libérés, c'est donc le pôle négatif."
    },
    {
      question: "Quel est le rôle principal du pont salin dans une pile ?",
      options: [
        "Permettre le passage des électrons entre les demi-piles",
        "Assurer l'électroneutralité des solutions et fermer le circuit",
        "Empêcher les réactions d'oxydo-réduction",
        "Augmenter la force électromotrice de la pile"
      ],
      correct: 1,
      explanation: "Le pont salin ne laisse pas passer les électrons. Il laisse migrer les ions (anions vers l'anode, cations vers la cathode) pour maintenir la neutralité électrique des solutions."
    },
    {
      question: "Lors d'une électrolyse, on impose un courant. Quel est le signe de l'anode ?",
      options: [
        "Négatif (-)",
        "Positif (+)",
        "Neutre",
        "Le signe change périodiquement"
      ],
      correct: 1,
      explanation: "Dans un électrolyseur (récepteur), l'anode est reliée à la borne positive du générateur extérieur pour y forcer l'oxydation en arrachant des électrons."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 text-xs font-black mb-4">
          <Battery className="w-4 h-4" />
          <span>Module 05 • Chapitre 06 • Piles & Électrolyse</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Piles Électrochimiques, Loi de Faraday & Électrolyse
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Comprenez la conversion entre énergie chimique et énergie électrique. Découvrez le fonctionnement de la pile Daniell et les principes de l'électrolyse.
        </p>
      </section>

      {/* Fonctionnement d'une pile */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-fuchsia-500" />
          1. Principe d'une Pile (Générateur)
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Une pile électrochimique est un dispositif permettant d'obtenir un courant électrique grâce à 
            une réaction d'oxydo-réduction spontanée (<LatexMath math="\Delta E > 0" />).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/30">
              <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                Anode (Pôle Négatif -)
              </h4>
              <p className="text-xs">
                Siège de l'<strong>Oxydation</strong>. Le réducteur cède des électrons qui partent dans le circuit extérieur.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                Cathode (Pôle Positif +)
              </h4>
              <p className="text-xs">
                Siège de la <strong>Réduction</strong>. Les électrons arrivant du circuit extérieur sont captés par l'oxydant.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold text-amber-400 bg-amber-500/10 p-3 rounded-xl">
            Moyen mnémotechnique : Anode / Oxydation (Voyelles) — Cathode / Réduction (Consonnes).
          </p>
        </div>
      </section>

      {/* 3D Laboratory (Pile Daniell) */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Battery className="w-5 h-5 text-fuchsia-500" />
          2. Laboratoire 3D : La Pile Daniell
        </h2>
        <p className="text-sm text-muted-foreground">
          Observez le fonctionnement de la célèbre pile inventée par John Daniell en 1836. 
          Démarrez le circuit pour voir le flux d'électrons et l'évolution des électrodes.
        </p>
        <DaniellCell3DCanvas />
      </section>

      {/* Loi de Faraday et Electrolyse */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm mt-12">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500" />
          3. Électrolyse et Lois de Faraday
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            L'électrolyse est le phénomène <strong>inverse</strong> de la pile. Un générateur externe impose un courant 
            pour forcer une réaction chimique non spontanée (<LatexMath math="\Delta E < 0" />).
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
            <li><strong>Anode (+) :</strong> Oxydation forcée. Reliée au pôle positif du générateur.</li>
            <li><strong>Cathode (-) :</strong> Réduction forcée. Reliée au pôle négatif du générateur.</li>
          </ul>
          
          <h4 className="text-amber-400 font-bold mt-6 mb-2">Quantité d'électricité (Loi de Faraday)</h4>
          <p>
            La charge électrique <LatexMath math="Q" /> (en Coulombs) qui traverse le circuit est liée à la quantité de matière d'électrons échangés <LatexMath math="n(e^-)" /> :
          </p>
          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/30 my-4 text-center font-bold text-amber-200">
            <LatexMath math="Q = I \cdot \Delta t = n(e^-) \cdot \mathcal{F}" />
          </div>
          <p className="text-xs">
            Avec <LatexMath math="\mathcal{F}" /> le Faraday (<LatexMath math="\approx 96500 \text{ C/mol}" />) et <LatexMath math="I" /> l'intensité du courant.
          </p>
        </div>
      </section>

      {/* Exercice d'application */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-fuchsia-500 tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5" />
          Exercice d'Application (Électrolyse)
        </h2>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            On réalise l'électrolyse d'une solution de sulfate de cuivre (<LatexMath math="Cu^{2+} + SO_4^{2-}" />) avec un courant constant 
            de <LatexMath math="I = 2,0 \text{ A}" /> pendant <LatexMath math="\Delta t = 1 \text{ heure}" />. 
            Il y a dépôt de cuivre métallique à la cathode. (<LatexMath math="M(Cu) = 63,5 \text{ g/mol}" />)
          </p>
          <div className="pl-4 border-l-2 border-fuchsia-500/30">
            <p className="text-xs font-bold text-foreground mb-1">Question :</p>
            <p className="text-xs text-muted-foreground">Quelle est la masse <LatexMath math="m" /> de cuivre déposée à la cathode ?</p>
          </div>
          <details className="group mt-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <summary className="p-4 font-semibold cursor-pointer text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
              Voir la correction
            </summary>
            <div className="p-4 pt-0 border-t border-slate-800 text-xs text-muted-foreground space-y-3">
              <p>1. Équation à la cathode :</p>
              <div className="text-center font-mono">
                <LatexMath math="Cu^{2+} + 2 e^- \rightarrow Cu_{(s)}" />
              </div>
              <p>Donc <LatexMath math="n(Cu) = \frac{n(e^-)}{2}" />.</p>
              
              <p>2. Calcul de la charge Q :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="Q = I \times \Delta t = 2,0 \times 3600 = 7200 \text{ C}" />
              </div>
              
              <p>3. Calcul de la masse :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="n(e^-) = \frac{Q}{\mathcal{F}} = \frac{7200}{96500} \approx 0,0746 \text{ mol}" />
                <br />
                <LatexMath math="n(Cu) = \frac{0,0746}{2} \approx 0,0373 \text{ mol}" />
                <br />
                <LatexMath math="m(Cu) = n(Cu) \times M(Cu) = 0,0373 \times 63,5 \approx 2,37 \text{ g}" />
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* QCM SECTION */}
      <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8 mt-12 shadow-sm">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-fuchsia-500" />
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
                  <span className="text-fuchsia-500 mr-2">Q{qIdx + 1}.</span>
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
