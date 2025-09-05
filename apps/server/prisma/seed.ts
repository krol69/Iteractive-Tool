import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create demo event with room, session and a sample poll
  const event = await prisma.event.upsert({
    where: { slug: 'demo-event' },
    update: {},
    create: {
      name: 'Demo Day Showcase',
      slug: 'demo-event',
      rooms: {
        create: [
          {
            name: 'Main Stage',
            order: 1,
            sessions: {
              create: [
                {
                  name: 'Opening Session',
                  startAt: new Date(),
                  polls: {
                    create: [
                      {
                        type: 'SINGLE_CHOICE',
                        question: 'What is your favorite JS framework?',
                        options: [
                          { id: 'react', text: 'React' },
                          { id: 'vue', text: 'Vue' },
                          { id: 'svelte', text: 'Svelte' },
                          { id: 'angular', text: 'Angular' }
                        ] as any,
                        settings: {} as any
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeded event:', event.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
