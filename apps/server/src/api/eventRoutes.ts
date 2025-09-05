import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

export default async function eventRoutes(app: FastifyInstance) {
  app.get('/events/:slug', async (req, reply) => {
    const { slug } = req.params as { slug: string };
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        rooms: { include: { sessions: true } },
        theme: true
      }
    });
    if (!event) return reply.code(404).send({ message: 'Event not found' });
    return event;
  });

  app.get('/sessions/:sessionId/polls', async (req, reply) => {
    const { sessionId } = req.params as { sessionId: string };
    const polls = await prisma.poll.findMany({ where: { sessionId } });
    return polls;
  });

  app.post('/polls/:id/start', async (req, reply) => {
    const { id } = req.params as { id: string };
    const poll = await prisma.poll.update({ where: { id }, data: { state: 'ACTIVE' } });
    return poll;
  });

  app.post('/polls/:id/stop', async (req, reply) => {
    const { id } = req.params as { id: string };
    const poll = await prisma.poll.update({ where: { id }, data: { state: 'FINISHED' } });
    return poll;
  });
}
