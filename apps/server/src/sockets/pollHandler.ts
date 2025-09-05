import type { Server, Socket } from 'socket.io';
import { prisma } from '../lib/prisma.js';

export function registerPollHandlers(io: Server, socket: Socket) {
  socket.on('startPoll', async ({ pollId }) => {
    const poll = await prisma.poll.update({ where: { id: pollId }, data: { state: 'ACTIVE' } });
    io.to(`event:${socket.data.eventId}`).emit('pollStarted', poll);
  });

  socket.on('stopPoll', async ({ pollId }) => {
    const poll = await prisma.poll.update({ where: { id: pollId }, data: { state: 'FINISHED' } });
    io.to(`event:${socket.data.eventId}`).emit('pollStopped', poll);
  });

  socket.on('submitPollResponse', async ({ pollId, responseData }) => {
    try {
      await prisma.response.create({
        data: {
          pollId,
          payload: responseData,
          authorId: socket.data.user?.id
        }
      });

      // Compute quick results for single-choice
      const poll = await prisma.poll.findUnique({ where: { id: pollId } });
      if (!poll) return;
      const responses = await prisma.response.findMany({ where: { pollId } });
      const counts: Record<string, number> = {};
      for (const r of responses) {
        const opt = (r.payload as any).selectedOption;
        if (!opt) continue;
        counts[opt] = (counts[opt] || 0) + 1;
      }
      io.to(`event:${socket.data.eventId}`).emit('pollResultsUpdated', { pollId, results: counts });
    } catch (e) {
      socket.emit('error', { message: 'Could not submit response' });
    }
  });
}
