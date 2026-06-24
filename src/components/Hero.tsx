import React from 'react';
import { BookOpen, Award, ShieldCheck, Download, Star } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onDownloadClick: () => void;
}

export default function Hero({ onShopClick, onDownloadClick }: HeroProps) {
  return (
    <header className="relative bg-white border-b border-slate-100 overflow-hidden py-16 md:py-24" id="hero-section">
      {/* Absolute Glow Background Elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-50 rounded-full opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-100/30 rounded-full opacity-50 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Column: CTA & Headline */}
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-md tracking-widest uppercase">
              EST. 2010 • URDU BAZAR
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Lahore’s Elite <br />
              <span className="text-orange-600 font-black">Academic Bookstore.</span>
            </h1>

            <p className="text-sm md:text-lg text-slate-500 leading-relaxed max-w-md">
              The most comprehensive collection of O/A Level topical past papers and FSC textbooks delivered in hours.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
              <button 
                onClick={onShopClick}
                className="bg-orange-600 text-white px-8 py-3.5 rounded-lg font-bold text-sm md:text-base shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all cursor-pointer"
                id="hero-shop-books-btn"
              >
                BROWSE BOOKS
              </button>
              <button 
                onClick={onDownloadClick}
                className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-bold text-sm md:text-base transition-all cursor-pointer flex items-center justify-center gap-2"
                id="hero-download-notes-btn"
              >
                <Download size={16} />
                <span>DOWNLOAD NOTES</span>
              </button>
            </div>

            {/* Quick stats / Features row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-center md:text-left">
              <div>
                <span className="block text-xl md:text-2xl font-black text-orange-600">24 Hours</span>
                <span className="text-[10px] md:text-xs text-slate-400 font-semibold">Lahore Delivery</span>
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-black text-slate-800">100%</span>
                <span className="text-[10px] md:text-xs text-slate-400 font-semibold">Genuine Syllabus</span>
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-black text-slate-800">5,000+</span>
                <span className="text-[10px] md:text-xs text-slate-400 font-semibold">Active Students</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Stack Graphics (Rotated cards) */}
          <div className="md:w-1/2 flex justify-center md:justify-end relative">
            <div className="relative rotate-3 flex gap-4">
              
              {/* AS Physics Card */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 transform hover:scale-105 transition-all duration-300">
                <div className="w-40 h-52 bg-slate-100 rounded-xl flex flex-col justify-between p-4 text-slate-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/50 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[9px] font-extrabold tracking-widest text-slate-400">PHYSICS 2024</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-tight">AS Physics</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Topical Past Papers</p>
                  </div>
                  <span className="text-xs font-black text-orange-600">Rs. 1,250</span>
                </div>
              </div>

              {/* O-Level Maths Card */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 translate-y-8 transform hover:scale-105 transition-all duration-300">
                <div className="w-40 h-52 bg-orange-50 rounded-xl flex flex-col justify-between p-4 text-orange-700 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-150/40 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[9px] font-extrabold tracking-widest text-orange-400">MATHS O LEVEL</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-orange-950 leading-tight">O-Level Maths</h4>
                    <p className="text-[9px] text-orange-500 mt-0.5">Syllabus D solved</p>
                  </div>
                  <span className="text-xs font-black text-orange-600">Rs. 950</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
