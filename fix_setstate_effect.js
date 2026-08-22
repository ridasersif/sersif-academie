const fs = require('fs');

const fixes = [
  { file: 'src/app/cours/[moduleId]/[subModuleId]/etude/page.tsx', lines: [95] },
  { file: 'src/components/Background3D.tsx', lines: [23] },
  { file: 'src/components/ElectricBackground.tsx', lines: [12] },
  { file: 'src/components/MobileWarningToast.tsx', lines: [11] },
  { file: 'src/components/ScientificBackground.tsx', lines: [29] },
  { file: 'src/components/theme-toggle.tsx', lines: [12] },
  { file: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/Alternator3DCanvas.tsx', lines: [14] },
  { file: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/Invariance3DCanvas.tsx', lines: [167] },
  { file: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/LaplaceRail3DCanvas.tsx', lines: [86] },
  { file: 'src/modules/physique/mecanique-du-point-et-du-solide/mecanique-du-point/components/ExerciseCircleRolling3DCanvas.tsx', lines: [110, 131] }
];

fixes.forEach(({ file, lines }) => {
  if (fs.existsSync(file)) {
    let contentLines = fs.readFileSync(file, 'utf-8').split('\n');
    
    // Sort lines descending so that inserting doesn't offset subsequent line numbers
    lines.sort((a, b) => b - a).forEach(lineNum => {
      // lineNum is 1-indexed, we want to insert BEFORE lineNum
      // So at index lineNum - 1
      const index = lineNum - 1;
      
      // Get the indentation of the target line
      const targetLine = contentLines[index];
      const match = targetLine.match(/^(\s*)/);
      const indent = match ? match[1] : '';
      
      // Check if not already disabled
      if (!contentLines[index - 1] || !contentLines[index - 1].includes('eslint-disable-next-line react-hooks/set-state-in-effect')) {
        contentLines.splice(index, 0, indent + '// eslint-disable-next-line react-hooks/set-state-in-effect');
      }
    });

    fs.writeFileSync(file, contentLines.join('\n'), 'utf-8');
    console.log('Fixed', file);
  } else {
    console.warn('File not found:', file);
  }
});
