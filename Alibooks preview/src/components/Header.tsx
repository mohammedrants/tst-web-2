import React, { useState } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Menu, X, BookOpen, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/books';
import { FilterState } from '../types';

interface HeaderProps {
  filterState: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  cartCount: number;
  onCartToggle: () => void;
}

export default function Header({ filterState, onFilterChange, cartCount, onCartToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleCategorySelect = (catId: string, subcatId: string = '') => {
    onFilterChange({
      category: catId,
      subcategory: subcatId,
      search: '' // Clear search when browsing categories
    });
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleResetFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      subcategory: '',
      type: ''
    });
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Delivery Bar */}
      <div className="bg-orange-600 text-white text-[10px] sm:text-[11px] py-1.5 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 font-medium text-center">
        <span>⚡ EXPRESS DELIVERY IN LAHORE WITHIN 24 HOURS</span>
        <span className="hidden md:inline">FREE SHIPPING ON ORDERS OVER RS. 5000</span>
        <span>CALL: +92 331 9122339</span>
      </div>

      {/* Main Navigation Row */}
      <div className="container mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center gap-4">
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-orange-600 focus:outline-none cursor-pointer"
          id="mobile-menu-toggle-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <div 
          onClick={handleResetFilters}
          className="text-2xl md:text-3xl font-black tracking-tighter text-orange-600 italic cursor-pointer select-none shrink-0"
          id="brand-logo-btn"
        >
          ALI<span className="text-slate-900 not-italic">BOOKS</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full flex items-center">
            <input 
              type="text" 
              placeholder="Search O-Level Notes, FSC Textbooks, Stationeries..." 
              value={filterState.search}
              onChange={handleSearchChange}
              className="w-full bg-slate-100 border-none rounded-full py-2 px-5 pr-12 text-xs focus:ring-2 focus:ring-orange-500 text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              id="desktop-search-input"
            />
            <button className="absolute right-4 text-slate-400 hover:text-orange-600" id="desktop-search-btn">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Header Quick Icons */}
        <div className="flex items-center space-x-3 md:space-x-5 text-slate-600 shrink-0">
          <button 
            className="hidden sm:flex items-center gap-1 text-xs font-bold hover:text-orange-600 transition-colors cursor-pointer text-slate-600"
            id="urdu-bazar-outlet-btn"
          >
            <MapPin size={15} className="text-orange-500" />
            <span className="hidden lg:inline">Urdu Bazar Outlet</span>
          </button>

          {/* Cart Icon with badge */}
          <button 
            onClick={onCartToggle}
            className="relative cursor-pointer hover:text-orange-600 transition-colors p-2 bg-orange-50 rounded-full text-orange-600 flex items-center justify-center border border-orange-100/30"
            id="header-cart-btn"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories Desktop Menu Dropdowns Row */}
      <div className="bg-white border-t border-gray-100 hidden md:block">
        <div className="container mx-auto px-6 py-1.5 flex justify-center space-x-2 lg:space-x-6 text-sm font-bold text-gray-700">
          
          <button 
            onClick={handleResetFilters}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              !filterState.category && !filterState.search 
                ? 'bg-orange-500 text-white' 
                : 'hover:text-orange-600 hover:bg-orange-50/50'
            }`}
            id="nav-all-books-btn"
          >
            ALL MATERIALS
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = filterState.category === cat.id;
            return (
              <div 
                key={cat.id} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(cat.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors uppercase cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                  id={`nav-cat-btn-${cat.id}`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute left-0 mt-1 w-56 bg-white shadow-2xl rounded-2xl py-2 border border-gray-100 z-50 transition-all duration-200 origin-top-left ${
                    activeDropdown === cat.id 
                      ? 'opacity-100 scale-100 pointer-events-auto' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="h-1.5 w-full bg-orange-500 absolute top-0 left-0 rounded-t-2xl" />
                  <button 
                    onClick={() => handleCategorySelect(cat.id)}
                    className="w-full text-left px-5 py-2.5 text-xs text-orange-600 font-extrabold hover:bg-orange-50/40 uppercase tracking-wider"
                    id={`subcat-all-${cat.id}`}
                  >
                    View All {cat.name}
                  </button>
                  <div className="border-b border-gray-50 my-1" />
                  {cat.subcategories.map((sub) => (
                    <button 
                      key={sub.id}
                      onClick={() => handleCategorySelect(cat.id, sub.id)}
                      className={`w-full text-left px-5 py-2.5 text-xs text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-semibold flex items-center justify-between group/item`}
                      id={`subcat-btn-${cat.id}-${sub.id}`}
                    >
                      <span>{sub.name}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 text-orange-500 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-nav-menu">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <span className="text-2xl font-extrabold text-orange-600 tracking-tighter">ALI<span className="text-gray-800">BOOKS</span></span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-orange-600 hover:text-white transition-colors cursor-pointer"
                id="close-mobile-menu-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="my-6">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search O/A Levels, FSC..." 
                  value={filterState.search}
                  onChange={handleSearchChange}
                  className="w-full border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-orange-500"
                  id="mobile-search-input"
                />
                <button className="absolute right-3 top-2.5 text-gray-400" id="mobile-search-btn">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Lists */}
            <div className="space-y-6">
              <div>
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Academic Categories</h5>
                <div className="space-y-1.5">
                  <button 
                    onClick={handleResetFilters}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      !filterState.category && !filterState.search
                        ? 'bg-orange-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    id="mobile-all-books-btn"
                  >
                    📚 All Study Materials
                  </button>

                  {CATEGORIES.map((cat) => {
                    const isSelected = filterState.category === cat.id;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <button 
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                            isSelected ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          id={`mobile-cat-btn-${cat.id}`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] bg-orange-100 text-orange-600 rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {cat.badge}
                          </span>
                        </button>

                        {/* Mobile Subcategories (Indented) */}
                        {isSelected && (
                          <div className="pl-6 space-y-1 mt-1 border-l-2 border-orange-200 ml-4">
                            {cat.subcategories.map(sub => (
                              <button 
                                key={sub.id}
                                onClick={() => handleCategorySelect(cat.id, sub.id)}
                                className={`w-full text-left py-1.5 text-[11px] font-semibold block transition-colors ${
                                  filterState.subcategory === sub.id ? 'text-orange-600 font-extrabold' : 'text-gray-500 hover:text-orange-600'
                                }`}
                                id={`mobile-subcat-btn-${cat.id}-${sub.id}`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Outlet Info */}
              <div className="pt-6 border-t border-gray-100 space-y-3.5">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Our Outlet</h5>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> Main Urdu Bazar, Lahore</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-orange-500" /> +92 331 9122339</p>
                  <p className="flex items-center gap-2"><Mail size={14} className="text-orange-500" /> info@alibooks.pk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
