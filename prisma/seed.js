require('dotenv').config()
const { Pool } = require('pg')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const adminEmail = 'adm@pointify.com'
    const hashedPassword = await bcrypt.hash('bitcoin2009', 10)

    // Create/Update Admin User
    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            kycStatus: 'VERIFIED'
        },
        create: {
            email: adminEmail,
            name: 'Administrador Pointify',
            password: hashedPassword,
            role: 'ADMIN',
            pointsBalance: 1000000,
            kycStatus: 'VERIFIED',
        },
    })

    console.log('Admin user created/updated:', adminEmail)

    // Create some dummy analytics data if needed
    // In our schema, analytics comes from transactions and users

    await prisma.transaction.createMany({
        data: [
            { userId: user.id, amount: 5000, type: 'PIX_DEPOSIT', status: 'COMPLETED', description: 'Initial Capital', currency: 'BRL' },
            { userId: user.id, amount: 100, type: 'CASHBACK', status: 'COMPLETED', description: 'System Test Fee', currency: 'POINTS' },
        ]
    })

    console.log('Seed completed successfully.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
