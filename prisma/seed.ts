import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Zivaro database...");

  // Clean existing data in reverse dependency order
  await prisma.rewardPoint.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Test@1234", 10);

  // ─── USERS ────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { email: "admin@zivaro.com", password, name: "Admin", role: "ADMIN", referralCode: "ZIVADMIN", totalPoints: 10000, rewardTier: "PLATINUM", streak: 30 },
  });

  const seller1User = await prisma.user.create({
    data: { email: "fashion@zivaro.com", password, name: "Priya Sharma", role: "SELLER", referralCode: "ZIVFS001", totalPoints: 3500, rewardTier: "GOLD", streak: 15 },
  });
  const seller2User = await prisma.user.create({
    data: { email: "tech@zivaro.com", password, name: "Rahul Mehta", role: "SELLER", referralCode: "ZIVTC002", totalPoints: 2200, rewardTier: "GOLD", streak: 10 },
  });
  const seller3User = await prisma.user.create({
    data: { email: "home@zivaro.com", password, name: "Anita Desai", role: "SELLER", referralCode: "ZIVHM003", totalPoints: 800, rewardTier: "SILVER", streak: 5 },
  });

  const buyers = await Promise.all([
    prisma.user.create({ data: { email: "john@example.com", password, name: "John Doe", role: "BUYER", referralCode: "ZIVJD01", totalPoints: 5200, rewardTier: "PLATINUM", streak: 22 } }),
    prisma.user.create({ data: { email: "sarah@example.com", password, name: "Sarah Wilson", role: "BUYER", referralCode: "ZIVSW02", totalPoints: 1500, rewardTier: "SILVER", streak: 8 } }),
    prisma.user.create({ data: { email: "mike@example.com", password, name: "Mike Chen", role: "BUYER", referralCode: "ZIVMC03", totalPoints: 350, rewardTier: "BRONZE", streak: 3 } }),
    prisma.user.create({ data: { email: "emma@example.com", password, name: "Emma Johnson", role: "BUYER", referralCode: "ZIVEJ04", totalPoints: 2800, rewardTier: "GOLD", streak: 12 } }),
    prisma.user.create({ data: { email: "alex@example.com", password, name: "Alex Kumar", role: "BUYER", referralCode: "ZIVAK05", totalPoints: 600, rewardTier: "SILVER", streak: 6 } }),
  ]);

  console.log("Created users");

  // ─── SELLERS ──────────────────────────────────────────────
  const seller1 = await prisma.seller.create({
    data: { userId: seller1User.id, shopName: "Fashion Hub", shopSlug: "fashion-hub", description: "Premium fashion and clothing for every occasion", isVerified: true, rating: 4.8, totalSales: 1250, totalRevenue: 85000, commissionRate: 0.08 },
  });
  const seller2 = await prisma.seller.create({
    data: { userId: seller2User.id, shopName: "TechZone", shopSlug: "techzone", description: "Latest electronics and gadgets at unbeatable prices", isVerified: true, rating: 4.6, totalSales: 890, totalRevenue: 125000, commissionRate: 0.10 },
  });
  const seller3 = await prisma.seller.create({
    data: { userId: seller3User.id, shopName: "HomeVibes", shopSlug: "homevibes", description: "Beautiful home decor and lifestyle products", isVerified: false, rating: 4.4, totalSales: 420, totalRevenue: 32000, commissionRate: 0.12 },
  });

  console.log("Created sellers");

  // ─── CATEGORIES ───────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Clothing", slug: "clothing", icon: "Shirt", description: "Fashion apparel for men and women", displayOrder: 1 } }),
    prisma.category.create({ data: { name: "Shoes", slug: "shoes", icon: "Footprints", description: "Sneakers, boots, and casual footwear", displayOrder: 2 } }),
    prisma.category.create({ data: { name: "Electronics", slug: "electronics", icon: "Smartphone", description: "Gadgets and tech accessories", displayOrder: 3 } }),
    prisma.category.create({ data: { name: "Accessories", slug: "accessories", icon: "Watch", description: "Watches, bags, wallets and more", displayOrder: 4 } }),
    prisma.category.create({ data: { name: "Sports & Fitness", slug: "sports-fitness", icon: "Dumbbell", description: "Equipment for active lifestyles", displayOrder: 5 } }),
    prisma.category.create({ data: { name: "Home & Living", slug: "home-living", icon: "Home", description: "Decor, candles, and lifestyle", displayOrder: 6 } }),
    prisma.category.create({ data: { name: "Beauty", slug: "beauty", icon: "Sparkles", description: "Skincare, fragrance, and cosmetics", displayOrder: 7 } }),
    prisma.category.create({ data: { name: "Books", slug: "books", icon: "BookOpen", description: "Bestsellers and must-reads", displayOrder: 8 } }),
  ]);

  const [clothing, shoes, electronics, accessories, sports, home, beauty, books] = categories;
  console.log("Created categories");

  // ─── PRODUCTS ─────────────────────────────────────────────
  const productsData = [
    // Clothing - Fashion Hub
    { name: "Basic Tee 6-Pack", slug: "basic-tee-6-pack", description: "The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options.", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", price: 192, comparePrice: 240, discount: 20, categoryId: clothing.id, sellerId: seller1.id, tags: ["men", "tshirt", "casual", "pack"], isFeatured: true, isOnSale: true, rating: 4.9, reviewCount: 28, salesCount: 340, sizes: [{ name: "XS", q: 10 }, { name: "S", q: 15 }, { name: "M", q: 20 }, { name: "L", q: 15 }, { name: "XL", q: 10 }] },
    { name: "Classic Hoodie", slug: "classic-hoodie", description: "Ultra-soft cotton blend hoodie with a relaxed fit. Perfect for layering or casual wear.", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3e87?w=800", price: 68, comparePrice: 85, discount: 20, categoryId: clothing.id, sellerId: seller1.id, tags: ["unisex", "hoodie", "casual"], isFeatured: false, isOnSale: true, rating: 4.7, reviewCount: 15, salesCount: 220, sizes: [{ name: "S", q: 12 }, { name: "M", q: 18 }, { name: "L", q: 14 }, { name: "XL", q: 8 }] },
    { name: "Summer Floral Dress", slug: "summer-floral-dress", description: "A light and breezy summer dress with a floral print. Perfect for beach outings.", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800", price: 80, categoryId: clothing.id, sellerId: seller1.id, tags: ["women", "dress", "summer", "floral"], isFeatured: true, isOnSale: false, rating: 4.9, reviewCount: 32, salesCount: 280, sizes: [{ name: "S", q: 10 }, { name: "M", q: 12 }, { name: "L", q: 8 }] },
    { name: "Slim Fit Jeans", slug: "slim-fit-jeans", description: "Modern slim-fit jeans crafted from premium stretch denim.", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", price: 65, categoryId: clothing.id, sellerId: seller1.id, tags: ["men", "jeans", "denim"], rating: 4.6, reviewCount: 19, salesCount: 190, sizes: [{ name: "28", q: 10 }, { name: "30", q: 15 }, { name: "32", q: 12 }, { name: "34", q: 8 }] },
    { name: "Leather Bomber Jacket", slug: "leather-bomber-jacket", description: "Premium faux leather bomber jacket with quilted lining.", imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800", price: 145, comparePrice: 195, discount: 26, categoryId: clothing.id, sellerId: seller1.id, tags: ["unisex", "jacket", "leather"], isFeatured: true, isOnSale: true, rating: 4.8, reviewCount: 24, salesCount: 160, sizes: [{ name: "S", q: 6 }, { name: "M", q: 10 }, { name: "L", q: 8 }, { name: "XL", q: 5 }] },
    { name: "Linen Button-Up Shirt", slug: "linen-button-up", description: "Breathable linen shirt perfect for warm weather.", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", price: 55, categoryId: clothing.id, sellerId: seller1.id, tags: ["men", "shirt", "linen"], rating: 4.5, reviewCount: 11, salesCount: 130, sizes: [{ name: "S", q: 8 }, { name: "M", q: 12 }, { name: "L", q: 10 }] },

    // Shoes
    { name: "Urban Sneakers", slug: "urban-sneakers", description: "Stylish sneakers for everyday wear. Cushioned sole for all-day comfort.", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", price: 95, comparePrice: 120, discount: 21, categoryId: shoes.id, sellerId: seller1.id, tags: ["sneakers", "casual", "unisex"], isFeatured: true, isOnSale: true, rating: 4.8, reviewCount: 45, salesCount: 520, sizes: [{ name: "7", q: 10 }, { name: "8", q: 15 }, { name: "9", q: 12 }, { name: "10", q: 10 }, { name: "11", q: 8 }] },
    { name: "Running Shoes Pro", slug: "running-shoes-pro", description: "Lightweight running shoes for maximum performance.", imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800", price: 140, comparePrice: 180, discount: 22, categoryId: shoes.id, sellerId: seller1.id, tags: ["running", "sports", "shoes"], isOnSale: true, rating: 4.6, reviewCount: 33, salesCount: 380, sizes: [{ name: "8", q: 20 }, { name: "9", q: 15 }, { name: "10", q: 10 }] },
    { name: "Chelsea Boots", slug: "chelsea-boots", description: "Classic leather Chelsea boots with elastic side panels.", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800", price: 130, categoryId: shoes.id, sellerId: seller1.id, tags: ["boots", "leather", "men"], rating: 4.7, reviewCount: 18, salesCount: 150, sizes: [{ name: "8", q: 8 }, { name: "9", q: 10 }, { name: "10", q: 12 }, { name: "11", q: 6 }] },
    { name: "Block Heel Sandals", slug: "block-heel-sandals", description: "Elegant block heel sandals with ankle strap.", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800", price: 75, comparePrice: 95, discount: 21, categoryId: shoes.id, sellerId: seller1.id, tags: ["heels", "women", "sandals"], isOnSale: true, rating: 4.4, reviewCount: 12, salesCount: 95, sizes: [{ name: "5", q: 6 }, { name: "6", q: 10 }, { name: "7", q: 12 }, { name: "8", q: 8 }] },

    // Electronics - TechZone
    { name: "Wireless Noise-Cancelling Headphones", slug: "wireless-headphones-pro", description: "Premium noise-cancelling headphones with 30-hour battery life.", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", price: 199, comparePrice: 299, discount: 33, categoryId: electronics.id, sellerId: seller2.id, tags: ["headphones", "wireless", "bluetooth"], isFeatured: true, isOnSale: true, rating: 4.7, reviewCount: 56, salesCount: 890, sizes: [] },
    { name: "Smart Watch Series X", slug: "smart-watch-series-x", description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery.", imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800", price: 249, comparePrice: 349, discount: 29, categoryId: electronics.id, sellerId: seller2.id, tags: ["watch", "smart", "fitness"], isFeatured: true, isOnSale: true, rating: 4.6, reviewCount: 42, salesCount: 620, sizes: [] },
    { name: "Premium Phone Case", slug: "premium-phone-case", description: "Shockproof silicone case with military-grade drop protection.", imageUrl: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800", price: 29, comparePrice: 45, discount: 36, categoryId: electronics.id, sellerId: seller2.id, tags: ["phone", "case", "protection"], isOnSale: true, rating: 4.3, reviewCount: 89, salesCount: 2100, sizes: [] },
    { name: "True Wireless Earbuds", slug: "true-wireless-earbuds", description: "Compact wireless earbuds with deep bass and ambient mode.", imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800", price: 79, comparePrice: 129, discount: 39, categoryId: electronics.id, sellerId: seller2.id, tags: ["earbuds", "wireless", "bluetooth"], isFeatured: true, isOnSale: true, rating: 4.5, reviewCount: 67, salesCount: 1450, sizes: [] },
    { name: "Portable Bluetooth Speaker", slug: "portable-speaker", description: "Waterproof speaker with 360-degree sound.", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", price: 59, categoryId: electronics.id, sellerId: seller2.id, tags: ["speaker", "bluetooth", "portable"], rating: 4.4, reviewCount: 31, salesCount: 420, sizes: [] },
    { name: "USB-C Hub Multiport", slug: "usb-c-hub", description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader.", imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", price: 45, comparePrice: 65, discount: 31, categoryId: electronics.id, sellerId: seller2.id, tags: ["usb", "hub", "laptop"], isOnSale: true, rating: 4.2, reviewCount: 24, salesCount: 580, sizes: [] },

    // Accessories
    { name: "Classic Aviator Sunglasses", slug: "aviator-sunglasses", description: "Timeless aviator sunglasses with UV400 protection.", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", price: 45, comparePrice: 65, discount: 31, categoryId: accessories.id, sellerId: seller1.id, tags: ["sunglasses", "aviator", "unisex"], isOnSale: true, rating: 4.5, reviewCount: 22, salesCount: 340, sizes: [] },
    { name: "Minimalist Leather Watch", slug: "minimalist-watch", description: "Elegant watch with genuine leather strap and sapphire crystal.", imageUrl: "https://images.unsplash.com/photo-1548036328-c11285547cc5?w=800", price: 120, categoryId: accessories.id, sellerId: seller2.id, tags: ["watch", "leather", "minimalist"], isFeatured: true, rating: 4.8, reviewCount: 38, salesCount: 210, sizes: [] },
    { name: "Slim Leather Wallet", slug: "slim-leather-wallet", description: "Genuine leather bifold wallet with RFID blocking.", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800", price: 50, comparePrice: 65, discount: 23, categoryId: accessories.id, sellerId: seller1.id, tags: ["wallet", "leather", "men"], isOnSale: true, isFeatured: true, rating: 4.7, reviewCount: 29, salesCount: 460, sizes: [] },
    { name: "Canvas Travel Backpack", slug: "canvas-backpack", description: "Durable canvas backpack with padded laptop compartment.", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38ef370c7?w=800", price: 55, categoryId: accessories.id, sellerId: seller3.id, tags: ["backpack", "travel", "canvas"], rating: 4.2, reviewCount: 14, salesCount: 180, sizes: [] },
    { name: "Insulated Water Bottle", slug: "insulated-water-bottle", description: "Double-wall insulated. Keeps cold 24hrs or hot 12hrs.", imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800", price: 28, comparePrice: 35, discount: 20, categoryId: accessories.id, sellerId: seller3.id, tags: ["bottle", "water", "insulated"], isOnSale: true, rating: 4.4, reviewCount: 47, salesCount: 890, sizes: [] },

    // Sports & Fitness
    { name: "Premium Yoga Mat", slug: "premium-yoga-mat", description: "Extra thick, non-slip yoga mat with alignment lines.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", price: 45, categoryId: sports.id, sellerId: seller3.id, tags: ["yoga", "fitness", "mat"], rating: 4.3, reviewCount: 21, salesCount: 310, sizes: [] },
    { name: "Adjustable Dumbbell Set", slug: "adjustable-dumbbells", description: "Space-saving adjustable dumbbells from 5-50 lbs.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800", price: 299, comparePrice: 399, discount: 25, categoryId: sports.id, sellerId: seller3.id, tags: ["dumbbells", "weights", "gym"], isFeatured: true, isOnSale: true, rating: 4.8, reviewCount: 35, salesCount: 180, sizes: [] },
    { name: "Resistance Band Set", slug: "resistance-bands", description: "Set of 5 resistance bands with different tension levels.", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", price: 35, categoryId: sports.id, sellerId: seller3.id, tags: ["resistance", "bands", "exercise"], rating: 4.5, reviewCount: 28, salesCount: 450, sizes: [] },
    { name: "Running Arm Band", slug: "running-armband", description: "Sweat-proof phone armband for running.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", price: 18, categoryId: sports.id, sellerId: seller2.id, tags: ["running", "armband", "phone"], rating: 4.1, reviewCount: 15, salesCount: 620, sizes: [] },

    // Home & Living
    { name: "Soy Wax Scented Candle", slug: "soy-candle", description: "Hand-poured soy wax candle with essential oils. 50+ hour burn.", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c1ea9506?w=800", price: 24, categoryId: home.id, sellerId: seller3.id, tags: ["candle", "scented", "soy"], rating: 4.6, reviewCount: 43, salesCount: 720, sizes: [] },
    { name: "Velvet Throw Cushion", slug: "velvet-cushion", description: "Luxurious velvet cushion cover with hidden zipper.", imageUrl: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800", price: 32, categoryId: home.id, sellerId: seller3.id, tags: ["cushion", "velvet", "decor"], rating: 4.3, reviewCount: 16, salesCount: 340, sizes: [] },
    { name: "Ceramic Coffee Mug Set", slug: "ceramic-mug-set", description: "Set of 4 handcrafted ceramic mugs with geometric patterns.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", price: 38, categoryId: home.id, sellerId: seller3.id, tags: ["mug", "ceramic", "kitchen"], isFeatured: true, rating: 4.7, reviewCount: 27, salesCount: 510, sizes: [] },
    { name: "Bamboo Desk Organizer", slug: "bamboo-organizer", description: "Natural bamboo desk organizer with phone stand and pen holder.", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c1ea9506?w=800&q=80", price: 42, categoryId: home.id, sellerId: seller3.id, tags: ["desk", "organizer", "bamboo"], rating: 4.4, reviewCount: 12, salesCount: 190, sizes: [] },

    // Beauty
    { name: "Vitamin C Serum", slug: "vitamin-c-serum", description: "20% Vitamin C serum with hyaluronic acid. Brightens skin.", imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800", price: 34, categoryId: beauty.id, sellerId: seller3.id, tags: ["skincare", "serum", "vitamin-c"], isFeatured: true, rating: 4.8, reviewCount: 62, salesCount: 1200, sizes: [] },
    { name: "Eau de Parfum - Midnight", slug: "midnight-parfum", description: "Sophisticated fragrance with bergamot, jasmine, and sandalwood.", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800", price: 85, comparePrice: 120, discount: 29, categoryId: beauty.id, sellerId: seller3.id, tags: ["perfume", "fragrance", "luxury"], isOnSale: true, rating: 4.6, reviewCount: 24, salesCount: 320, sizes: [] },
    { name: "Matte Lipstick Collection", slug: "matte-lipstick-set", description: "Set of 6 long-lasting matte lipsticks. Vegan and cruelty-free.", imageUrl: "https://images.unsplash.com/photo-1631730486784-80f81e4cec59?w=800", price: 42, categoryId: beauty.id, sellerId: seller3.id, tags: ["lipstick", "matte", "cosmetics"], rating: 4.5, reviewCount: 38, salesCount: 680, sizes: [] },

    // Books
    { name: "The Art of Focus", slug: "art-of-focus", description: "A practical guide to mastering focus in the digital age.", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800", price: 18, categoryId: books.id, sellerId: seller2.id, tags: ["book", "productivity", "self-help"], isFeatured: true, rating: 4.7, reviewCount: 89, salesCount: 2400, sizes: [] },
    { name: "Coding Mastery", slug: "coding-mastery", description: "From beginner to expert — a guide to modern programming.", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800", price: 32, categoryId: books.id, sellerId: seller2.id, tags: ["book", "coding", "programming"], rating: 4.9, reviewCount: 45, salesCount: 1800, sizes: [] },
    { name: "Mindful Living", slug: "mindful-living", description: "Discover mindfulness and transform your daily life.", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80", price: 15, categoryId: books.id, sellerId: seller2.id, tags: ["book", "mindfulness", "wellness"], rating: 4.4, reviewCount: 31, salesCount: 950, sizes: [] },
  ];

  const products = [];
  for (const p of productsData) {
    const { sizes, ...data } = p;
    const product = await prisma.product.create({
      data: {
        ...data,
        images: [data.imageUrl],
        sizes: sizes.length > 0
          ? { create: sizes.map((s) => ({ name: s.name, availableQuantity: s.q, inStock: s.q > 0 })) }
          : undefined,
      },
    });
    products.push(product);
  }
  console.log(`Created ${products.length} products`);

  // ─── REVIEWS ──────────────────────────────────────────────
  const reviewTexts = [
    { title: "Absolutely love it!", comment: "Exceeded my expectations. Great quality and fast shipping." },
    { title: "Great value", comment: "Perfect for the price. Would definitely buy again." },
    { title: "Solid purchase", comment: "Good quality, matches the description well." },
    { title: "Impressive quality", comment: "Better than expected. Highly recommend." },
    { title: "Worth every penny", comment: "Amazing product. My friends are jealous!" },
  ];

  let reviewCount = 0;
  for (let i = 0; i < 25; i++) {
    const buyer = buyers[i % buyers.length];
    const product = products[i % products.length];
    const review = reviewTexts[i % reviewTexts.length];
    try {
      await prisma.review.create({
        data: { userId: buyer.id, productId: product.id, rating: 4 + Math.round(Math.random()), title: review.title, comment: review.comment, isVerified: true },
      });
      reviewCount++;
    } catch (e) { /* skip duplicate user-product */ }
  }
  console.log(`Created ${reviewCount} reviews`);

  // ─── COUPONS ──────────────────────────────────────────────
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);

  await Promise.all([
    prisma.coupon.create({ data: { code: "WELCOME10", discountPercent: 10, minOrderAmount: 20, maxDiscount: 50, maxUses: 1000, isActive: true, expiresAt: futureDate } }),
    prisma.coupon.create({ data: { code: "ZIVARO20", discountPercent: 20, minOrderAmount: 50, maxDiscount: 100, maxUses: 500, isActive: true, expiresAt: futureDate } }),
    prisma.coupon.create({ data: { code: "FLASH30", discountPercent: 30, minOrderAmount: 100, maxDiscount: 150, maxUses: 200, isActive: true, expiresAt: futureDate } }),
    prisma.coupon.create({ data: { code: "SUMMER15", discountPercent: 15, minOrderAmount: 30, maxDiscount: 75, maxUses: 800, isActive: true, expiresAt: futureDate } }),
    prisma.coupon.create({ data: { code: "NEWUSER25", discountPercent: 25, minOrderAmount: 40, maxDiscount: 100, maxUses: 300, isActive: true, expiresAt: futureDate } }),
  ]);
  console.log("Created coupons");

  // ─── ADVERTISEMENTS ───────────────────────────────────────
  const now = new Date();
  const monthFromNow = new Date();
  monthFromNow.setMonth(monthFromNow.getMonth() + 1);

  await Promise.all([
    prisma.advertisement.create({ data: { sellerId: seller1.id, productId: products[0].id, title: "Best Tees of the Season", placement: "HOMEPAGE_FEATURED", status: "ACTIVE", dailyBudget: 10, totalBudget: 300, bidPerClick: 0.5, impressions: 4500, clicks: 230, conversions: 45, startsAt: now, endsAt: monthFromNow } }),
    prisma.advertisement.create({ data: { sellerId: seller2.id, productId: products[10].id, title: "Premium Sound Experience", placement: "HOMEPAGE_FEATURED", status: "ACTIVE", dailyBudget: 15, totalBudget: 450, bidPerClick: 0.75, impressions: 6200, clicks: 410, conversions: 82, startsAt: now, endsAt: monthFromNow } }),
    prisma.advertisement.create({ data: { sellerId: seller2.id, productId: products[11].id, title: "Smart Watch Sale", placement: "CATEGORY_TOP", status: "ACTIVE", dailyBudget: 8, totalBudget: 240, bidPerClick: 0.6, impressions: 3100, clicks: 180, conversions: 28, startsAt: now, endsAt: monthFromNow } }),
    prisma.advertisement.create({ data: { sellerId: seller1.id, productId: products[6].id, title: "Step Up Your Style", placement: "SEARCH_RESULTS", status: "ACTIVE", dailyBudget: 5, totalBudget: 150, bidPerClick: 0.4, impressions: 2800, clicks: 145, conversions: 22, startsAt: now, endsAt: monthFromNow } }),
    prisma.advertisement.create({ data: { sellerId: seller3.id, productId: products[29].id, title: "Glow Up with Vitamin C", placement: "BANNER", status: "PAUSED", dailyBudget: 7, totalBudget: 210, bidPerClick: 0.55, impressions: 1500, clicks: 78, conversions: 12, startsAt: now, endsAt: monthFromNow } }),
  ]);

  await prisma.product.updateMany({
    where: { id: { in: [products[0].id, products[10].id, products[11].id, products[6].id] } },
    data: { isPromoted: true },
  });
  console.log("Created ads");

  // ─── ORDERS ───────────────────────────────────────────────
  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;
  for (let i = 0; i < 8; i++) {
    const buyer = buyers[i % buyers.length];
    const product = products[(i * 3) % products.length];
    const status = statuses[i % statuses.length];
    const qty = 1 + Math.floor(Math.random() * 3);
    const total = product.price * qty;
    const sellerName = product.sellerId === seller1.id ? "Fashion Hub" : product.sellerId === seller2.id ? "TechZone" : "HomeVibes";

    await prisma.order.create({
      data: {
        orderNumber: `ZIV-${String(1000 + i).padStart(6, "0")}`,
        userId: buyer.id,
        shippingAddress: "123 Main St, Mumbai, MH 400001",
        mobileNumber: "+919876543210",
        email: buyer.email,
        paymentMethod: i % 2 === 0 ? "card" : "upi",
        totalPrice: total,
        status,
        orderItems: {
          create: [{ productId: product.id, productName: product.name, productImageLink: product.imageUrl, selectedSize: "M", totalPrice: total, quantity: qty, sellerName, selectedProductSize: "M", unitPrice: product.price }],
        },
      },
    });
  }
  console.log("Created orders");

  // ─── WISHLIST, ADDRESSES, NOTIFICATIONS, REWARDS ──────────
  for (let i = 0; i < 10; i++) {
    try {
      await prisma.wishlistItem.create({ data: { userId: buyers[i % buyers.length].id, productId: products[(i * 4) % products.length].id } });
    } catch (e) { /* skip duplicates */ }
  }

  for (const buyer of buyers) {
    await prisma.address.create({ data: { userId: buyer.id, label: "Home", street: "123 Main Street", city: "Mumbai", state: "Maharashtra", zipCode: "400001", country: "IN", isDefault: true } });
  }

  for (const buyer of buyers.slice(0, 3)) {
    await prisma.notification.createMany({
      data: [
        { userId: buyer.id, type: "PROMOTION", title: "Welcome to Zivaro!", message: "Use code WELCOME10 for 10% off your first order", link: "/" },
        { userId: buyer.id, type: "REWARD", title: "Daily Reward Available", message: "Check in today to earn bonus points!", link: "/rewards" },
        { userId: buyer.id, type: "SYSTEM", title: "New Features!", message: "Spin the wheel, earn rewards, and explore our marketplace", isRead: true },
      ],
    });
  }

  for (const buyer of buyers) {
    await prisma.rewardPoint.createMany({
      data: [
        { userId: buyer.id, points: 100, reason: "signup", description: "Welcome bonus for joining Zivaro" },
        { userId: buyer.id, points: 50, reason: "review", description: "Points for writing a product review" },
        { userId: buyer.id, points: 10, reason: "check_in", description: "Daily check-in reward" },
      ],
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
