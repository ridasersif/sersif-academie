const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Add dpr={[1, 1.5]} to <Canvas> if it doesn't exist
    if (content.includes('<Canvas') && !content.includes('dpr={[')) {
        content = content.replace(/<Canvas([^>]*?)>/g, (match, attrs) => {
            if (!attrs.includes('dpr=')) {
                changed = true;
                return `<Canvas${attrs} dpr={[1, 1.5]}>`;
            }
            return match;
        });
    }

    // 2. Add Suspense inside Canvas if not already there
    // This uses a simple string replacement: <Canvas ...> -> <Canvas ...>\n          <Suspense fallback={null}>
    // and </Canvas> -> </Suspense>\n        </Canvas>
    if (content.includes('<Canvas') && !content.includes('<Suspense')) {
        changed = true;
        
        // Ensure Suspense is imported
        if (content.includes("from 'react'") || content.includes('from "react"')) {
            if (!content.includes('Suspense')) {
                content = content.replace(/import\s+React\s*,?\s*\{([^}]+)\}\s+from\s+['"]react['"]/, (match, imports) => {
                    return `import React, { Suspense, ${imports.trim()} } from "react"`;
                });
                // If it was just `import React from "react"`
                if (!content.includes('Suspense')) {
                    content = content.replace(/import\s+React\s+from\s+['"]react['"]/, 'import React, { Suspense } from "react"');
                }
            }
        } else {
            content = 'import { Suspense } from "react";\n' + content;
        }

        // Add <Suspense> inside <Canvas>
        content = content.replace(/(<Canvas[^>]*>)/g, '$1\n            <Suspense fallback={null}>');
        content = content.replace(/(<\/Canvas>)/g, '            </Suspense>\n          $1');
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated:', filePath);
    }
}

processDir(path.join(__dirname, 'src', 'modules', 'physique'));
console.log('Done.');
