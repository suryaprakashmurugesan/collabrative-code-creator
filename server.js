const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');
const { diff_match_patch } = require('diff-match-patch');

const app = express();
const server = http.createServer(app);
const WS_PORT = Number(process.env.WS_PORT) || 8089;
const wss = new WebSocketServer({ port: WS_PORT });

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'running',
    websocket_port: WS_PORT,
    connected_clients: wss.clients.size,
    timestamp: new Date().toISOString()
  });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize the diff-match-patch instance
const dmp = new diff_match_patch();

// This will be our "master" document state on the server.
let masterDocument = 'Welcome to the Collaborative Code Editor!\n\nStart typing here...';

// Track connection count
let clientCount = 0;

wss.on('connection', (ws) => {
  clientCount++;
  const clientId = clientCount;
  
  // 1. A new client has connected.
  console.log(`[CLIENT ${clientId}] Connected. Total clients: ${wss.clients.size}`);

  // Send welcome message
  ws.send(JSON.stringify({ 
    type: 'connection', 
    message: 'Connected to Code Sync server',
    clientId: clientId
  }));

  // 2. Send the current master document to the newly connected client.
  ws.send(JSON.stringify({ type: 'full-document', content: masterDocument }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // 3. A client has sent a patch.
      if (data.type === 'patch') {
        const patches = dmp.patch_fromText(data.patch);
        
        // 4. Apply the patch to the master document.
        const [newMasterDocument, results] = dmp.patch_apply(patches, masterDocument);

        // Check if the patch applied cleanly
        if (results.every(result => result === true)) {
          masterDocument = newMasterDocument;
          console.log(`[CLIENT ${clientId}] Patch applied successfully. Document size: ${masterDocument.length} chars`);

          // 5. Broadcast the patch to ALL connected clients.
          // The server is the single source of truth.
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify({ type: 'patch', patch: data.patch }));
            }
          });
        } else {
          console.error(`[CLIENT ${clientId}] Patch application failed. Results:`, results);
          // Send resync request
          ws.send(JSON.stringify({ type: 'full-document', content: masterDocument }));
        }
      }
    } catch (error) {
      console.error(`[CLIENT ${clientId}] Failed to process message:`, error);
    }
  });

  ws.on('close', () => {
    console.log(`[CLIENT ${clientId}] Disconnected. Total clients: ${wss.clients.size - 1}`);
  });

  ws.on('error', (error) => {
    console.error(`[CLIENT ${clientId}] WebSocket error:`, error);
  });
});

const PORT = Number(process.env.PORT) || 8088;
server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  🚀 CODE SYNC SERVER STARTED`);
  console.log(`╠════════════════════════════════════════╣`);
  console.log(`║  Frontend: http://localhost:${PORT}`);
  console.log(`║  WebSocket: ws://localhost:${WS_PORT}`);
  console.log(`║  Health: http://localhost:${PORT}/health`);
  console.log(`╚════════════════════════════════════════╝\n`);
});
