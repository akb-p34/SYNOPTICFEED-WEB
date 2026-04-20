// Minimal static site build: substitute {{PARTIAL}} placeholders in templates.
// Run: node build.js
// Output: one built .html per template at project root.

const fs = require('fs');
const path = require('path');

const root = __dirname;
const templatesDir = path.join(root, 'templates');
const partialsDir = path.join(root, 'partials');

const partials = {};
for (const file of fs.readdirSync(partialsDir)) {
    if (!file.endsWith('.html')) continue;
    const name = path.basename(file, '.html').toUpperCase();
    partials[name] = fs.readFileSync(path.join(partialsDir, file), 'utf8').trim();
}

let built = 0;
for (const file of fs.readdirSync(templatesDir)) {
    if (!file.endsWith('.html')) continue;
    let content = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    for (const name of Object.keys(partials)) {
        content = content.split(`{{${name}}}`).join(partials[name]);
    }
    const out = path.join(root, file);
    fs.writeFileSync(out, content);
    console.log(`  built ${file}`);
    built++;
}

console.log(`Built ${built} page(s) from templates + ${Object.keys(partials).length} partial(s).`);
