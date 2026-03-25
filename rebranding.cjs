const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        return;
    }
    
    // Replace various forms of the old name
    const newContent = content
        .replace(/Elite Education/g, 'EliteHeat')
        .replace(/EliteEdu/g, 'EliteHeat')
        .replace(/Elite education/g, 'EliteHeat')
        .replace(/eliteedu/g, 'eliteheat');
        
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverse(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next' && file !== 'dist' && file !== '.firebase') {
                traverse(fullPath);
            }
        } else {
            if (/\.(tsx|ts|html|md|css|json)$/.test(file)) {
                replaceInFile(fullPath);
            }
        }
    }
}

const targetDir = 'c:/My Projects/Elite Education';
traverse(targetDir);
console.log('Rebranding complete.');
