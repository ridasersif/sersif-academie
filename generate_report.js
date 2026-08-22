const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));
  let errorMdContent = `# 🚨 Liste des Erreurs Fatales et Problèmes par Fichier

Ce document contient l'analyse fichier par fichier des problèmes critiques (React, Hooks, TypeScript) à résoudre dans le projet.

`;

  data.forEach(file => {
    const fatalErrors = file.messages.filter(m => 
      m.ruleId !== 'react/no-unescaped-entities' && 
      m.ruleId !== '@typescript-eslint/no-unused-vars' &&
      m.ruleId !== 'prefer-const' &&
      m.ruleId !== '@typescript-eslint/no-explicit-any'
    );

    if (fatalErrors.length > 0) {
      const relativePath = file.filePath.replace(process.cwd() + '\\', '').replace(/\\/g, '/');
      errorMdContent += `### 📁 [\`${relativePath}\`](file:///${file.filePath.replace(/\\/g, '/')})\n`;
      fatalErrors.forEach(err => {
        const desc = err.message.split('\\n')[0].substring(0, 100);
        errorMdContent += `- Ligne ${err.line}:${err.column} : **${err.ruleId}** - ${desc}...\n`;
      });
      errorMdContent += `\n`;
    }
  });

  // Add the general problems
  errorMdContent += `## 🐢 Problèmes Généraux de Performance et Architecture (À résoudre)
- **Trop de Canvas WebGL simultanés** (Crash navigateur).
- **Effet Bloom gourmand** : A désactiver sur mobile.
- **Géométries 3D trop lourdes** : Réduire le nombre de segments (ex: sphères 16x16 -> 6x6).
- **Fuites de mémoire** : Ajouter les appels \`geometry.dispose()\` et \`material.dispose()\`.
- **Fichiers manquants** : \`SmartSearch.tsx\`, \`searchIndex.ts\`, \`chap3-potentiel-dipole.tsx\`.
`;

  fs.writeFileSync('error.md', errorMdContent);
  console.log('error.md generated successfully.');
} catch (e) {
  console.error("Error generating report: ", e);
}
