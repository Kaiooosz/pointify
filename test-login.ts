import { PrismaClient } from './src/generated/prisma';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Manual .env loading with quote stripping
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let value = valueParts.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
            process.env[key.trim()] = value;
        }
    });
}

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeonHttp(connectionString, { arrayMode: false, fullResults: false });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error('Usage: tsx test-login.ts <email> <password>');
        process.exit(1);
    }

    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email.toLowerCase().trim(),
                mode: 'insensitive'
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    if (!user.password) {
        console.log('User has no password set');
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
