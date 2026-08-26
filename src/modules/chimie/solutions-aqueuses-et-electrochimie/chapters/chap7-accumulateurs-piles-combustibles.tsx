"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Flame, Calculator, HelpCircle, CheckCircle2, BatteryCharging } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lazy load 3D Canvas
const FuelCell3DCanvas = dynamic(
  () => import("../components/FuelCell3DCanvas"),
  { ssr: false }
);

export function Chap7AccumulateursPilesCombustibles() {
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});

  const handleQcmSelect = (questionIndex: number, optionIndex: number) => {
    if (qcmAnswers[questionIndex] !== undefined) return;
    setQcmAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const qcmData = [
    {
      question: "Quelle est la particularité d'un accumulateur par rapport à une pile classique ?",
      options: [
        "Il produit une tension plus élevée",
        "Il fonctionne sans électrolyte",
        "Ses réactions d'oxydo-réduction sont réversibles",
        "Il consomme du dihydrogène en continu"
      ],
      correct: 2,
      explanation: "Un accumulateur (batterie) peut être rechargé car les réactions chimiques aux électrodes sont réversibles. En appliquant un courant inverse (électrolyse), on régénère les réactifs initiaux."
    },
    {
      question: "Quels sont les déchets produits par une pile à combustible à dihydrogène (H2) ?",
      options: [
        "Du dioxyde de carbone (CO2)",
        "De l'eau (H2O) et de la chaleur",
        "De l'ozone (O3)",
        "Des oxydes d'azote (NOx)"
      ],
      correct: 1,
      explanation: "La réaction globale d'une pile à combustible H2/O2 est 2 H2 + O2 -> 2 H2O. Elle ne rejette donc que de l'eau pure et de l'énergie thermique (chaleur), ce qui en fait une technologie propre à l'usage."
    },
    {
      question: "La capacité Q d'une batterie est souvent exprimée en Ampère-heure (Ah). À combien de Coulombs correspond 1 Ah ?",
      options: [
        "1 C",
        "60 C",
        "3600 C",
        "96500 C"
      ],
      correct: 2,
      explanation: "Q = I * t. Pour 1 Ah, l'intensité est de 1 Ampère pendant 1 heure (3600 secondes). Donc 1 Ah = 1 A * 3600 s = 3600 Coulombs."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black mb-4">
          <BatteryCharging className="w-4 h-4" />
          <span>Module 05 • Chapitre 07 • Technologies Avancées</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Accumulateurs & Piles à Combustibles
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Explorez l'avenir du stockage d'énergie : les batteries rechargeables (accumulateurs) et la technologie hydrogène des piles à combustible pour la transition énergétique.
        </p>
      </section>

      {/* Les Accumulateurs */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BatteryCharging className="w-5 h-5 text-rose-500" />
          1. Les Accumulateurs (Batteries Rechargeables)
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Contrairement aux piles primaires (salines ou alcalines) qui sont jetables, un <strong>accumulateur</strong> 
            (ou pile secondaire) repose sur des réactions d'oxydo-réduction <em>réversibles</em>. Il possède deux modes de fonctionnement :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">Décharge (Générateur)</h4>
              <p className="text-xs">
                Fonctionnement spontané (<LatexMath math="\Delta E > 0" />). Il fournit de l'énergie électrique au circuit. 
                L'anode est le pôle (-), la cathode est le pôle (+). Les réactifs sont consommés.
              </p>
            </div>
            <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl">
              <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">Charge (Récepteur)</h4>
              <p className="text-xs">
                Fonctionnement forcé (<LatexMath math="\Delta E < 0" />). Un générateur externe impose un courant en sens inverse. 
                L'anode (oxydation forcée) devient le pôle (+), la cathode le pôle (-). Les réactifs sont régénérés.
              </p>
            </div>
          </div>
          
          <p className="mt-6">
            Exemples courants : L'accumulateur au plomb (voitures thermiques), l'accumulateur Lithium-Ion (smartphones, voitures électriques).
          </p>
        </div>
      </section>

      {/* 3D Laboratory (Pile à Combustible) */}
      <section className="space-y-4 mt-12">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Flame className="w-5 h-5 text-rose-500" />
          2. Simulateur 3D : Pile à Combustible (Hydrogène)
        </h2>
        <p className="text-sm text-muted-foreground">
          Une pile à combustible n'a pas besoin d'être "rechargée" électriquement. Tant qu'on l'alimente en 
          combustible (H₂) et en comburant (O₂), elle produit de l'électricité. Observez la séparation du dihydrogène 
          et la formation de l'eau.
        </p>
        <FuelCell3DCanvas />
      </section>

      {/* Thermodynamique de la pile à combustible */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm mt-12">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-rose-500" />
          3. Équations de la Pile à Combustible Alcaline
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Dans une pile à combustible alcaline (électrolyte contenant <LatexMath math="OH^-" />), les réactions sont les suivantes :
          </p>
          <div className="space-y-3 mt-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-xs font-bold text-rose-400">Anode (-) : Oxydation du H₂</span>
                <span className="font-mono text-emerald-300"><LatexMath math="H_2 + 2 OH^- \rightleftharpoons 2 H_2O + 2 e^-" /></span>
              </div>
            </div>
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-400">Cathode (+) : Réduction du O₂</span>
                <span className="font-mono text-emerald-300"><LatexMath math="\frac{1}{2} O_2 + H_2O + 2 e^- \rightleftharpoons 2 OH^-" /></span>
              </div>
            </div>
            
            <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-500/30 text-center font-bold text-base mt-2">
              <span className="text-xs font-normal text-muted-foreground block mb-1">Équation Globale</span>
              <LatexMath math="H_2 + \frac{1}{2} O_2 \longrightarrow H_2O" />
            </div>
          </div>
        </div>
      </section>

      {/* Exercice d'application */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-rose-500 tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5" />
          Exercice d'Application (Capacité)
        </h2>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            La batterie Lithium-Ion d'un smartphone moderne a une capacité <LatexMath math="Q = 4000 \text{ mAh}" /> 
            (<LatexMath math="4,0 \text{ Ah}" />). Le smartphone consomme un courant constant de <LatexMath math="I = 200 \text{ mA}" />.
          </p>
          <div className="pl-4 border-l-2 border-rose-500/30">
            <p className="text-xs font-bold text-foreground mb-1">Questions :</p>
            <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-1">
              <li>Quelle est l'autonomie <LatexMath math="\Delta t" /> (en heures) de ce smartphone ?</li>
              <li>Quelle est la charge totale <LatexMath math="Q" /> en Coulombs stockée dans la batterie ?</li>
            </ol>
          </div>
          <details className="group mt-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <summary className="p-4 font-semibold cursor-pointer text-xs text-rose-400 hover:text-rose-300 transition-colors">
              Voir la correction
            </summary>
            <div className="p-4 pt-0 border-t border-slate-800 text-xs text-muted-foreground space-y-3">
              <p>1. Autonomie :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="\Delta t = \frac{Q}{I} = \frac{4000 \text{ mAh}}{200 \text{ mA}} = 20 \text{ heures}" />
              </div>
              
              <p>2. Charge en Coulombs :</p>
              <p>On convertit la capacité en Ampères-heures puis en Coulombs : <LatexMath math="Q = 4,0 \text{ Ah}" />.</p>
              <p>Sachant que <LatexMath math="1 \text{ heure} = 3600 \text{ s}" /> et que <LatexMath math="1 \text{ A} \cdot \text{s} = 1 \text{ C}" /> :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="Q = 4,0 \times 3600 = 14400 \text{ Coulombs}" />
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* QCM SECTION */}
      <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8 mt-12 shadow-sm">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-500" />
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
                  <span className="text-rose-500 mr-2">Q{qIdx + 1}.</span>
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
