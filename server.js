/**
 * Simple HTTP server for SonicCanvas development
 * Serves static files with proper MIME types for audio/video
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.md': 'text/markdown'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse URL
    let filePath = '.' + req.url;

    // Default to landing.html for root
    if (filePath === './') {
        filePath = './landing.html';
    }

    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found - try to serve 404
                fs.readFile('./404.html', (err, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404 || '<h1>404 - File Not Found</h1>', 'utf-8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            // Success - serve file
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*' // Enable CORS for local development
            });
            res.end(content, 'utf-8');
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║        🎵  SonicCanvas - Development Server  🎵       ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('  📱 Open in browser:');
    console.log(`     → Landing Page:  http://localhost:${PORT}/landing.html`);
    console.log(`     → Application:   http://localhost:${PORT}/index.html`);
    console.log('');
    console.log('  Press Ctrl+C to stop the server');
    console.log('');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use.`);
        console.error(`   Try a different port: PORT=3000 npm start\n`);
    } else {
        console.error('\n❌ Server error:', err);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down server...\n');
    server.close(() => {
        console.log('✅ Server closed\n');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...\n');
    server.close(() => {
        console.log('✅ Server closed\n');
        process.exit(0);
    });
});
