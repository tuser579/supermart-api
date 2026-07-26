"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // ── Create Admin User ─────────────────────────────────────
    const adminPasswordHash = await bcryptjs_1.default.hash('Admin@123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@supermart.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@supermart.com',
            phone: '+8801700000001',
            passwordHash: adminPasswordHash,
            role: client_1.Role.ADMIN,
            isVerified: true,
            adminProfile: {
                create: {
                    permissions: ['ALL'],
                    superAdmin: true,
                },
            },
        },
    });
    console.log('✅ Admin user created:', adminUser.email);
    // ── Create Staff User ──────────────────────────────────────
    const staffPasswordHash = await bcryptjs_1.default.hash('Staff@123', 10);
    const staffUser = await prisma.user.upsert({
        where: { email: 'delivery@supermart.com' },
        update: {},
        create: {
            name: 'John Delivery',
            email: 'delivery@supermart.com',
            phone: '+8801700000002',
            passwordHash: staffPasswordHash,
            role: client_1.Role.STAFF,
            isVerified: true,
            staffProfile: {
                create: {
                    staffId: 'STAFF-001',
                    position: client_1.StaffPosition.DELIVERY_BOY,
                    assignedArea: ['Dhaka North', 'Dhaka South'],
                },
            },
        },
    });
    console.log('✅ Staff user created:', staffUser.email);
    // ── Create Regular User ────────────────────────────────────
    const userPasswordHash = await bcryptjs_1.default.hash('User@123', 10);
    const regularUser = await prisma.user.upsert({
        where: { email: 'user@supermart.com' },
        update: {},
        create: {
            name: 'Alice Customer',
            email: 'user@supermart.com',
            phone: '+8801700000003',
            passwordHash: userPasswordHash,
            role: client_1.Role.USER,
            isVerified: true,
        },
    });
    console.log('✅ Regular user created:', regularUser.email);
    // ── Create Sample Products ─────────────────────────────────
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages'];
    const products = [
        { name: 'Fresh Apples (1kg)', category: 'Fruits', price: 120, stock: 100, brand: 'Farm Fresh' },
        { name: 'Organic Bananas (1 dozen)', category: 'Fruits', price: 60, stock: 150, brand: 'Green Valley' },
        { name: 'Baby Spinach (500g)', category: 'Vegetables', price: 45, stock: 80, brand: 'Organic Farms' },
        { name: 'Tomatoes (1kg)', category: 'Vegetables', price: 35, stock: 200, brand: 'Local Harvest' },
        { name: 'Full Cream Milk (1L)', category: 'Dairy', price: 75, stock: 120, brand: 'Aarong Dairy' },
        { name: 'Greek Yogurt (500g)', category: 'Dairy', price: 95, stock: 60, brand: 'Aarong Dairy' },
        { name: 'Whole Wheat Bread', category: 'Bakery', price: 55, stock: 40, brand: 'Olympic' },
        { name: 'Orange Juice (1L)', category: 'Beverages', price: 110, stock: 90, brand: 'Pran' },
        { name: 'Green Tea (25 bags)', category: 'Beverages', price: 80, stock: 200, brand: 'Ispahani' },
        { name: 'Carrot (500g)', category: 'Vegetables', price: 25, stock: 150, brand: 'Local Harvest' },
    ];
    for (const product of products) {
        await prisma.product.upsert({
            where: { id: `seed-${product.name.toLowerCase().replace(/\s+/g, '-')}` },
            update: {},
            create: {
                id: `seed-${product.name.toLowerCase().replace(/\s+/g, '-')}`,
                ...product,
                description: `Premium quality ${product.name} sourced directly from trusted suppliers.`,
                images: [`https://placehold.co/400x300?text=${encodeURIComponent(product.name)}`],
                createdBy: adminUser.id,
            },
        });
    }
    console.log(`✅ ${products.length} sample products created`);
    // ── Create Sample Orders ───────────────────────────────────
    const sampleAddress = {
        fullName: regularUser.name,
        phone: regularUser.phone,
        addressLine1: 'House 45, Road 7, Block C',
        city: 'Dhaka',
        area: 'Dhanmondi',
        postalCode: '1209',
    };
    const existingOrderCount = await prisma.order.count({
        where: { userId: regularUser.id },
    });
    if (existingOrderCount === 0) {
        const order1 = await prisma.order.create({
            data: {
                orderId: 'SM-SEED-ORD-001',
                userId: regularUser.id,
                totalAmount: 310, // 250 subtotal + 60 delivery
                deliveryCharge: 60,
                deliveryAddress: sampleAddress,
                paymentMethod: 'COD',
                paymentStatus: 'PENDING',
                status: 'PROCESSING',
                notes: 'Please leave at front door',
                items: {
                    create: [
                        {
                            productId: 'seed-carrot-(500g)',
                            quantity: 2,
                            price: 25,
                        },
                        {
                            productId: 'seed-fresh-apples-(1kg)',
                            quantity: 2,
                            price: 100,
                        },
                    ],
                },
            },
        });
        const order2 = await prisma.order.create({
            data: {
                orderId: 'SM-SEED-ORD-002',
                userId: regularUser.id,
                totalAmount: 255, // 195 subtotal + 60 delivery
                deliveryCharge: 60,
                deliveryAddress: sampleAddress,
                paymentMethod: 'BKASH',
                paymentStatus: 'COMPLETED',
                transactionId: 'TRX9988776655',
                status: 'DELIVERED',
                deliveredAt: new Date(),
                items: {
                    create: [
                        {
                            productId: 'seed-full-cream-milk-(1l)',
                            quantity: 2,
                            price: 75,
                        },
                        {
                            productId: 'seed-organic-bananas-(1-dozen)',
                            quantity: 1,
                            price: 45,
                        },
                    ],
                },
            },
        });
        console.log('✅ Sample orders created: SM-SEED-ORD-001, SM-SEED-ORD-002');
    }
    else {
        console.log(`ℹ️ Orders already exist in database (${existingOrderCount} orders)`);
    }
    console.log('\n🎉 Seed completed successfully!');
    console.log('──────────────────────────────────────');
    console.log('📧 Admin:    admin@supermart.com / Admin@123');
    console.log('📧 Staff:    delivery@supermart.com / Staff@123');
    console.log('📧 User:     user@supermart.com / User@123');
    console.log('──────────────────────────────────────');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map