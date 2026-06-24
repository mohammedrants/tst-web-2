import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check, RefreshCw, Calendar, FileText, Landmark } from 'lucide-react';
import { Book } from '../types';
import BookCover from './BookCover';
import { motion } from 'motion/react';

interface ProductDetailModalProps {
  book: Book;
  onClose: () => void;
  onAddToCart: (book: Book, quantity: number) => void;
}

export default function ProductDetailModal({ book, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(book, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="product-detail-modal">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-y-auto md:overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh] md:max-h-[80vh]"
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-orange-600 hover:text-white transition-colors cursor-pointer"
          onClick={onClose}
          id="close-detail-modal-btn"
        >
          <X size={18} />
        </button>

        {/* Left Side: Cover Display */}
        <div className="md:w-5/12 bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center border-r border-gray-100 relative">
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          <div className="transform hover:scale-[1.02] transition-transform duration-300 drop-shadow-xl">
            <BookCover book={book} size="lg" />
          </div>
          {book.type === 'Notes' && (
            <p className="mt-4 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              ✨ Best Selling Solved Notes
            </p>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {book.type}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {book.category.replace('-', ' ')}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 italic mb-4">By {book.author}</p>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800">{book.rating}</span>
                <span className="text-xs text-gray-400">({book.reviewsCount} customer reviews)</span>
              </div>
              <span className={`text-xs font-semibold ${book.stock > 0 ? 'text-emerald-600' : 'text-rose-500 bg-rose-50 px-2 py-0.5 rounded'}`}>
                {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Book Description */}
            <div className="mb-6">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h5>
              <p className="text-sm text-gray-600 leading-relaxed max-h-36 overflow-y-auto">
                {book.description}
              </p>
            </div>

            {/* Book Specs Table */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {book.publisher && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Landmark size={14} className="text-orange-500 shrink-0" />
                  <span className="truncate"><strong>Publisher:</strong> {book.publisher}</span>
                </div>
              )}
              {book.year && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar size={14} className="text-orange-500 shrink-0" />
                  <span><strong>Year:</strong> {book.year}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FileText size={14} className="text-orange-500 shrink-0" />
                  <span><strong>Pages:</strong> {book.pages}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <RefreshCw size={14} className="text-orange-500 shrink-0" />
                <span><strong>Return Policy:</strong> 7 Days</span>
              </div>
            </div>
          </div>

          {/* Pricing, Quantity & Add to Cart */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col">
              {book.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  Rs. {book.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-extrabold text-orange-600">
                Rs. {book.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-11 bg-white">
                <button 
                  className="px-3 hover:bg-gray-100 h-full font-bold transition-colors cursor-pointer"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  id="dec-qty-btn"
                >
                  -
                </button>
                <span className="px-3 font-semibold text-gray-800 text-sm min-w-8 text-center">{quantity}</span>
                <button 
                  className="px-3 hover:bg-gray-100 h-full font-bold transition-colors cursor-pointer"
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  disabled={quantity >= book.stock}
                  id="inc-qty-btn"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Action */}
              <button 
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                  added ? 'bg-emerald-600' : 'bg-orange-600 hover:bg-orange-700'
                }`}
                id="add-to-cart-modal-btn"
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
