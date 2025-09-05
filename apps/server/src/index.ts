import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as IOServer } from 'socket.io';
import dotenv from 'dotenv';
import eventRoutes from './api/eventRoutes.js';
import { setupSocketIO } from './sockets/index.js';

dotenv.config();

const DEFAULT_HOST = process.env.ALLOW_LAN === 'true' ? '0.0.0.0' : '127.0.0.1';
const HOST = process.env.HOST || DEFAULT_HOST;
const PORT = parseInt(process.env.PORT || '4000', 10);
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: WEB_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

await app.register(eventRoutes, { prefix: '/api' });

app.get('/health', async () => ({ status: 'ok' }));

// After fastify is ready, attach Socket.IO
const io = new IOServer(app.server, {
  cors: { origin: WEB_URL }
});
setupSocketIO(io);

async function start() {
  try {
    await app.listen({ host: HOST, port: PORT });
    app.log.info(`API on http://${HOST}:${PORT} (ALLOW_LAN=${process.env.ALLOW_LAN || 'false'})`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
