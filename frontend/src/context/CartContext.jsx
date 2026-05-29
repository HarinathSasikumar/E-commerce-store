import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const STORAGE_KEY = 'luxemart_cart';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i._id === action.product._id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.product._id
              ? { ...i, quantity: Math.min(i.quantity + (action.qty || 1), i.stock) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: action.qty || 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i._id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.id ? { ...i, quantity: Math.max(1, Math.min(action.qty, i.stock)) } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"items":[]}');
  const [state, dispatch] = useReducer(cartReducer, stored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD', product, qty });
    toast.success(`${product.name.slice(0, 20)}... added to cart!`, { icon: '🛒' });
  };
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const updateQuantity = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 99 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, tax, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
