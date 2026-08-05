import { PrismaClient, Role, StaffPosition } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with 50 products...');

  // ── 1. Ensure Admin User Exists ──────────────────────────────
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
  console.log('✅ Admin user ready:', adminUser.email);

  // ── 2. Ensure Staff User Exists ──────────────────────────────
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
  console.log('✅ Staff user ready:', staffUser.email);

  // ── 3. Ensure Regular User Exists ────────────────────────────
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
  console.log('✅ Regular user ready:', regularUser.email);

  // ── 4. 50 Detailed Products List ─────────────────────────────
  const productsData = [
    // Fruits (10)
    {
      name: 'Fresh Organic Red Apples (1kg)',
      description: 'Crisp, sweet, and juicy farm-fresh organic red apples.',
      price: 280,
      discountPrice: 250,
      category: 'Fruits',
      brand: 'GreenValley Organic',
      stock: 45,
      rating: 4.8,
      ratingCount: 34,
      images: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Premium Cavendish Bananas (1 Dozen)',
      description: 'Naturally ripened, rich in potassium and nutrients.',
      price: 120,
      discountPrice: 100,
      category: 'Fruits',
      brand: 'FarmFresh',
      stock: 80,
      rating: 4.6,
      ratingCount: 28,
      images: [
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Valencia Oranges (1kg)',
      description: 'Juicy citrus oranges rich in Vitamin C, perfect for fresh juice.',
      price: 220,
      discountPrice: 195,
      category: 'Fruits',
      brand: 'Citrus Select',
      stock: 60,
      rating: 4.7,
      ratingCount: 19,
      images: [
        'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Sweet Alphonso Mangoes (1kg)',
      description: 'King of mangoes with rich aromatic sweetness and golden pulp.',
      price: 450,
      discountPrice: 399,
      category: 'Fruits',
      brand: 'Mango Kingdom',
      stock: 35,
      rating: 4.9,
      ratingCount: 52,
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Red Strawberries (250g)',
      description: 'Plump, hand-picked sweet red strawberries.',
      price: 320,
      discountPrice: 285,
      category: 'Fruits',
      brand: 'Berry Good',
      stock: 25,
      rating: 4.5,
      ratingCount: 15,
      images: [
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Seedless Watermelon (3-4kg)',
      description: 'Refreshing and ultra-hydrating sweet red watermelon.',
      price: 180,
      discountPrice: 160,
      category: 'Fruits',
      brand: 'FarmFresh',
      stock: 30,
      rating: 4.4,
      ratingCount: 22,
      images: [
        'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Green Seedless Grapes (500g)',
      description: 'Crisp green grapes packed with natural antioxidants.',
      price: 240,
      discountPrice: 210,
      category: 'Fruits',
      brand: 'SunGrown',
      stock: 50,
      rating: 4.6,
      ratingCount: 18,
      images: [
        'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Sweet Tropical Pineapple (1 pc)',
      description: 'Golden ripe tropical pineapple with sweet tangy flavor.',
      price: 130,
      discountPrice: 115,
      category: 'Fruits',
      brand: 'Tropical Taste',
      stock: 40,
      rating: 4.5,
      ratingCount: 14,
      images: [
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Thai Guava (1kg)',
      description: 'Crunchy white-fleshed guava rich in dietary fiber.',
      price: 140,
      discountPrice: 120,
      category: 'Fruits',
      brand: 'GreenValley',
      stock: 55,
      rating: 4.3,
      ratingCount: 11,
      images: [
        'https://images.unsplash.com/photo-1536511135885-3e28405d4b8e?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Ruby Red Pomegranate (1kg)',
      description: 'Juicy ruby seeds loaded with antioxidants.',
      price: 380,
      discountPrice: 340,
      category: 'Fruits',
      brand: 'Ruby Select',
      stock: 20,
      rating: 4.7,
      ratingCount: 29,
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Vegetables (10)
    {
      name: 'Organic Red Tomatoes (1kg)',
      description: 'Firm, vine-ripened organic tomatoes for cooking and salads.',
      price: 90,
      discountPrice: 75,
      category: 'Vegetables',
      brand: 'Local Harvest',
      stock: 120,
      rating: 4.5,
      ratingCount: 41,
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Baby Potatoes (1kg)',
      description: 'Tender baby potatoes perfect for roasting and curries.',
      price: 65,
      discountPrice: 55,
      category: 'Vegetables',
      brand: 'Local Harvest',
      stock: 150,
      rating: 4.4,
      ratingCount: 30,
      images: [
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Red Onions (1kg)',
      description: 'Pungent and crisp red onions, essential kitchen staple.',
      price: 110,
      discountPrice: 95,
      category: 'Vegetables',
      brand: 'Farm Fresh',
      stock: 200,
      rating: 4.6,
      ratingCount: 65,
      images: [
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Farm Fresh Orange Carrots (500g)',
      description: 'Sweet and crunchy orange carrots rich in Beta-Carotene.',
      price: 50,
      discountPrice: 40,
      category: 'Vegetables',
      brand: 'Green Harvest',
      stock: 90,
      rating: 4.7,
      ratingCount: 23,
      images: [
        'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Green Broccoli (1 pc)',
      description: 'Nutrient-dense green broccoli crown.',
      price: 120,
      discountPrice: 99,
      category: 'Vegetables',
      brand: 'Organic Greens',
      stock: 40,
      rating: 4.8,
      ratingCount: 17,
      images: [
        'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Organic Baby Spinach (300g)',
      description: 'Pre-washed fresh baby spinach leaves rich in iron.',
      price: 70,
      discountPrice: 60,
      category: 'Vegetables',
      brand: 'Organic Greens',
      stock: 60,
      rating: 4.6,
      ratingCount: 25,
      images: [
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Green Bell Capsicum (500g)',
      description: 'Crisp green capsicum bell peppers for stir fries.',
      price: 85,
      discountPrice: 70,
      category: 'Vegetables',
      brand: 'Local Harvest',
      stock: 75,
      rating: 4.5,
      ratingCount: 19,
      images: [
        'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Salad Cucumbers (1kg)',
      description: 'Cool and hydrating fresh salad cucumbers.',
      price: 60,
      discountPrice: 50,
      category: 'Vegetables',
      brand: 'Green Farm',
      stock: 110,
      rating: 4.4,
      ratingCount: 21,
      images: [
        'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Cauliflower (1 pc)',
      description: 'Clean white cauliflower head grown organically.',
      price: 80,
      discountPrice: 65,
      category: 'Vegetables',
      brand: 'Local Harvest',
      stock: 50,
      rating: 4.3,
      ratingCount: 16,
      images: [
        'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Spicy Green Chili (250g)',
      description: 'Fresh hot green chilis to add spice to your dishes.',
      price: 40,
      discountPrice: 30,
      category: 'Vegetables',
      brand: 'Local Spice',
      stock: 100,
      rating: 4.7,
      ratingCount: 31,
      images: [
        'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Dairy & Eggs (7)
    {
      name: 'Aarong Pasteurised Full Cream Milk (1L)',
      description: 'Rich, wholesome 100% pure pasteurised cow milk.',
      price: 90,
      discountPrice: 85,
      category: 'Dairy & Eggs',
      brand: 'Aarong Dairy',
      stock: 150,
      rating: 4.9,
      ratingCount: 88,
      images: [
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Organic Farm Brown Eggs (12 pcs)',
      description: '100% organic brown eggs from free-range healthy hens.',
      price: 160,
      discountPrice: 150,
      category: 'Dairy & Eggs',
      brand: 'FarmFresh',
      stock: 100,
      rating: 4.8,
      ratingCount: 72,
      images: [
        'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Premium Salted Butter (200g)',
      description: 'Creamy salted butter made from fresh cow milk cream.',
      price: 240,
      discountPrice: 220,
      category: 'Dairy & Eggs',
      brand: 'Amul',
      stock: 65,
      rating: 4.7,
      ratingCount: 45,
      images: [
        'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Soft Paneer Cottage Cheese (250g)',
      description: 'Hygiene packed soft paneer ideal for curry and grilling.',
      price: 180,
      discountPrice: 160,
      category: 'Dairy & Eggs',
      brand: 'Aarong Dairy',
      stock: 40,
      rating: 4.6,
      ratingCount: 29,
      images: [
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Plain Thick Greek Yogurt (500g)',
      description: 'High-protein strained plain Greek yogurt with zero added sugar.',
      price: 260,
      discountPrice: 230,
      category: 'Dairy & Eggs',
      brand: 'Nestle',
      stock: 45,
      rating: 4.8,
      ratingCount: 38,
      images: [
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Natural Cheddar Cheese Block (200g)',
      description: 'Aged sharp cheddar cheese block for slicing and melting.',
      price: 350,
      discountPrice: 310,
      category: 'Dairy & Eggs',
      brand: 'Kraft',
      stock: 30,
      rating: 4.5,
      ratingCount: 16,
      images: [
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Pure Desi Cow Ghee (500ml)',
      description: 'Traditional clarified butter with rich aroma and granulate texture.',
      price: 650,
      discountPrice: 590,
      category: 'Dairy & Eggs',
      brand: 'Pran Dairy',
      stock: 50,
      rating: 4.9,
      ratingCount: 60,
      images: [
        'https://images.unsplash.com/photo-1627886029321-72944b0255b9?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Beverages (6)
    {
      name: 'Cold Pressed Orange Juice (1L)',
      description: '100% pure cold pressed orange juice without added sugar.',
      price: 290,
      discountPrice: 260,
      category: 'Beverages',
      brand: 'Tropicana',
      stock: 70,
      rating: 4.7,
      ratingCount: 42,
      images: [
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Organic Green Tea (50 Tea Bags)',
      description: 'Calming antioxidants green tea for daily wellness.',
      price: 220,
      discountPrice: 195,
      category: 'Beverages',
      brand: 'Ispahani',
      stock: 90,
      rating: 4.6,
      ratingCount: 37,
      images: [
        'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Dark Roast Arabica Coffee Beans (250g)',
      description: 'Whole bean dark roast coffee with bold chocolate notes.',
      price: 480,
      discountPrice: 420,
      category: 'Beverages',
      brand: 'North End Coffee',
      stock: 40,
      rating: 4.9,
      ratingCount: 55,
      images: [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Natural Sparkling Mineral Water (750ml)',
      description: 'Crisp effervescent mineral water from natural springs.',
      price: 150,
      discountPrice: 130,
      category: 'Beverages',
      brand: 'San Pellegrino',
      stock: 60,
      rating: 4.4,
      ratingCount: 18,
      images: [
        'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Pure Tender Coconut Water (500ml)',
      description: 'Naturally refreshing electrolyte packed coconut water.',
      price: 110,
      discountPrice: 95,
      category: 'Beverages',
      brand: 'Coco Fresh',
      stock: 80,
      rating: 4.5,
      ratingCount: 24,
      images: [
        'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Premium Mango Fruit Drink (1L)',
      description: 'Delicious real mango pulp fruit beverage.',
      price: 140,
      discountPrice: 120,
      category: 'Beverages',
      brand: 'Pran Frooto',
      stock: 100,
      rating: 4.3,
      ratingCount: 31,
      images: [
        'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Pantry & Staples (8)
    {
      name: 'Premium Long Grain Basmati Rice (5kg)',
      description: 'Aromatic extra long grain premium basmati rice.',
      price: 950,
      discountPrice: 880,
      category: 'Pantry & Staples',
      brand: 'Fortune',
      stock: 60,
      rating: 4.9,
      ratingCount: 110,
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Whole Wheat Atta Flour (5kg)',
      description: '100% whole wheat flour for soft and fluffy chapattis.',
      price: 320,
      discountPrice: 290,
      category: 'Pantry & Staples',
      brand: 'ACI Nutrilife',
      stock: 80,
      rating: 4.8,
      ratingCount: 94,
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Cold Pressed Extra Virgin Olive Oil (1L)',
      description: 'First cold pressed Spanish olive oil for cooking and salads.',
      price: 1250,
      discountPrice: 1100,
      category: 'Pantry & Staples',
      brand: 'Borges',
      stock: 35,
      rating: 4.9,
      ratingCount: 47,
      images: [
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Unpolished Red Masoor Dal (1kg)',
      description: 'High protein unpolished red lentils.',
      price: 140,
      discountPrice: 125,
      category: 'Pantry & Staples',
      brand: 'Pran Essentials',
      stock: 120,
      rating: 4.6,
      ratingCount: 50,
      images: [
        'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Refined Sunflower Cooking Oil (2L)',
      description: 'Light and healthy refined sunflower oil rich in Vitamin E.',
      price: 360,
      discountPrice: 330,
      category: 'Pantry & Staples',
      brand: 'Rupchanda',
      stock: 90,
      rating: 4.7,
      ratingCount: 68,
      images: [
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Organic Raw Unfiltered Honey (500g)',
      description: 'Pure wildflower raw honey straight from bee farms.',
      price: 480,
      discountPrice: 420,
      category: 'Pantry & Staples',
      brand: 'Dabur',
      stock: 50,
      rating: 4.8,
      ratingCount: 39,
      images: [
        'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Pure Pink Himalayan Rock Salt (1kg)',
      description: 'Unrefined natural pink salt containing 84 trace minerals.',
      price: 180,
      discountPrice: 155,
      category: 'Pantry & Staples',
      brand: 'Chef Select',
      stock: 75,
      rating: 4.7,
      ratingCount: 26,
      images: [
        'https://images.unsplash.com/photo-1518110165381-8e010899388c?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Organic Unrefined Brown Sugar (1kg)',
      description: 'Natural brown sugar made from organic sugarcane juice.',
      price: 160,
      discountPrice: 140,
      category: 'Pantry & Staples',
      brand: 'Organic India',
      stock: 85,
      rating: 4.5,
      ratingCount: 22,
      images: [
        'https://images.unsplash.com/photo-1622484212850-cab596a60395?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Bakery & Snacks (5)
    {
      name: 'Fresh Artisan Sourdough Bread (400g)',
      description: 'Slow-fermented sourdough bread with crusty bite and soft crumb.',
      price: 180,
      discountPrice: 160,
      category: 'Bakery & Snacks',
      brand: 'Bakers Delight',
      stock: 25,
      rating: 4.8,
      ratingCount: 40,
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Double Chocolate Chip Cookies (200g)',
      description: 'Crispy butter cookies packed with Belgian dark chocolate chips.',
      price: 210,
      discountPrice: 185,
      category: 'Bakery & Snacks',
      brand: 'Olympic',
      stock: 60,
      rating: 4.7,
      ratingCount: 52,
      images: [
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Whole Grain Rolled Oats (1kg)',
      description: '100% natural whole grain oats for a heart-healthy breakfast.',
      price: 340,
      discountPrice: 299,
      category: 'Bakery & Snacks',
      brand: 'Quaker',
      stock: 70,
      rating: 4.8,
      ratingCount: 63,
      images: [
        'https://images.unsplash.com/photo-1517093157656-b9ecdf173b31?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Raw California Almonds (250g)',
      description: 'Premium crunch California almonds, rich in Vitamin E.',
      price: 390,
      discountPrice: 350,
      category: 'Bakery & Snacks',
      brand: 'Nutty Choice',
      stock: 55,
      rating: 4.9,
      ratingCount: 48,
      images: [
        'https://images.unsplash.com/photo-1508061252966-17387f8b552d?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: '70% Dark Chocolate Bar (100g)',
      description: 'Smooth single-origin dark cocoa chocolate.',
      price: 250,
      discountPrice: 220,
      category: 'Bakery & Snacks',
      brand: 'Lindt',
      stock: 45,
      rating: 4.9,
      ratingCount: 70,
      images: [
        'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Meat & Seafood (4)
    {
      name: 'Fresh Boneless Chicken Breast (1kg)',
      description: 'Skinless tender chicken breast cuts, antibiotic-free.',
      price: 380,
      discountPrice: 340,
      category: 'Meat & Seafood',
      brand: 'Kazi Farms',
      stock: 50,
      rating: 4.8,
      ratingCount: 82,
      images: [
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Atlantic Salmon Fillet (500g)',
      description: 'Sustainably farmed salmon fillet rich in Omega-3.',
      price: 1450,
      discountPrice: 1290,
      category: 'Meat & Seafood',
      brand: 'Ocean Fresh',
      stock: 20,
      rating: 4.9,
      ratingCount: 36,
      images: [
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Cleaned Jumbo Tiger Prawns (500g)',
      description: 'De-veined and cleaned fresh tiger prawns.',
      price: 850,
      discountPrice: 760,
      category: 'Meat & Seafood',
      brand: 'Bay Catch',
      stock: 25,
      rating: 4.7,
      ratingCount: 28,
      images: [
        'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Fresh Mutton Curry Cut (1kg)',
      description: 'Tender goat meat curry cut pieces.',
      price: 1100,
      discountPrice: 990,
      category: 'Meat & Seafood',
      brand: 'Bengal Meats',
      stock: 15,
      rating: 4.6,
      ratingCount: 44,
      images: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      ],
    },

    // Personal Care & Household (0) -> Let's add 0 to round to exactly 50 products! Let's check count:
    // Fruits: 10
    // Vegetables: 10
    // Dairy & Eggs: 7
    // Beverages: 6
    // Pantry & Staples: 8
    // Bakery & Snacks: 5
    // Meat & Seafood: 4
    // Total = 10 + 10 + 7 + 6 + 8 + 5 + 4 = 50 products!
  ];

  console.log(`📦 Inserting/Upserting ${productsData.length} products into table...`);

  let count = 0;
  for (const item of productsData) {
    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: item.description,
          price: item.price,
          discountPrice: item.discountPrice,
          category: item.category,
          brand: item.brand,
          stock: item.stock,
          rating: item.rating,
          ratingCount: item.ratingCount,
          images: item.images,
          isActive: true,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          id: crypto.randomUUID(),
          name: item.name,
          description: item.description,
          price: item.price,
          discountPrice: item.discountPrice,
          category: item.category,
          brand: item.brand,
          stock: item.stock,
          rating: item.rating,
          ratingCount: item.ratingCount,
          images: item.images,
          isActive: true,
          createdBy: adminUser.id,
        },
      });
    }
    count++;
  }

  console.log(`✅ ${count} products seeded successfully with full data and images!`);
  console.log('\n🎉 Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });