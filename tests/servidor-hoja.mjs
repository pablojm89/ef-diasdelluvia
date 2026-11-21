// Local test server that answers like the deployed Apps Script: it runs backend/apps-script/aula.gs on the
// simulated sheets of tests/doble-google.mjs. Only for local checks; it is not Google.
// Use: node tests/servidor-hoja.mjs [port]   ·   POST/GET http://127.0.0.1:<port>/exec   ·   GET /hojas shows the sheets.
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {cargarGs, dobleGoogle} from './doble-google.mjs';

export function servidorHoja(port = 3107, file = fileURLToPath(new URL('../backend/apps-script/aula.gs', import.meta.url))) {
 const doble = dobleGoogle(), gs = cargarGs(file, doble), log = [];
 const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const send = (status, body) => { res.writeHead(status, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}); res.end(JSON.stringify(body)); };
  if (url.pathname === '/hojas') return send(200, Object.fromEntries(doble.book.getSheets().map(s => [s.getName(), s.table()])));
  if (url.pathname !== '/exec') return send(404, {});
  if (req.method === 'GET') { log.push({method: 'GET', query: Object.fromEntries(url.searchParams)}); return send(200, gs.get(Object.fromEntries(url.searchParams))); }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => { log.push({method: 'POST', type: req.headers['content-type'], body}); send(200, JSON.parse(gs.doPost({postData: {contents: body}}).getContent())); });
 });
 return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve({server, doble, log, close: () => new Promise(done => server.close(done))})));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
 const port = Number(process.argv[2]) || 3107;
 await servidorHoja(port);
 console.log(`Hoja simulada en http://127.0.0.1:${port}/exec`);
}
