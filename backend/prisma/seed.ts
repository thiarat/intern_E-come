import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with rich mockup data...');
  
  // Clear existing data (optional, but good for resetting)
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: 'password123',
      name: 'John Doe',
      phone: '0812345678',
      role: 'CUSTOMER',
      addresses: {
        create: {
          province: 'กรุงเทพมหานคร',
          district: 'เขตปทุมวัน',
          subDistrict: 'แขวงลุมพินี',
          zipCode: '10330',
          detail: '123/45 คอนโดสุดหรู ชั้น 10 ถนนวิทยุ'
        }
      },
      cart: { create: {} }
    },
    include: { cart: true }
  });

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@nexus.com',
      password: 'adminpassword',
      name: 'Nexus Admin',
      role: 'SUPER_ADMIN',
    }
  });

  // 2. Create Categories
  const catElectronics = await prisma.category.create({ data: { name: 'Electronics' } });
  const catAudio = await prisma.category.create({ data: { name: 'Audio & Sound' } });
  const catWearables = await prisma.category.create({ data: { name: 'Wearables' } });
  const catHome = await prisma.category.create({ data: { name: 'Smart Home' } });

  // 3. Create Products with multiple images & htmlDescription
  const products = [
    {
      categoryId: catElectronics.id,
      name: 'Nexus Pro Smartphone',
      description: 'The latest Nexus smartphone with a stunning edge-to-edge OLED display and next-gen camera system.',
      htmlDescription: '<h2>Next-Gen Performance</h2><p>Experience ultra-fast speeds with our new A15 chip. Perfect for gaming, streaming, and multitasking.</p><img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&fit=crop" style="width:100%; border-radius:8px; margin: 20px 0;"/><h3>Pro Camera System</h3><p>Shoot 4K video at 60fps and capture stunning night mode photos.</p>',
      price: 34990,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=600&h=600&fit=crop'
      ]
    },
    {
      categoryId: catAudio.id,
      name: 'QuietSpace Noise-Cancelling Headphones',
      description: 'Industry-leading noise cancellation. Up to 30 hours of battery life.',
      htmlDescription: '<h2>Silence the World</h2><p>Our advanced ANC technology blocks out 99% of background noise.</p><ul><li>30-hour battery life</li><li>Fast charging: 15 mins = 3 hours playback</li><li>Multipoint Bluetooth</li></ul>',
      price: 12900,
      stock: 120,
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'
      ]
    },
    {
      categoryId: catWearables.id,
      name: 'ActiveFit Smartwatch',
      description: 'Track your health and stay connected. Water-resistant up to 50 meters.',
      htmlDescription: '<h2>Your Ultimate Fitness Partner</h2><p>Monitor your heart rate, sleep, and blood oxygen levels 24/7.</p>',
      price: 8500,
      stock: 80,
      images: [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop'
      ]
    },
    {
      categoryId: catElectronics.id,
      name: 'UltraBook Pro 14"',
      description: 'M3 chip, 16GB RAM, 512GB SSD. The ultimate machine for creators.',
      htmlDescription: '<h2>Power without Limits</h2><p>Designed for professionals who need uncompromising performance on the go.</p>',
      price: 54900,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
      ]
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  // 4. Create some Cart Items for John Doe
  const allProducts = await prisma.product.findMany();
  if (user1.cart && allProducts.length >= 2) {
    await prisma.cartItem.createMany({
      data: [
        { cartId: user1.cart.id, productId: allProducts[0].id, quantity: 1 },
        { cartId: user1.cart.id, productId: allProducts[1].id, quantity: 2 },
      ]
    });
  }

  // 5. Create some reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      productId: allProducts[0].id,
      rating: 5,
      comment: "Absolutely amazing phone! The camera is out of this world."
    }
  });

  console.log('Seeding completed! Added Users, Products (with images/html), Addresses, and Cart items.');
}

const run = async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
  await prisma.$disconnect();
};

run();
