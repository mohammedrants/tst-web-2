import React from 'react';
import { BookOpen, Award, FileText, PenTool, Brain, Atom, Calculator, Notebook } from 'lucide-react';
import { Book } from '../types';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookCover({ book, size = 'md' }: BookCoverProps) {
  // Select icon based on book title or subcategory
  const getIcon = () => {
    const title = book.title.toLowerCase();
    if (title.includes('physics') || title.includes('atom')) {
      return <Atom className="text-white/80 w-1/3 h-1/3" />;
    }
    if (title.includes('math') || title.includes('calculator')) {
      return <Calculator className="text-white/80 w-1/3 h-1/3" />;
    }
    if (title.includes('biology') || title.includes('chemistry')) {
      return <Brain className="text-white/80 w-1/3 h-1/3" />;
    }
    if (book.type === 'Notes') {
      return <FileText className="text-white/80 w-1/3 h-1/3" />;
    }
    if (book.category === 'stationery') {
      return <Notebook className="text-white/80 w-1/3 h-1/3" />;
    }
    return <BookOpen className="text-white/80 w-1/3 h-1/3" />;
  };

  const getSubTitle = () => {
    if (book.category === 'o-level') return 'CAMBRIDGE O LEVEL';
    if (book.category === 'a-level') return 'CAMBRIDGE A LEVEL';
    if (book.category === 'fsc') return 'PUNJAB BOARD - FSC / INTER';
    if (book.category === 'matric') return 'BISE LAHORE - MATRIC';
    return 'PREMIUM STUDENT COLLECTION';
  };

  const sizeClasses = {
    sm: 'h-40 w-28 max-w-full text-[9px]',
    md: 'h-44 w-30 xs:h-52 xs:w-36 sm:h-64 sm:w-48 max-w-full text-[9px] xs:text-[10px] sm:text-[12px]',
    lg: 'h-64 w-44 sm:h-80 sm:w-60 max-w-full text-xs sm:text-sm'
  };

  const titleSize = {
    sm: 'text-xs font-bold leading-tight line-clamp-3',
    md: 'text-base font-bold leading-tight line-clamp-3',
    lg: 'text-xl font-bold leading-tight line-clamp-4'
  };

  const isImageUrl = book.image && (
    book.image.startsWith('http://') || 
    book.image.startsWith('https://') || 
    book.image.startsWith('/') || 
    book.image.startsWith('data:')
  );

  return (
    <div 
      className={`relative ${sizeClasses[size]} rounded-r-lg overflow-hidden shadow-md flex flex-col justify-between ${
        isImageUrl ? 'bg-slate-100' : (book.image || 'bg-orange-600')
      } text-white transition-all duration-300 select-none group-hover:shadow-lg`}
      id={`book-cover-${book.id}`}
    >
      {/* 3D Spine Fold shadow */}
      <div className="absolute top-0 left-0 bottom-0 w-3 bg-black/15 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.2)] z-15" />
      {/* Highlight/Glint overlay */}
      <div className="absolute top-0 left-3 bottom-0 w-1.5 bg-white/10 z-15" />

      {isImageUrl ? (
        <>
          {/* Actual book cover image */}
          <img 
            src={book.image} 
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover rounded-r-lg"
            referrerPolicy="no-referrer"
          />
          {/* Slight shadow/fade overlay on the bottom of the image for readability if needed, but since we only show image we don't need text */}
        </>
      ) : (
        <>
          {/* Header section of Book */}
          <div className="z-10 text-center uppercase tracking-widest font-semibold opacity-75 text-[8px] md:text-[9px]">
            {getSubTitle()}
          </div>

          {/* Central Emblem */}
          <div className="z-10 flex flex-col items-center justify-center my-2 opacity-80 transition-transform duration-300 group-hover:scale-105">
            <div className="p-3 bg-white/10 rounded-full border border-white/20 shadow-inner">
              {getIcon()}
            </div>
          </div>

          {/* Title & Author Info */}
          <div className="z-10 flex flex-col space-y-1 md:space-y-2 mt-auto">
            <h4 className={`${titleSize[size]} font-semibold text-center tracking-tight border-b border-white/20 pb-2`}>
              {book.title}
            </h4>
            <div className="flex justify-between items-center text-[8px] md:text-[10px] opacity-90 font-medium">
              <span className="truncate max-w-[70%]">{book.author}</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase font-bold">
                {book.type}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Paper texture feel overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none z-10" />
    </div>
  );
}
