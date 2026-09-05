import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
if (!fs.existsSync(path.join(root, 'fleet.html'))) {
  console.error('Build the website first: npm run build');
  process.exit(1);
}
const types = {'.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain'};
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, {Allow: 'GET, HEAD'}).end();
    return;
  }
  let filename;
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative) || pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
  } catch {
    response.writeHead(400).end('Invalid URL');
    return;
  }
  let status = 200;
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile() || path.basename(filename).startsWith('.')) {
    filename = path.join(root, '404.html');
    status = 404;
  }
  response.writeHead(status, {'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store'});
  if (request.method === 'HEAD') response.end();
  else fs.createReadStream(filename).on('error', () => response.destroy()).pipe(response);
});
server.on('error', error => {console.error(`Preview: ${error.message}`); process.exitCode = 1;});
server.listen(8080, '127.0.0.1', () => console.log('Website preview: http://localhost:8080/fleet.html\nAfter publishing changes in Sanity, run npm run build and refresh this page.'));
