const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    const originalContent = content;

    // Reduce sphere segments
    content = content.replace(/<sphereGeometry args={\[([^,]+),\s*32\s*,\s*32\]}/g, (m, p1) => `<sphereGeometry args={[${p1}, 16, 16]}`);
    content = content.replace(/<sphereGeometry args={\[([^,]+),\s*16\s*,\s*16\]}/g, (m, p1) => `<sphereGeometry args={[${p1}, 8, 8]}`);
    content = content.replace(/<sphereGeometry args={\[([^,]+),\s*32\]}/g, (m, p1) => `<sphereGeometry args={[${p1}, 16]}`);
    
    // Reduce cylinder segments (radialSegments is the 4th argument)
    content = content.replace(/<cylinderGeometry args={\[([^,]+),\s*([^,]+),\s*([^,]+),\s*64([^\]]*)\]}/g, (m, p1, p2, p3, rest) => `<cylinderGeometry args={[${p1}, ${p2}, ${p3}, 32${rest}]}`);
    content = content.replace(/<cylinderGeometry args={\[([^,]+),\s*([^,]+),\s*([^,]+),\s*32([^\]]*)\]}/g, (m, p1, p2, p3, rest) => `<cylinderGeometry args={[${p1}, ${p2}, ${p3}, 16${rest}]}`);
    content = content.replace(/<cylinderGeometry args={\[([^,]+),\s*([^,]+),\s*([^,]+),\s*16([^\]]*)\]}/g, (m, p1, p2, p3, rest) => `<cylinderGeometry args={[${p1}, ${p2}, ${p3}, 12${rest}]}`); // Minimum 12 for cylinder to look somewhat round

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Optimized geometry in:', filePath);
    }
}

processDir(path.join(__dirname, 'src', 'modules', 'physique'));
console.log('Geometry optimization complete.');
