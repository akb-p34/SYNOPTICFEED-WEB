// Static site build: substitute {{PARTIAL}} placeholders in templates.
// Run: node build.js
// Output: one built .html per template at project root.

const fs = require('fs');
const path = require('path');

const root = __dirname;
const templatesDir = path.join(root, 'templates');
const partialsDir = path.join(root, 'partials');

// Popup HTML ships on every page so explicit click triggers (tier buttons) work everywhere.
// Auto-trigger (exit intent, 30s delay) is suppressed per-path inside popup.js.

function partialName(filename) {
    return path.basename(filename, '.html').toUpperCase().replace(/-/g, '_');
}

function loadPartials() {
    const out = {};
    for (const file of fs.readdirSync(partialsDir)) {
        if (!file.endsWith('.html')) continue;
        out[partialName(file)] = fs.readFileSync(path.join(partialsDir, file), 'utf8').trim();
    }
    return out;
}

function expand(content, partials, maxPasses = 8) {
    for (let i = 0; i < maxPasses; i++) {
        const before = content;
        for (const name of Object.keys(partials)) {
            content = content.split(`{{${name}}}`).join(partials[name]);
        }
        if (content === before) break;
    }
    return content.replace(/\{\{[A-Z_]+\}\}/g, '');
}

const partials = loadPartials();

let built = 0;
for (const file of fs.readdirSync(templatesDir)) {
    if (!file.endsWith('.html')) continue;
    const template = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    const output = expand(template, partials);
    fs.writeFileSync(path.join(root, file), output);
    console.log(`  built ${file}`);
    built++;
}

console.log(`Built ${built} page(s) from templates + ${Object.keys(partials).length} partial(s).`);
