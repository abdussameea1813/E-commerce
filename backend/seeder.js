// backend/data/seedProducts.js (or backend/seeder.js)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import Product from './models/product.model.js'; // Adjust the path as necessary
import { connectDB } from './lib/db.js'; // Adjust the path as necessary

dotenv.config();

connectDB();

const products = [
  {
    name: "Argentina T-shirt",
    // This is your existing Cloudinary URL, which is good.
    image: "http://res.cloudinary.com/dkql2kdgz/image/upload/v1749404408/products/fzswicjpgodxnfo3liyi.jpg",
    description: "Official FIFA 24 matchday jersey, representing the spirit of Argentina.",
    price: 39.99,
    category: "tshirts",
    isFeatured: true,
  },
  {
    name: "Nike Air Max 270 React",
    // Realistic shoe image from a public source
    image: "https://fakestoreapi.com/img/81QpkxQc-LT._AC_SL1500_.jpg",
    description: "Experience supreme comfort and style with the Nike Air Max 270 React. Perfect for everyday wear.",
    price: 159.99,
    category: "shoes",
    isFeatured: true,
  },
  {
    name: "Classic Blue Denim Jacket",
    // Realistic clothing image from a public source
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_SL1500_.jpg",
    description: "A timeless and versatile piece for your wardrobe. Made from durable, high-quality denim.",
    price: 79.95,
    category: "jackets",
    isFeatured: false,
  },
  {
    name: "Wireless Bluetooth Earbuds Pro",
    // Realistic electronics image from a public source
    image: "https://fakestoreapi.com/img/61IBoJtVnHL._AC_SL1500_.jpg",
    description: "Immersive sound, comfortable fit, and seamless connectivity for your music and calls.",
    price: 49.99,
    category: "electronics",
    isFeatured: true,
  },
  {
    name: "Portable Espresso Maker",
    // Placeholder image that looks like a small appliance
    image: "https://picsum.photos/id/240/400/400", // Coffee machine-like
    description: "Enjoy barista-quality espresso anywhere with this compact and easy-to-use portable maker.",
    price: 59.00,
    category: "kitchen",
    isFeatured: false,
  },
  {
    name: "Ergonomic Mesh Office Chair",
    // Realistic furniture image from a public source
    image: "https://fakestoreapi.com/img/71kWp3OPL9L._AC_SL1500_.jpg",
    description: "Designed for ultimate comfort and support, reducing strain during long working hours. Adjustable features for personalized comfort.",
    price: 299.00,
    category: "furniture",
    isFeatured: true,
  },
  {
    name: "Smart RGB LED Strip Lights (5m)",
    // Generic electronics image, representing something sleek
    image: "https://picsum.photos/id/250/400/400", // Abstract electronics
    description: "Transform your living space with millions of colors and dynamic lighting effects. App-controlled and voice-assistant compatible.",
    price: 34.50,
    category: "electronics",
    isFeatured: false,
  },
  {
    name: "Waterproof Trekking Boots",
    // Another realistic shoe image
    image: "https://fakestoreapi.com/img/71li-UNsERL._AC_SL1500_.jpg",
    description: "Conquer any trail with these durable, waterproof hiking boots. Excellent grip and ankle support.",
    price: 120.00,
    category: "shoes",
    isFeatured: true,
  },
  {
    name: "Premium Cotton Blend Hoodie",
    // Generic clothing image
    image: "https://fakestoreapi.com/img/71-3HjhnzGL._AC_SL1500_.jpg",
    description: "Soft, warm, and comfortable. Perfect for layering or casual wear. Made from a high-quality cotton blend.",
    price: 45.00,
    category: "tshirts", // Can be categorized as 'apparel' or 'hoodies' if you add more categories
    isFeatured: false,
  },
  {
    name: "Genuine Leather Bifold Wallet",
    // Small leather item image
    image: "https://picsum.photos/id/177/400/400", // Close-up of leather texture
    description: "Crafted from authentic leather, this wallet offers classic style and ample space for cards and cash.",
    price: 30.00,
    category: "accessories",
    isFeatured: false,
  },
  {
    name: "Fitness Tracker Smartwatch",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_SL1500_.jpg",
    description: "Monitor your heart rate, steps, and sleep. Stay connected with notifications on your wrist.",
    price: 89.99,
    category: "electronics",
    isFeatured: true,
  },
  {
    name: "Stainless Steel Water Bottle",
    image: "https://picsum.photos/id/292/400/400", // Shiny metal object
    description: "Keep your drinks cold for 24 hours or hot for 12. Eco-friendly and durable.",
    price: 19.99,
    category: "kitchen", // or "accessories"
    isFeatured: false,
  },
];

const importData = async () => {
  try {
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}