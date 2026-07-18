import { PrismaClient, Role, StaffPosition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Create Admin User ─────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@supermart.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@supermart.com',
      phone: '+8801700000001',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
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
  const staffPasswordHash = await bcrypt.hash('Staff@123', 10);
  const staffUser = await prisma.user.upsert({
    where: { email: 'delivery@supermart.com' },
    update: {},
    create: {
      name: 'John Delivery',
      email: 'delivery@supermart.com',
      phone: '+8801700000002',
      passwordHash: staffPasswordHash,
      role: Role.STAFF,
      isVerified: true,
      staffProfile: {
        create: {
          staffId: 'STAFF-001',
          position: StaffPosition.DELIVERY_BOY,
          assignedArea: ['Dhaka North', 'Dhaka South'],
        },
      },
    },
  });
  console.log('✅ Staff user created:', staffUser.email);

  // ── Create Regular User ────────────────────────────────────
  const userPasswordHash = await bcrypt.hash('User@123', 10);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@supermart.com' },
    update: {},
    create: {
      name: 'Alice Customer',
      email: 'user@supermart.com',
      phone: '+8801700000003',
      passwordHash: userPasswordHash,
      role: Role.USER,
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