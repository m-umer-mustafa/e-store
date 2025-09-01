import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Product, Category, CartItem, User, Order } from '@/types';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AppContextType extends AppState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean, requiresConfirmation: boolean }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  placeOrder: (customerInfo: any) => string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOGIN'; payload: User }
  | { type: 'REGISTER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<User> }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string };

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Date.now().toString();

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload.product, quantity: action.payload.quantity }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'REGISTER':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'PLACE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    case 'LOAD_STATE':
      return action.payload;
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => c.id === action.payload.id ? { ...c, ...action.payload.updates } : c)
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload)
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  products: [],
  categories: [],
  cart: [],
  user: null,
  orders: []
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: user, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (user) {
          dispatch({ type: 'LOGIN', payload: { ...user, email: session.user.email } });
        }
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const getUser = async () => {
          const { data: user, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (user) {
            dispatch({ type: 'LOGIN', payload: { ...user, email: session.user.email } });
          }
        };
        getUser();
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: categories, error: categoriesError } = await supabase.from('categories').select('*');
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else if (categories) {
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      }

      const { data: products, error: productsError } = await supabase.from('products').select('*');
      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else if (products) {
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      }
    };

    fetchData();
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean, requiresConfirmation: boolean }> => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        data: { name } 
      }
    });
    if (error) {
      return { success: false, requiresConfirmation: false };
    }
    // The user is created, but session is null if email confirmation is required.
    const requiresConfirmation = data.session === null;
    return { success: true, requiresConfirmation };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!state.user) return;
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
  };

  const placeOrder = (customerInfo: any): string => {
    const orderId = generateId();
    const order: Order = {
      id: orderId,
      items: [...state.cart],
      total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      customerInfo,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };
    dispatch({ type: 'PLACE_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });
    return orderId;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (data) {
      dispatch({ type: 'ADD_PRODUCT', payload: data[0] });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
    if (data) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates: data[0] } });
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { data, error } = await supabase.from('categories').insert([category]).select();
    if (data) {
      dispatch({ type: 'ADD_CATEGORY', payload: data[0] });
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select();
    if (data) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates: data[0] } });
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      login,
      register,
      logout,
      updateUserProfile,
      placeOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}