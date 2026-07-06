// Script para mantener despiertos los servicios en Render
// Compatible con Linux y Windows

const https = require('https');

const urls = [
  'https://pc3-javascript.onrender.com',
  'https://pc3-javascript-1.onrender.com'
];

const intervalMinutes = 10;

function ping(url) {
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Ping a ${url}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`[${new Date().toISOString()}] Error al hacer ping a ${url}:`, e.message);
  });
}

function pingAll() {
  urls.forEach(ping);
}

console.log('Iniciando keep-alive para Render...');
pingAll(); // Primer ping inmediato
setInterval(pingAll, intervalMinutes * 60 * 1000); // Luego cada 10 minutos
