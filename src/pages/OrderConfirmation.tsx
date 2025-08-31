import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Package className="w-5 h-5 mr-2" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold text-primary">#{orderId}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center justify-center space-x-3 p-4 bg-secondary/30 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div className="text-center">
                  <p className="text-sm font-medium">Confirmation Email</p>
                  <p className="text-xs text-muted-foreground">Sent to your email</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 p-4 bg-secondary/30 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
                <div className="text-center">
                  <p className="text-sm font-medium">Estimated Delivery</p>
                  <p className="text-xs text-muted-foreground">3-5 business days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Link to="/" className="block">
            <Button variant="hero" size="lg" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link to="/cart" className="block">
            <Button variant="outline" size="lg" className="w-full">
              View Order History
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• You'll receive a confirmation email shortly</p>
            <p>• Your order will be processed within 24 hours</p>
            <p>• You'll get tracking information once shipped</p>
            <p>• Contact support if you have any questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}