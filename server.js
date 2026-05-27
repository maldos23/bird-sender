import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, maxPayload: 100 * 1024 * 1024 });

const PORT = 3000;
const HEADER_SIZE = 27;

app.use(express.static(join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

const clients = new Map();

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

function relay(ws, data) {
  if (ws.readyState === 1) {
    ws.send(data);
  }
}

wss.on('connection', (ws) => {
  const clientId = Math.random().toString(36).substring(2, 8);
  clients.set(clientId, ws);
  ws.id = clientId;

  ws.send(JSON.stringify({ type: 'init', id: clientId }));

  const peers = [];
  clients.forEach((client, id) => {
    if (id !== clientId) {
      peers.push(id);
    }
  });
  ws.send(JSON.stringify({ type: 'peers', peers }));

  clients.forEach((client, id) => {
    if (id !== clientId && client.readyState === 1) {
      client.send(JSON.stringify({ type: 'peer-joined', peerId: clientId }));
    }
  });

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      if (data.length < HEADER_SIZE) return;

      const header = data.subarray(0, HEADER_SIZE);
      const targetId = Buffer.from(header.subarray(1, 7)).toString('ascii').trim();

      const target = clients.get(targetId);
      if (target && target.readyState === 1) {
        relay(target, data);
      }
    } else {
      const message = JSON.parse(data.toString());

      if (message.type === 'transfer-offer') {
        const target = clients.get(message.to);
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({
            type: 'transfer-offer',
            from: clientId,
            transferId: message.transferId,
            files: message.files
          }));
        }
      }

      if (message.type === 'transfer-response') {
        const target = clients.get(message.to);
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({
            type: 'transfer-response',
            from: clientId,
            transferId: message.transferId,
            accepted: message.accepted
          }));
        }
      }

      if (message.type === 'transfer-complete') {
        const target = clients.get(message.to);
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({
            type: 'transfer-complete',
            from: clientId,
            transferId: message.transferId
          }));
        }
      }
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: 'peer-left', peerId: clientId }));
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log(`\n  🐦 bird-sender\n`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${ip}:${PORT}\n`);
});
