require('dotenv').config()
const { Pool } = require('pg')
const { PrismaClient } = require('./generated-client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = 'bitcoin2009'
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Cleaning up database...')
    await prisma.adminLog.deleteMany({})
    await prisma.transaction.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.cartItem.deleteMany({})
    await prisma.cart.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.partner.deleteMany({})
    await prisma.paymentLink.deleteMany({})
    await prisma.user.deleteMany({})

    // Create Base Admins
    const superAdmin = await prisma.user.create({
        data: {
            email: 'adm@pointify.com',
            name: 'Super Admin Pointify',
            password: hashedPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
            pointsBalance: 10000000,
            kycStatus: 'VERIFIED',
        },
    })

    const financeAdmin = await prisma.user.create({
        data: {
            email: 'finance@pointify.com',
            name: 'Financeiro Central',
            password: hashedPassword,
            role: 'FINANCE',
            status: 'ACTIVE',
            pointsBalance: 0,
            kycStatus: 'VERIFIED',
        },
    })

    // Create Various Users for Backoffice View
    const users = [
        { email: 'test@test.com', name: 'Usuário de Teste 1', role: 'CUSTOMER', status: 'ACTIVE', origin: 'INSTAGRAM', instagram: '@kai.pointify' },
        { email: 'joao@email.com', name: 'João Silva', role: 'CUSTOMER', status: 'PENDING', origin: 'API' },
        { email: 'maria@email.com', name: 'Maria Souza', role: 'PARTNER', status: 'ANALYSIS', riskScore: 75, instagram: '@maria_negocios' },
        { email: 'fraude@risco.com', name: 'Alerta Risco', role: 'CUSTOMER', status: 'BLOCKED', riskScore: 95 },
        { email: 'investidor@point.com', name: 'Investidor Elite', role: 'CUSTOMER', status: 'ACTIVE', pointsBalance: 2500000 },
    ]

    const createdUsers = []
    for (const u of users) {
        const user = await prisma.user.create({
            data: {
                ...u,
                password: hashedPassword,
                kycStatus: u.status === 'ACTIVE' ? 'VERIFIED' : 'PENDING',
                dailyLimit: 2000000,
            }
        })
        createdUsers.push(user)
    }

    // Create Rich Transactional Data
    const transactions = [
        { userId: createdUsers[0].id, grossAmount: 50000, spread: 500, netAmount: 49500, amount: 49500, type: 'PIX_DEPOSIT', status: 'COMPLETED', method: 'PIX', description: 'Depósito PIX Online' },
        { userId: createdUsers[1].id, grossAmount: 100000, spread: 1500, netAmount: 98500, amount: 98500, type: 'BOLETO_DEPOSIT', status: 'PENDING', method: 'BOLETO', description: 'Emissão de Boleto Bancário' },
        { userId: createdUsers[2].id, grossAmount: 25000, spread: 250, netAmount: 24750, amount: 24750, type: 'MERCHANT_PAYMENT', status: 'COMPLETED', method: 'LINK', description: 'Venda via Link de Pagamento' },
        { userId: createdUsers[4].id, grossAmount: 500000, spread: 0, netAmount: 500000, amount: 500000, type: 'PIX_DEPOSIT', status: 'COMPLETED', method: 'PIX', description: 'Investimento Direto' },
        { userId: createdUsers[0].id, grossAmount: 10000, spread: 200, netAmount: 9800, amount: 9800, type: 'PIX_WITHDRAW', status: 'COMPLETED', method: 'PIX', description: 'Saque para Conta Pessoal' },
    ]

    for (const tx of transactions) {
        await prisma.transaction.create({ data: tx })
    }

    // Create System Settings
    const settings = [
        { key: 'pix_fee_percent', value: '1.5', category: 'FINANCIAL' },
        { key: 'boleto_fee_fixed', value: '3.90', category: 'FINANCIAL' },
        { key: 'min_withdraw_amount', value: '1000', category: 'FINANCIAL' },
        { key: 'maintenance_mode', value: 'false', category: 'GENERAL' },
    ]

    for (const s of settings) {
        await prisma.systemSetting.create({ data: s })
    }

    // Initial Logs
    await prisma.adminLog.create({
        data: {
            responsibleId: superAdmin.id,
            action: 'SYSTEM_GENESIS',
            details: 'Initial system seeding and database reset',
            ip: '127.0.0.1'
        }
    })

    console.log('Seed completed successfully.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
