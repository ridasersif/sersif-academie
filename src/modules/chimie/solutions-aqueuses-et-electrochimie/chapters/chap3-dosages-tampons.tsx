"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Beaker, CheckCircle, Calculator, HelpCircle, CheckCircle2 } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lazy load 3D Canvas
const AcidBaseTitration3DCanvas = dynamic(
  () => import("../components/AcidBaseTitration3DCanvas"),
  { ssr: false }
);

export function Chap3DosagesTampons() {
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});

  const handleQcmSelect = (questionIndex: number, optionIndex: number) => {
    if (qcmAnswers[questionIndex] !== undefined) return;
    setQcmAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const qcmData = [
    {
      question: "Quel indicateur coloré est le plus adapté pour le dosage de l'acide acétique (faible) par la soude (forte) ?",
      options: [
        "Le vert de bromocrésol (zone de virage: 3,8 - 5,4)",
        "Le bleu de bromothymol (zone de virage: 6,0 - 7,6)",
        "La phénolphtaléine (zone de virage: 8,2 - 10,0)",
        "L'hélianthine (zone de virage: 3,1 - 4,4)"
      ],
      correct: 2,
      explanation: "L'équivalence du titrage d'un acide faible par une base forte se situe en milieu basique (pH > 7 à cause de la base conjuguée formée). La phénolphtaléine est donc l'indicateur le plus adapté."
    },
    {
      question: "À quel point d'un titrage le pouvoir tampon est-il maximal ?",
      options: [
        "À l'équivalence",
        "À la demi-équivalence (V = Veq / 2)",
        "Au tout début du titrage",
        "Dans la zone de saut de pH"
      ],
      correct: 1,
      explanation: "À la demi-équivalence, les concentrations de l'acide et de sa base conjuguée sont égales (pH = pKa). C'est là que le pouvoir tampon est maximal, la courbe présente un point d'inflexion (la pente est minimale)."
    },
    {
      question: "Une solution est préparée en mélangeant des quantités égales d'ammoniac (NH3) et de chlorure d'ammonium (NH4Cl). Que se passe-t-il si on ajoute quelques gouttes de HCl ?",
      options: [
        "Le pH diminue drastiquement",
        "Le pH augmente drastiquement",
        "Le pH reste quasiment constant",
        "L'ammoniac précipite"
      ],
      correct: 2,
      explanation: "C'est une solution tampon (mélange équimolaire d'acide faible NH4+ et de base faible NH3). Son pH varie très peu lors de l'ajout modéré d'un acide fort comme HCl."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black mb-4">
          <Beaker className="w-4 h-4" />
          <span>Module 05 • Chapitre 03 • Dosages & Tampons</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Dosages Acido-Basiques & Solutions Tampons
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Découvrez le principe des titrages volumétriques, observez la courbe de pH en temps réel, et comprenez le rôle essentiel des solutions tampons en chimie et en biologie.
        </p>
      </section>

      {/* Introduction au dosage */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-500" />
          1. Principe d'un Titrage Acido-Basique
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Le titrage (ou dosage) a pour but de déterminer la concentration inconnue d'une solution 
            (titrée) à l'aide d'une solution de concentration connue (titrante).
          </p>
          <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-500/20 my-4 text-center">
            <span className="text-xs font-bold text-blue-400 block mb-2">À l'équivalence :</span>
            <LatexMath math="n_{titr\acute{e}} = n_{titrant} \implies C_a \cdot V_a = C_b \cdot V_b" />
          </div>
          <p>
            L'équivalence est repérée par le saut de pH sur la courbe de titrage ou par le changement de 
            couleur d'un indicateur coloré acido-basique judicieusement choisi.
          </p>
        </div>
      </section>

      {/* Laboratoire Virtuel (3D) */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Beaker className="w-5 h-5 text-blue-500" />
          2. Laboratoire Virtuel : Titrage Acide Fort par Base Forte
        </h2>
        <p className="text-sm text-muted-foreground">
          Simulez le titrage de 20 mL de HCl (0.1 M) par NaOH (0.1 M). Observez le tracé de la courbe et 
          le virage de l'indicateur coloré (phénolphtaléine) lors du franchissement de la zone de saut de pH.
        </p>
        <AcidBaseTitration3DCanvas />
      </section>

      {/* Solutions Tampons */}
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm mt-12">
        <h2 className="text-xl font-black text-foreground tracking-tight mb-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          3. Les Solutions Tampons
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
          <p>
            Une solution tampon est une solution dont le pH varie très peu lors de :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>L'ajout d'une quantité modérée d'acide fort ou de base forte.</li>
            <li>Une dilution modérée.</li>
          </ul>
          <p className="mt-4">
            Elle est généralement constituée d'un mélange d'un acide faible et de sa base conjuguée en 
            concentrations voisines. Son pouvoir tampon (<LatexMath math="\beta" />) est maximal pour :
          </p>
          <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 my-4 text-center">
            <LatexMath math="pH \approx pK_a \quad \text{soit} \quad [AH] \approx [A^-]" />
          </div>
          <p className="text-xs text-amber-400 font-bold bg-amber-500/10 p-3 rounded-lg">
            Remarque : Le sang humain est un système tampon très efficace maintenu à un pH d'environ 7,4 (système acide carbonique / hydrogénocarbonate).
          </p>
        </div>
      </section>

      {/* Exercice d'application */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-black text-blue-500 tracking-tight mb-4 flex items-center gap-3">
          <Calculator className="w-5 h-5" />
          Exercice d'Application
        </h2>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            On dose <LatexMath math="V_0 = 10,0 \text{ mL}" /> d'acide acétique (<LatexMath math="CH_3COOH" />) 
            de concentration <LatexMath math="C_0" /> par de la soude (<LatexMath math="NaOH" />) à <LatexMath math="C = 0,10 \text{ mol/L}" />. 
            Le volume équivalent trouvé est <LatexMath math="V_{eq} = 15,0 \text{ mL}" />.
          </p>
          <div className="pl-4 border-l-2 border-blue-500/30">
            <p className="text-xs font-bold text-foreground mb-1">Questions :</p>
            <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-1">
              <li>Calculer la concentration <LatexMath math="C_0" />.</li>
              <li>Quel est le pH à la demi-équivalence (<LatexMath math="V = 7,5 \text{ mL}" />) sachant que <LatexMath math="pK_a = 4,76" /> ?</li>
            </ol>
          </div>
          <details className="group mt-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <summary className="p-4 font-semibold cursor-pointer text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Voir la correction
            </summary>
            <div className="p-4 pt-0 border-t border-slate-800 text-xs text-muted-foreground space-y-3">
              <p>1. À l'équivalence :</p>
              <div className="text-center font-mono text-emerald-300">
                <LatexMath math="C_0 V_0 = C \cdot V_{eq} \implies C_0 = \frac{0,10 \times 15,0}{10,0} = 0,15 \text{ mol/L}" />
              </div>
              <p>2. À la demi-équivalence, on a dosé la moitié de l'acide faible. Donc <LatexMath math="[AH] = [A^-]" />.</p>
              <p>D'après la relation d'Henderson-Hasselbalch, <LatexMath math="pH = pK_a = 4,76" />.</p>
            </div>
          </details>
        </div>
      </section>

      {/* QCM SECTION */}
      <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8 mt-12 shadow-sm">
        <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
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
                  <span className="text-blue-500 mr-2">Q{qIdx + 1}.</span>
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
