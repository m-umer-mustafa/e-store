import { useState } from 'react';
import { ShoppingBag, Zap, Shield, Truck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductModal } from '@/components/products/ProductModal';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { Link } from 'react-router-dom';

export default function Home() {
  const { products } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="gradient-text">E - Store</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the latest in technology with our curated collection of premium products. 
            From cutting-edge electronics to essential accessories.
          </p>
          <Link to="/catalog">
            <Button variant="hero" size="lg" className="mr-4">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </Link>
        </div>
        
        {/* Features */}
        <div className="container mx-auto max-w-4xl mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Get your orders delivered within 24 hours</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure Shopping</h3>
              <p className="text-sm text-muted-foreground">Your data is protected with bank-level security</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}