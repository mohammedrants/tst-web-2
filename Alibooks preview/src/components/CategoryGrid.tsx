import React from 'react';
import { CATEGORIES } from '../data/books';

interface CategoryGridProps {
  onSelectCategory: (catId: string) => void;
  selectedCategory: string;
}

export default function CategoryGrid({ onSelectCategory, selectedCategory }: CategoryGridProps) {
  return (
    <section className="container mx-auto px-6 py-16" id="category-section">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-orange-600 font-bold uppercase tracking-wider text-xs">📦 Exam Catalogs</span>
        <h2 className="text-3xl font-extrabold text-gray-800 mt-1">Browse by Academic Level</h2>
        <p className="text-gray-500 mt-2">
          Select your class or certification level to view relevant textbooks, keys, and past papers.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          
          // Get specific visual configurations based on category color
          const colorStyles = 
            cat.color === 'orange' ? { bg: 'bg-orange-50 border-orange-100', text: 'text-orange-600', badge: 'bg-orange-600' } :
            cat.color === 'blue' ? { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', badge: 'bg-blue-600' } :
            cat.color === 'green' ? { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-600' } :
            cat.color === 'indigo' ? { bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-600' } :
            { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', badge: 'bg-amber-600' };

          return (
            <div 
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-6 rounded-2xl shadow-xs border transition-all duration-300 text-center cursor-pointer select-none flex flex-col justify-between items-center ${
                isSelected 
                  ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 scale-105' 
                  : 'bg-white border-gray-100 hover:border-orange-200 hover:-translate-y-1 hover:shadow-md'
              }`}
              id={`category-card-${cat.id}`}
            >
              <div className="flex flex-col items-center">
                {/* Visual Initial Emblem */}
                <div className={`w-14 h-14 ${colorStyles.bg} rounded-full flex items-center justify-center mb-4 border`}>
                  <span className={`text-xl font-black ${colorStyles.text}`}>
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-800 text-base mb-1">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-[10px] md:text-xs leading-normal max-w-[130px] mx-auto">
                  {cat.id === 'o-level' ? 'O Level Workbooks & Keys' :
                   cat.id === 'a-level' ? 'Reference books & topical' :
                   cat.id === 'fsc' ? 'PTB books & notes' :
                   cat.id === 'matric' ? 'Class 9th & 10th guides' : 'Notebooks, pens & Casio'}
                </p>
              </div>

              <div className={`mt-4 text-xs font-bold ${colorStyles.text} flex items-center gap-1 group-hover:underline pt-2`}>
                <span>Explore</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
