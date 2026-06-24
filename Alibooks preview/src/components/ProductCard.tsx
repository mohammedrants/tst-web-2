import React from 'react';
import { Star, ShoppingCart, Info } from 'lucide-react';
import { Book } from '../types';
import BookCover from './BookCover';

interface ProductCardProps {
  key?: string;
  book: Book;
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export default function ProductCard({ book, onSelect, onAddToCart }: ProductCardProps) {
  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <div 
      className="group bg-white rounded-2xl p-3 xs:p-4 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between"
      id={`product-card-${book.id}`}
    >
      {/* Cover / Image Area */}
      <div 
        className="relative flex justify-center items-center py-4 xs:py-6 bg-gray-50 rounded-xl mb-4 cursor-pointer overflow-hidden group-hover:bg-orange-50/30 transition-colors"
        onClick={() => onSelect(book)}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm text-white ${
            book.type === 'Notes' ? 'bg-orange-500' :
            book.type === 'Textbook' ? 'bg-blue-500' :
            book.type === 'Past Papers' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
            {book.type.toUpperCase()}
          </span>
          {book.isBestSeller && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              BEST SELLER
            </span>
          )}
        </div>

        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-20">
            {discount}% OFF
          </span>
        )}

        {/* Real 3D Book Cover component */}
        <div className="transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300">
          <BookCover book={book} size="md" />
        </div>

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <button 
            className="p-2.5 bg-white text-gray-800 rounded-full hover:bg-orange-600 hover:text-white transition-colors shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book);
            }}
            title="View Book Details"
            id={`quick-view-btn-${book.id}`}
          >
            <Info size={18} />
          </button>
          <button 
            className="p-2.5 bg-white text-gray-800 rounded-full hover:bg-orange-600 hover:text-white transition-colors shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(book);
            }}
            title="Add to Cart"
            id={`quick-cart-btn-${book.id}`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-xs text-gray-500 font-medium">
            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
              {book.category.replace('-', ' ')}
            </span>
            <span>•</span>
            <span className="truncate max-w-[120px]">{book.publisher || 'Academic'}</span>
          </div>

          <h4 
            className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight text-sm md:text-base cursor-pointer mb-1"
            onClick={() => onSelect(book)}
          >
            {book.title}
          </h4>
          <p className="text-xs text-gray-500 italic mb-2">By {book.author}</p>
        </div>

        <div>
          {/* Reviews & Stock */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-700">{book.rating}</span>
              <span className="text-[10px] text-gray-400">({book.reviewsCount})</span>
            </div>
            <span className={`text-[10px] font-semibold ${book.stock > 10 ? 'text-emerald-600' : 'text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded'}`}>
              {book.stock > 10 ? `${book.stock} in stock` : `Only ${book.stock} left`}
            </span>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              {book.originalPrice && (
                <span className="text-[10px] xs:text-xs text-gray-400 line-through">
                  Rs. {book.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-base xs:text-lg font-bold text-orange-600">
                Rs. {book.price.toLocaleString()}
              </span>
            </div>

            <button 
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 xs:px-3 xs:py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer w-full xs:w-auto"
              onClick={() => onAddToCart(book)}
              id={`add-to-cart-btn-${book.id}`}
            >
              <ShoppingCart size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
