import { Package, Calendar, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Order } from '@/types';

export default function OrderHistory() {
  const { orders, user } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4">
        <Card className="glass max-w-md w-full text-center">
          <CardContent className="pt-6">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Please log in to view your order history.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userOrders = orders.filter(order => 
    order.customerInfo.email === user.email
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-300';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300';
      case 'delivered':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Order <span className="gradient-text">History</span>
          </h1>
          <p className="text-muted-foreground">
            Track and view your past orders
          </p>
        </div>

        {userOrders.length === 0 ? (
          <Card className="glass text-center">
            <CardContent className="pt-6">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Button variant="hero" onClick={() => window.location.href = '/catalog'}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userOrders.reverse().map((order) => (
              <Card key={order.id} className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(order.orderDate)}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${order.total.toFixed(2)}
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </Button>
                      <div className="text-lg font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Shipping Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Name:</strong> {order.customerInfo.name}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Address:</strong> {order.customerInfo.address}</p>
                        {order.customerInfo.phone && (
                          <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}