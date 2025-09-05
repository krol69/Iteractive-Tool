import type { Server, Socket } from 'socket.io';
import { prisma } from '../lib/prisma.js';
import { registerPollHandlers } from './pollHandler.js';

export function setupSocketIO(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('joinEvent', async ({ eventSlug, role, displayName }) => {
      try {
        const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
        if (!event) {
          socket.emit('error', { message: 'Event not found' });
          return;
        }

        const user = await prisma.user.create({
          data: {
            socketId: socket.id,
            eventId: event.id,
            role: role || 'PARTICIPANT',
            displayName
          }
        });

        // Attach meta
        (socket.data as any).user = user;
        (socket.data as any).eventId = event.id;

        // Join event room
        socket.join(`event:${event.id}`);

        // Emit confirmation
        socket.emit('eventJoined', { event, user });

        // Register feature handlers
        registerPollHandlers(io, socket);
      } catch (e) {
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    socket.on('disconnect', async () => {
      const user = (socket.data as any)?.user;
      if (user?.id) {
        await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      }
    });
  });
}
