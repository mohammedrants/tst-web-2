import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageSquare, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';
import BookCover from './BookCover';
import { motion } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, cart, onClose, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const freeShippingThreshold = 5000;
  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const total = subtotal + deliveryFee;
  const differenceToFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md flex">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="w-full bg-white shadow-2xl flex flex-col justify-between h-full border-l border-gray-100"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="text-orange-600" size={20} />
              <span>Your Shopping Cart</span>
              <span className="text-xs bg-orange-600 text-white rounded-full px-2 py-0.5 ml-1 font-bold">
                {cart.reduce((count, item) => count + item.quantity, 0)}
              </span>
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 bg-white text-gray-400 rounded-full hover:bg-orange-600 hover:text-white transition-colors cursor-pointer border border-gray-100"
              id="close-cart-drawer-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-orange-50 rounded-full text-orange-600">
                  <ShoppingBag size={40} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">Your cart is empty</h4>
                  <p className="text-xs text-gray-400 max-w-[200px] mx-auto mt-1">
                    Add O/A Level resources, solved notes, or stationery to get started!
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  id="empty-cart-back-shopping-btn"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div 
                  key={item.book.id} 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors relative group"
                  id={`cart-item-${item.book.id}`}
                >
                  {/* Miniature Cover */}
                  <div className="shrink-0 scale-75 origin-left">
                    <BookCover book={item.book} size="sm" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                      {item.book.type}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800 truncate mt-1">
                      {item.book.title}
                    </h4>
                    <p className="text-xs text-gray-500 italic truncate">By {item.book.author}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-extrabold text-orange-600">
                        Rs. {(item.book.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-7 bg-white">
                        <button 
                          className="px-2 hover:bg-gray-100 h-full text-xs font-bold transition-colors cursor-pointer"
                          onClick={() => onUpdateQuantity(item.book.id, item.quantity - 1)}
                          id={`cart-dec-${item.book.id}`}
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800 min-w-6 text-center">{item.quantity}</span>
                        <button 
                          className="px-2 hover:bg-gray-100 h-full text-xs font-bold transition-colors cursor-pointer"
                          onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                          id={`cart-inc-${item.book.id}`}
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trash Icon */}
                  <button 
                    onClick={() => onRemoveItem(item.book.id)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-rose-600 rounded-lg bg-transparent hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                    id={`cart-remove-${item.book.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Checkout & Summary footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50">
              {/* Free Shipping Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  {differenceToFreeShipping > 0 ? (
                    <>
                      <span className="text-gray-500">Free Shipping on Rs. 5000+</span>
                      <span className="text-orange-600">Rs. {differenceToFreeShipping.toLocaleString()} away</span>
                    </>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      🎉 Free Lahore Shipping Unlocked!
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-700">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Lahore Delivery Fee:</span>
                  <span className="font-semibold text-gray-700">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-800 pt-1.5 border-t border-dashed border-gray-200">
                  <span>Estimated Total:</span>
                  <span className="text-lg text-orange-600">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger button */}
              <button 
                onClick={onCheckout}
                className="w-full min-h-12 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 text-xs sm:text-sm uppercase tracking-wider text-center"
                id="cart-checkout-btn"
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="leading-tight">Order via WhatsApp</span>
                <ChevronRight size={16} className="shrink-0" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
