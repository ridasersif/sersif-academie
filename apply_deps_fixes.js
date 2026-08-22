const fs = require('fs');
const filesToFix = [
  {
    path: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/ARQSTypesDual3DCanvas.tsx',
    find: '  }, []);',
    replace: '  }, [bRings]);',
  },
  {
    path: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/ARQSCondition3DCanvas.tsx',
    find: '  }, [freqLevel, time, k, isARQS, startX, wireLength]);',
    replace: '  }, [time, k, isARQS, startX, wireLength]);',
  },
  {
    path: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/LaplaceRail3DCanvas.tsx',
    find: '  }, [v0]);',
    replace: '  }, [isPlaying, v0, vel]);',
  },
  {
    path: 'src/modules/physique/electricite/electromagnetisme-dans-le-vide/components/SkinEffect3DCanvas.tsx',
    find: '  }, [deltaRatio, isTotal, innerR, R, wireLength]);',
    replace: '  }, [isTotal, innerR, R, wireLength]);',
  },
  {
    path: 'src/modules/physique/mecanique-du-point-et-du-solide/mecanique-du-point/components/DifferentialOperators3DSimulator.tsx',
    find: '      renderer.dispose();\n    };\n  }, []);',
    replace: '      renderer.dispose();\n    };\n  }, [amplitude]);',
  },
  {
    path: 'src/modules/physique/mecanique-du-point-et-du-solide/mecanique-du-point/components/VectorProductSimulator.tsx',
    find: '      renderer.dispose();\n    };\n  }, []);',
    replace: '      renderer.dispose();\n    };\n  }, [normU, normV]);',
  }
];

filesToFix.forEach(({path, find, replace}) => {
  if (fs.existsSync(path)) {
    const c = fs.readFileSync(path, 'utf8');
    if (c.includes(find)) {
      fs.writeFileSync(path, c.replace(find, replace));
      console.log('Fixed', path);
    } else {
      console.log('NOT FOUND in', path);
    }
  }
});
