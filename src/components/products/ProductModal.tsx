import { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart, user } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "Please log in to continue shopping.",
      });
      navigate('/login');
      onClose();
      return;
    }
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.title} added to your cart.`,
    });
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-card rounded-xl shadow-elegant border border-border">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="relative">
            {product.featured && (
              <Badge className="absolute top-4 left-4 z-10 bg-gradient-primary">
                Featured
              </Badge>
            )}
            <div className="aspect-square overflow-hidden rounded-xl bg-muted">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-warning text-warning mr-1" />
                <span className="text-sm text-muted-foreground">4.5 (128 reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {product.title}
            </h1>

            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                {product.stock} in stock
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full mb-6 glow-hover"
              size="lg"
              variant="hero"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart - ${(product.price * quantity).toFixed(2)}`}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}