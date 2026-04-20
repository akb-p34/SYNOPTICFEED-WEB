const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

function serveFile(filePath, res) {
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

const server = http.createServer((req, res) => {
    // Strip query string
    const urlPath = req.url.split('?')[0];
    let filePath = '.' + urlPath;

    if (filePath === './') {
        filePath = './index.html';
    }

    // cleanUrls parity with Vercel: if path has no extension, try dir/index.html, then path.html
    if (!path.extname(filePath)) {
        const indexPath = filePath.replace(/\/$/, '') + '/index.html';
        const htmlPath = filePath.replace(/\/$/, '') + '.html';
        fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
            if (!indexErr) {
                serveFile(indexPath, res);
                return;
            }
            fs.access(htmlPath, fs.constants.F_OK, (htmlErr) => {
                if (!htmlErr) {
                    serveFile(htmlPath, res);
                } else {
                    serveFile(filePath, res);
                }
            });
        });
        return;
    }

    serveFile(filePath, res);
});

server.listen(PORT, () => {
    console.log(`
    ========================================
    SYNOPTICFEED Server Running
    ========================================

    Access at: http://localhost:${PORT}

    Press Ctrl+C to stop
    `);
});