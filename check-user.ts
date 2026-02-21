import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            email: {
                contains: 'kaiotsuno.10',
                mode: 'insensitive'
            }
        }
    });
    console.log('Users found:', users.map(u => ({ id: u.id, email: u.email })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
