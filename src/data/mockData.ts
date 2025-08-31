import { Product, Category } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Latest tech gadgets and devices' },
  { id: '2', name: 'Clothing', description: 'Fashion and apparel' },
  { id: '3', name: 'Books', description: 'Digital and physical books' },
  { id: '4', name: 'Home & Garden', description: 'Home improvement and garden supplies' },
  { id: '5', name: 'Sports', description: 'Sports equipment and fitness gear' }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality noise-canceling wireless headphones with premium sound quality and 30-hour battery life.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    category: 'Electronics',
    stock: 25,
    featured: true
  },
  {
    id: '2', 
    title: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    price: 449.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
    category: 'Electronics',
    stock: 15,
    featured: true
  },
  {
    id: '3',
    title: 'Minimalist T-Shirt',
    description: 'Premium cotton t-shirt with modern minimalist design. Perfect for everyday wear.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop',
    category: 'Clothing',
    stock: 50
  },
  {
    id: '4',
    title: 'JavaScript: The Complete Guide',
    description: 'Comprehensive guide to modern JavaScript programming with practical examples.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop',
    category: 'Books',
    stock: 30
  },
  {
    id: '5',
    title: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support and adjustable height.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 12
  },
  {
    id: '6',
    title: 'Yoga Mat Pro',
    description: 'Professional-grade yoga mat with superior grip and cushioning.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop',
    category: 'Sports',
    stock: 20
  },
  {
    id: '7',
    title: 'Wireless Bluetooth Speaker',
    description: 'Portable wireless speaker with rich bass and 12-hour battery life.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=400&fit=crop',
    category: 'Electronics',
    stock: 35
  },
  {
    id: '8',
    title: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with vintage wash and modern fit.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=400&fit=crop',
    category: 'Clothing',
    stock: 22
  }
];