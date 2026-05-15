import 'dotenv/config';
import * as argon2 from 'argon2';
import prisma from '../src/lib/prisma.js';

async function main() {
    try {
        // Default roles
        const adminRole = await prisma.userRole
            .upsert({
                where: { name: 'ADMIN' },
                update: {},
                create: {
                    name: 'ADMIN',
                },
            })
            .catch((e) => {
                if (e.code === 'P2002') {
                    return prisma.userRole.findUnique({
                        where: { name: 'ADMIN' },
                    });
                }
                throw e;
            });

        const userRole = await prisma.userRole
            .upsert({
                where: { name: 'USER' },
                update: {},
                create: {
                    name: 'USER',
                },
            })
            .catch((e) => {
                if (e.code === 'P2002') {
                    return prisma.userRole.findUnique({
                        where: { name: 'USER' },
                    });
                }
                throw e;
            });

        console.log('✓ Roles seeded successfully:', { adminRole, userRole });

        // Create default admin user
        const hashedPassword = await argon2.hash('admin123');
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                password: hashedPassword,
                roleId: adminRole.id,
                isActive: true,
            },
        });

        console.log('✓ Admin user seeded successfully:', {
            id: adminUser.id,
            email: adminUser.email,
        });
    } catch (e) {
        console.error('✗ Error seeding database:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
