
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "kaio@gmail.com";
    const password = "kaio123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists. Updating password...`);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                emailVerified: new Date(),
                role: "ADMIN",
                status: "ACTIVE",
                kycStatus: "VERIFIED"
            },
        });
        console.log("User updated successfully.");
    } else {
        console.log(`Creating new user ${email}...`);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: "Kaio",
                role: "ADMIN",
                emailVerified: new Date(),
                status: "ACTIVE",
                kycStatus: "VERIFIED"
            },
        });
        console.log("User created successfully.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
