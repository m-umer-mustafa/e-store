import { ShoppingCart, User, LogOut, Settings, Home, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { cart, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="text-xl font-bold gradient-text">E - Store</span>
        </Link>

        {/* Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              className="nav-button"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/catalog">
            <Button 
              variant={location.pathname === '/catalog' ? 'default' : 'ghost'} 
              className="nav-button"
            >
              <Grid className="w-4 h-4 mr-2" />
              Catalog
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative glow-hover">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-2">
              {user.isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="icon" className="glow-hover">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="glow-hover">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="glow-hover">
                <LogOut className="w-5 h-5" />
              </Button>
              <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                {user.name}
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}