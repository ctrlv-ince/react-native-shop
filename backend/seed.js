const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { Category } = require('./models/category');
const { Product } = require('./models/product');
const { User } = require('./models/user');
const { Order } = require('./models/order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop_app';

const categories = [
    { name: 'Keyboards', icon: 'keypad', color: '#4F46E5' },
    { name: 'Mice', icon: 'ellipse', color: '#06B6D4' },
    { name: 'Monitors', icon: 'desktop', color: '#10B981' },
    { name: 'Headsets', icon: 'headset', color: '#F59E0B' },
    { name: 'Controllers', icon: 'game-controller', color: '#EF4444' },
    { name: 'Accessories', icon: 'extension-puzzle', color: '#8B5CF6' },
];

// Products will reference category IDs after insertion
const productsData = [
    // Keyboards
    { name: 'Razer Huntsman V3 Pro', description: 'Premium analog optical gaming keyboard with adjustable actuation and rapid trigger.', price: 12999, stock: 25, catIndex: 0 },
    { name: 'Logitech G Pro X TKL', description: 'Tenkeyless mechanical gaming keyboard with hot-swappable switches and LIGHTSPEED wireless.', price: 8495, stock: 40, catIndex: 0 },
    // Mice
    { name: 'Logitech G Pro X Superlight 2', description: 'Ultra-lightweight wireless gaming mouse at 60g with HERO 2 sensor, 44K DPI.', price: 7995, stock: 35, catIndex: 1 },
    { name: 'Razer DeathAdder V3', description: 'Ergonomic esports mouse with Focus Pro 30K optical sensor and 90-hour battery life.', price: 5490, stock: 50, catIndex: 1 },
    // Monitors
    { name: 'ASUS ROG Swift PG27AQN', description: '27-inch 1440p 360Hz gaming monitor with IPS panel, NVIDIA G-Sync, and HDR600.', price: 49990, stock: 8, catIndex: 2 },
    { name: 'Samsung Odyssey G7 32"', description: '32-inch curved 1440p 240Hz QLED gaming monitor with 1ms response time.', price: 24990, stock: 12, catIndex: 2 },
    // Headsets
    { name: 'SteelSeries Arctis Nova Pro', description: 'Premium wireless gaming headset with active noise cancellation and dual-battery system.', price: 18990, stock: 15, catIndex: 3 },
    { name: 'HyperX Cloud III Wireless', description: 'Wireless gaming headset with DTS Headphone:X spatial audio and 120-hour battery.', price: 7999, stock: 30, catIndex: 3 },
    // Controllers
    { name: 'Sony DualSense Edge', description: 'Professional PS5 wireless controller with customizable buttons, back paddles, and adjustable triggers.', price: 10990, stock: 20, catIndex: 4 },
    { name: 'Xbox Elite Controller Series 2', description: 'Premium wireless controller with adjustable tension thumbsticks and wrap-around rubberized grip.', price: 9990, stock: 18, catIndex: 4 },
    // Accessories
    { name: 'Razer Firefly V2 Pro', description: 'Full-surface LED backlit hard gaming mouse mat with Chroma RGB and wireless charging.', price: 5490, stock: 45, catIndex: 5 },
    { name: 'Elgato Stream Deck MK.2', description: '15 customizable LCD keys for live content creation, streaming, and productivity.', price: 8490, stock: 22, catIndex: 5 },
    { name: 'NZXT Puck Headset Mount', description: 'Magnetic headset mount with cable management for PC cases and monitors.', price: 1290, stock: 60, catIndex: 5 },
];

const orderDates = [
    new Date('2025-10-05'),
    new Date('2025-10-18'),
    new Date('2025-11-02'),
    new Date('2025-11-20'),
    new Date('2025-12-01'),
    new Date('2025-12-15'),
    new Date('2026-01-08'),
    new Date('2026-01-22'),
    new Date('2026-02-10'),
    new Date('2026-02-25'),
    new Date('2026-03-05'),
    new Date('2026-03-18'),
];

const statuses = ['Pending', 'Shipped', 'Delivered', 'Pending', 'Delivered', 'Shipped', 'Pending', 'Delivered', 'Shipped', 'Delivered', 'Pending', 'Shipped'];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing categories, products, and orders');

        // 1. Seed Categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`Seeded ${createdCategories.length} categories`);

        // 2. Seed Products
        const productDocs = productsData.map(p => ({
            name: p.name,
            description: p.description,
            images: [],
            price: p.price,
            category: createdCategories[p.catIndex]._id,
            stock: p.stock,
        }));
        const createdProducts = await Product.insertMany(productDocs);
        console.log(`Seeded ${createdProducts.length} products`);

        // 3. Get or create admin user
        let adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            adminUser = new User({
                name: 'Admin User',
                email: 'admin@shop.com',
                passwordHash: bcrypt.hashSync('admin123', 10),
                phone: '09171234567',
                isAdmin: true,
                address: 'BGC, Taguig City, Metro Manila',
            });
            adminUser = await adminUser.save();
            console.log('Created admin user: admin@shop.com / admin123');
        } else {
            console.log(`Using existing admin: ${adminUser.email}`);
        }

        // Also get or create a regular test user
        let testUser = await User.findOne({ isAdmin: false });
        if (!testUser) {
            testUser = new User({
                name: 'Juan Dela Cruz',
                email: 'juan@test.com',
                passwordHash: bcrypt.hashSync('test1234', 10),
                phone: '09181234567',
                isAdmin: false,
                address: 'Makati City, Metro Manila',
            });
            testUser = await testUser.save();
            console.log('Created test user: juan@test.com / test1234');
        } else {
            console.log(`Using existing user: ${testUser.email}`);
        }

        // 4. Seed Orders across different months
        const orders = orderDates.map((date, i) => {
            // Pick 1-3 random products per order
            const numItems = Math.floor(Math.random() * 3) + 1;
            const shuffled = [...createdProducts].sort(() => 0.5 - Math.random());
            const items = shuffled.slice(0, numItems).map(p => ({
                product: p._id,
                quantity: Math.floor(Math.random() * 3) + 1,
                price: p.price,
            }));

            return {
                orderItems: items,
                status: statuses[i],
                user: i % 2 === 0 ? testUser._id : adminUser._id,
                dateOrdered: date,
            };
        });

        await Order.insertMany(orders);
        console.log(`Seeded ${orders.length} orders across Oct 2025 - Mar 2026`);

        console.log('\n✅ Database seeding complete!');
        console.log('Admin login: admin@shop.com / admin123');
        console.log('User login:  juan@test.com / test1234');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
