import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw, X, Phone, MessageSquare, Heart, Check, HelpCircle, MapPin, Info, ArrowUp } from 'lucide-react';
import { BOOKS, CATEGORIES, STATIC_PAGES } from './data/books';
import { Book, CartItem, FilterState, Order } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import NotesDownloadCenter from './components/NotesDownloadCenter';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_FILTER: FilterState = {
  search: '',
  category: '',
  subcategory: '',
  type: '',
  priceRange: [0, 6000],
  sortBy: 'popular'
};

export default function App() {
  // State variables
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeInfoTab, setActiveInfoTab] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Refs for smooth scrolling
  const catalogRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('alibooks_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('alibooks_cart', JSON.stringify(cart));
  }, [cart]);

  // Monitor scroll for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast notification trigger helper
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  // Cart operations
  const handleAddToCart = (book: Book, quantity: number = 1) => {
    if (book.stock <= 0) {
      showToast(`Sorry, ${book.title} is currently out of stock.`, 'info');
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.book.id === book.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const newQty = updatedCart[existingItemIndex].quantity + quantity;
        if (newQty > book.stock) {
          showToast(`Cannot add more. Only ${book.stock} items in stock.`, 'info');
          return prevCart;
        }
        updatedCart[existingItemIndex].quantity = newQty;
        showToast(`Updated ${book.title} quantity in your cart!`);
        return updatedCart;
      } else {
        showToast(`Added ${book.title} to your cart!`);
        return [...prevCart, { book, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(bookId);
      return;
    }
    const book = BOOKS.find((b) => b.id === bookId);
    if (book && quantity > book.stock) {
      showToast(`Only ${book.stock} items available in stock.`, 'info');
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (bookId: string) => {
    const item = cart.find((i) => i.book.id === bookId);
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    if (item) {
      showToast(`Removed ${item.book.title} from cart.`, 'info');
    }
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setCheckoutOpen(false);
    showToast('Your order has been registered successfully! 🎉');
  };

  // Scroll Helpers
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToNotes = () => {
    notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Category selection handler (sets filter & scrolls to view)
  const handleCategoryFilter = (catId: string) => {
    setFilterState((prev) => ({
      ...prev,
      category: catId,
      subcategory: '' // Reset subcategory when switching main category
    }));
    setTimeout(scrollToCatalog, 100);
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState((prev) => {
      const next = { ...prev, ...updates };
      // If category changes and is empty, reset subcategory as well
      if (updates.category === '') {
        next.subcategory = '';
      }
      return next;
    });
  };

  // Process and filter books list
  const filteredBooks = BOOKS.filter((book) => {
    // 1. Search Query
    if (filterState.search) {
      const query = filterState.search.toLowerCase();
      const matchesTitle = book.title.toLowerCase().includes(query);
      const matchesAuthor = book.author.toLowerCase().includes(query);
      const matchesPublisher = book.publisher?.toLowerCase().includes(query);
      const matchesCategory = book.category.toLowerCase().includes(query);
      if (!matchesTitle && !matchesAuthor && !matchesPublisher && !matchesCategory) {
        return false;
      }
    }

    // 2. Category
    if (filterState.category && book.category !== filterState.category) {
      return false;
    }

    // 3. Subcategory
    if (filterState.subcategory && book.subcategory !== filterState.subcategory) {
      return false;
    }

    // 4. Book Type (Textbook, Notes, Past Papers, Stationery)
    if (filterState.type && book.type !== filterState.type) {
      return false;
    }

    // 5. Price Range
    if (book.price < filterState.priceRange[0] || book.price > filterState.priceRange[1]) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sorting
    if (filterState.sortBy === 'popular') {
      return b.rating - a.rating; // Mocking popular with rating
    }
    if (filterState.sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (filterState.sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (filterState.sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const deliveryFee = subtotal >= 5000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-orange-500 selection:text-white" id="main-app">
      
      {/* HEADER NAVBAR */}
      <Header 
        filterState={filterState}
        onFilterChange={handleFilterChange}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setCartOpen(true)}
      />

      {/* HERO HERO SECTION */}
      <Hero 
        onShopClick={scrollToCatalog}
        onDownloadClick={scrollToNotes}
      />

      {/* CATEGORY GRID */}
      <CategoryGrid 
        onSelectCategory={handleCategoryFilter}
        selectedCategory={filterState.category}
      />

      {/* CORE PRODUCT CATALOG */}
      <div className="container mx-auto px-4 md:px-6 py-8 border-t border-gray-100" ref={catalogRef} id="product-catalog-section">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filtering Controls */}
          <aside className={`${showFiltersMobile ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0 space-y-6`}>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  <Filter size={16} className="text-orange-600" />
                  <span>FILTER LOGIC</span>
                </h3>
                {(filterState.category || filterState.subcategory || filterState.type || filterState.search) && (
                  <button 
                    onClick={() => setFilterState(INITIAL_FILTER)}
                    className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
                    id="reset-filters-sidebar-btn"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Subject Class Selector */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syllabus / Grade</h4>
                <div className="space-y-1.5 text-xs font-bold">
                  <button 
                    onClick={() => handleFilterChange({ category: '', subcategory: '' })}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                      !filterState.category ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Study Grades
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => handleFilterChange({ category: cat.id, subcategory: '' })}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                        filterState.category === cat.id ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-400 rounded px-1.5 py-0.5">
                        {cat.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (if main active) */}
              {filterState.category && (
                <div className="space-y-2.5 pt-4 border-t border-gray-100 animate-fadeIn">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resource Type</h4>
                  <div className="space-y-1.5 text-xs font-semibold">
                    <button 
                      onClick={() => handleFilterChange({ subcategory: '' })}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                        !filterState.subcategory ? 'text-orange-600 font-extrabold bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Resources
                    </button>
                    {CATEGORIES.find(c => c.id === filterState.category)?.subcategories.map((sub) => (
                      <button 
                        key={sub.id}
                        onClick={() => handleFilterChange({ subcategory: sub.id })}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                          filterState.subcategory === sub.id ? 'text-orange-600 font-extrabold bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price filter slide indicator */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Budget</h4>
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span>Rs. 0</span>
                  <span className="text-orange-600">Max: Rs. {filterState.priceRange[1].toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="300" 
                  max="6000" 
                  step="100"
                  value={filterState.priceRange[1]}
                  onChange={(e) => handleFilterChange({ priceRange: [0, parseInt(e.target.value)] })}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  id="price-range-slider"
                />
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-sm border border-slate-800">
              <h4 className="font-extrabold text-xs tracking-wider flex items-center gap-1.5 text-orange-500">
                <Phone size={14} />
                <span>NEED HELP ORDERING?</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send your book list on WhatsApp! Our Urdu Bazar team will compile your books and deliver immediately.
              </p>
              <a 
                href="https://wa.me/923319122339" 
                target="_blank" 
                rel="noreferrer"
                className="w-full min-h-10 py-2.5 px-4 bg-orange-600 text-white font-bold rounded-xl text-xs hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="leading-tight">WhatsApp Us Now</span>
              </a>
            </div>
          </aside>

          {/* Product Grid & Active filter pills */}
          <main className="flex-1 space-y-6">
            
            {/* Horizontal Type Filters Bar & Sort Selection */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Type Tabs and Mobile Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                  className="lg:hidden flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-orange-100"
                  id="mobile-advanced-filters-toggle-btn"
                >
                  <SlidersHorizontal size={14} />
                  <span>{showFiltersMobile ? 'Hide Sidebar Filters' : 'Filter by Subject/Grade/Budget'}</span>
                </button>

                <div className="flex overflow-x-auto pb-1.5 max-w-full gap-1.5 scrollbar-none whitespace-nowrap snap-x">
                  {['', 'Textbook', 'Notes', 'Past Papers', 'Stationery'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => handleFilterChange({ type })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 snap-start ${
                        filterState.type === type 
                          ? 'bg-orange-600 text-white shadow-sm' 
                          : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                      id={`type-filter-tab-${type || 'all'}`}
                    >
                      {type === '' ? 'ALL PRODUCTS' : type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting Selection dropdown */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                  <ArrowUpDown size={12} />
                  Sort By:
                </span>
                <select 
                  value={filterState.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                  className="border border-gray-200 rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-orange-500 bg-white text-gray-700 cursor-pointer"
                  id="sort-select"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Active search filter notifications */}
            {(filterState.search || filterState.category || filterState.subcategory) && (
              <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                <span>Active Filters:</span>
                {filterState.search && (
                  <span className="bg-gray-100 text-gray-700 py-1 px-2.5 rounded-full flex items-center gap-1 font-semibold">
                    Search: "{filterState.search}"
                    <X size={12} className="cursor-pointer" onClick={() => handleFilterChange({ search: '' })} />
                  </span>
                )}
                {filterState.category && (
                  <span className="bg-gray-100 text-gray-700 py-1 px-2.5 rounded-full flex items-center gap-1 font-semibold capitalize">
                    Grade: {filterState.category.replace('-', ' ')}
                    <X size={12} className="cursor-pointer" onClick={() => handleFilterChange({ category: '', subcategory: '' })} />
                  </span>
                )}
                {filterState.subcategory && (
                  <span className="bg-gray-100 text-gray-700 py-1 px-2.5 rounded-full flex items-center gap-1 font-semibold capitalize">
                    Resource: {filterState.subcategory.replace('-', ' ')}
                    <X size={12} className="cursor-pointer" onClick={() => handleFilterChange({ subcategory: '' })} />
                  </span>
                )}
                <button 
                  onClick={() => setFilterState(INITIAL_FILTER)}
                  className="text-orange-600 hover:underline font-bold"
                  id="clear-all-pills-btn"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Grid of books */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredBooks.map((book) => (
                  <ProductCard 
                    key={book.id}
                    book={book}
                    onSelect={(b) => setSelectedBook(b)}
                    onAddToCart={(b) => handleAddToCart(b, 1)}
                  />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-lg mx-auto space-y-4">
                <div className="p-4 bg-orange-50 rounded-full text-orange-500 inline-block">
                  <Filter size={36} />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-lg">No study materials found</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Try refining your filters, updating your search text, or widening your price budget.
                  </p>
                </div>
                <button 
                  onClick={() => setFilterState(INITIAL_FILTER)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
                  id="no-results-reset-btn"
                >
                  Show All Books
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* REVOLUTIONARY NOTES DOWNLOAD LIBRARY */}
      <div ref={notesRef}>
        <NotesDownloadCenter />
      </div>

      {/* FOOTER INFORMATIONAL TABS */}
      <section className="bg-white border-t border-gray-100 py-10" id="info-tabs-section">
        <div className="container mx-auto px-6">
          {/* Tabs header bar */}
          <div className="flex flex-wrap justify-center gap-4 border-b border-gray-100 pb-4 mb-6">
            {STATIC_PAGES.map((page) => (
              <button 
                key={page.slug}
                onClick={() => setActiveInfoTab(activeInfoTab === page.slug ? null : page.slug)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeInfoTab === page.slug 
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-100 hover:bg-orange-50 hover:text-orange-600'
                }`}
                id={`footer-tab-btn-${page.slug}`}
              >
                {page.title}
              </button>
            ))}
          </div>

          {/* Expanded Tab Area */}
          <AnimatePresence>
            {activeInfoTab && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-orange-50/30 p-6 rounded-2xl border border-orange-100/50 max-w-3xl mx-auto overflow-hidden relative"
              >
                <button 
                  onClick={() => setActiveInfoTab(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-orange-600 cursor-pointer"
                  id="close-info-tab-btn"
                >
                  <X size={14} />
                </button>
                <h4 className="font-extrabold text-orange-700 text-base mb-2">
                  {STATIC_PAGES.find(p => p.slug === activeInfoTab)?.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {STATIC_PAGES.find(p => p.slug === activeInfoTab)?.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800" id="main-footer">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="text-2xl font-black text-orange-500 tracking-tighter italic">ALI<span className="text-white not-italic">BOOKS</span></div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Providing authentic CAIE O/A Level syllabus materials, Punjab Textbook Board (PTB) helps, key keys, and premium stationery products to Lahore students since 2010.
            </p>
            <div className="flex space-x-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-slate-400 hover:text-white" id="social-fb">
                <Heart size={14} className="fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-slate-400 hover:text-white" id="social-ig">
                <HelpCircle size={14} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Academics */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-orange-500 uppercase tracking-widest">Syllabus Catalogs</h4>
            <ul className="text-slate-400 space-y-2 text-xs font-semibold">
              <li><button onClick={() => handleCategoryFilter('o-level')} className="hover:text-white transition-colors cursor-pointer text-left">O Level Resources</button></li>
              <li><button onClick={() => handleCategoryFilter('a-level')} className="hover:text-white transition-colors cursor-pointer text-left">A Level Resources</button></li>
              <li><button onClick={() => handleCategoryFilter('fsc')} className="hover:text-white transition-colors cursor-pointer text-left">FSC Punjab Board</button></li>
              <li><button onClick={() => handleCategoryFilter('matric')} className="hover:text-white transition-colors cursor-pointer text-left">Matric Study Guides</button></li>
              <li><button onClick={() => handleCategoryFilter('stationery')} className="hover:text-white transition-colors cursor-pointer text-left">Calculators & Stationery</button></li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-orange-500 uppercase tracking-widest">Support & Policies</h4>
            <ul className="text-slate-400 space-y-2 text-xs font-semibold">
              <li><button onClick={() => setActiveInfoTab('shipping')} className="hover:text-white transition-colors cursor-pointer text-left">Fast Lahore Shipping</button></li>
              <li><button onClick={() => setActiveInfoTab('return-policy')} className="hover:text-white transition-colors cursor-pointer text-left">7 Days Returns</button></li>
              <li><button onClick={() => setActiveInfoTab('about')} className="hover:text-white transition-colors cursor-pointer text-left">About Urdu Bazar Store</button></li>
              <li><a href="https://wa.me/923319122339" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-left">WhatsApp Helpdesk</a></li>
            </ul>
          </div>

          {/* Column 4: Physical Location */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-orange-500 uppercase tracking-widest">Physical Store</h4>
            <div className="space-y-2.5 text-slate-400 text-xs font-semibold">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Main Urdu Bazar, Lahore (Opposite Government High School)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-orange-500 shrink-0" />
                <span>+92 331 9122339</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare size={14} className="text-orange-500 shrink-0" />
                <span>info@alibooks.pk</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[11px] uppercase tracking-wider font-semibold container mx-auto px-6">
          <div>© 2026 ALI BOOKS LAHORE. ACADEMIC EXCELLENCE GUARANTEED.</div>
          <div className="flex gap-4 text-slate-500 text-[10px]">
            <span>Main Urdu Bazar, Lahore</span>
            <span>•</span>
            <span>Shipping Policy</span>
            <span>•</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>

      {/* SHOPPING CART DRAWER */}
      <CartDrawer 
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedBook && (
          <ProductDetailModal 
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL OVERLAY */}
      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal 
            cart={cart}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            onClose={() => setCheckoutOpen(false)}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>

      {/* FLOATING TOASTS BAR CONTAINER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none" id="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div 
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 max-w-sm pointer-events-auto shrink-0 ${
                toast.type === 'success' 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-zinc-900 text-white border-zinc-800'
              }`}
            >
              {toast.type === 'success' && <Check size={14} className="shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DYNAMIC SCROLL TO TOP */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border border-orange-500 animate-fadeIn"
          title="Scroll to Top"
          id="scroll-to-top-btn"
        >
          <ArrowUp size={16} />
        </button>
      )}

    </div>
  );
}
