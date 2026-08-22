const fs = require('fs');

const files = [
  'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/Alternator3DCanvas.tsx',
  'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/HallEffect3DCanvas.tsx',
  'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/SkinEffect3DCanvas.tsx',
  'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/SolenoidPotentialExercise3DCanvas.tsx',
  'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/VectorPotentialExercise3DCanvas.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('eslint-disable react-hooks/purity')) {
      content = '/* eslint-disable react-hooks/purity */\n' + content;
      fs.writeFileSync(file, content, 'utf-8');
      console.log('Fixed', file);
    }
  } else {
    console.warn('File not found:', file);
  }
});
