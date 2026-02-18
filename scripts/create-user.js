
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
    try {
        const email = "kaio@gmail.com";
        const password = "kaio123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        let resultMsg = "";

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
            resultMsg = "User updated successfully.";
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
            resultMsg = "User created successfully.";
        }

        fs.writeFileSync("user-creation-log.txt", resultMsg);
        console.log(resultMsg);

    } catch (error) {
        fs.writeFileSync("user-creation-error.txt", error.toString());
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
