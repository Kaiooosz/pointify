import { PrismaClient } from './src/generated/prisma';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import fs from 'fs';
import path from 'path';

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
    try {
        const result = await (prisma as any).$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `;
        console.log('Columns in User table:', result);
    } catch (err) {
        console.error('Error querying columns:', err);
    }
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
