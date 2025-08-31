export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  };
  orderDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface AppState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
}