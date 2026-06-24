import React, { useState } from 'react';
import { Download, FileText, CheckCircle, Eye, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface NoteItem {
  id: string;
  title: string;
  subject: string;
  category: 'O Level' | 'A Level' | 'FSC' | 'Matric';
  author: string;
  downloads: number;
  previewPages: string[];
  fullSummary: string;
}

const SAMPLE_NOTES: NoteItem[] = [
  {
    id: 'note-o-chem',
    title: 'Chemistry Organic Reactions Cheat Sheet',
    subject: 'Chemistry',
    category: 'O Level',
    author: 'Sir Ali Raza',
    downloads: 1420,
    previewPages: [
      'Page 1: Introduction to Alkanes & Alkenes. Saturated vs Unsaturated hydrocarbons.',
      'Page 2: Combustion, Substitution reactions of Alkanes (UV light condition is mandatory!).',
      'Page 3: Addition reactions of Alkenes: Hydrogenation (Nickel catalyst, 150°C), Bromination (test for unsaturation).',
      'Page 4: Alcohols & Carboxylic Acids: Oxidation of Ethanol using acidified K2Cr2O7 to produce Ethanoic Acid.'
    ],
    fullSummary: 'An absolute lifesaver for O-Level Chemistry (5070) candidates. This handwritten-style sheet summarizes all organic conversions, catalysts, temperature constraints, and color indicators in a single flow diagram.'
  },
  {
    id: 'note-o-isl',
    title: 'Top 10 High-Yield Hadith Commentaries',
    subject: 'Islamiyat',
    category: 'O Level',
    author: 'Sir Fiaz Ahmad',
    downloads: 2310,
    previewPages: [
      'Hadith 1: "Religion is sincerity..." - Focuses on sincerity to Allah, His Book, His Messenger, and the leaders.',
      'Hadith 2: "None of you believes until he wants for his brother..." - Emphasizes communal responsibility and brotherhood in Lahore society.',
      'Hadith 3: "Whosoever sees an evil..." - Detailed action path for correcting wrongdoings using hands, tongue, or heart.'
    ],
    fullSummary: 'Fully solved and graded commentaries of CAIE high-frequency Hadiths. Contains perfect template structures matching the 4+4 mark allocation format including historical context and modern applications.'
  },
  {
    id: 'note-fsc-phy',
    title: 'Intermediate Physics Chapter 12: Electrostatics Numerical Guides',
    subject: 'Physics',
    category: 'FSC',
    author: 'Prof. M. Rafiq',
    downloads: 1840,
    previewPages: [
      'Formula Sheet: Coulomb Law F = k(q1.q2)/r², Electric Field Intensity E = F/q, Gauss Law Φ = q/ε₀.',
      'Numerical 12.1 Solved: Calculation of electrostatic force between two helium nuclei separated by 10⁻¹⁵m.',
      'Numerical 12.3 Solved: Electric field intensity inside a hollow charged metal sphere.'
    ],
    fullSummary: 'Detailed handwritten key step-by-step solutions to the toughest numerical examples in PTB FSC Physics Part I. Each solution notes common mathematical pitfalls and includes diagram setups.'
  },
  {
    id: 'note-a-bio',
    title: 'AS Level Biology Cell Structure Quick Review',
    subject: 'Biology',
    category: 'A Level',
    author: 'Ali Books Editorial Board',
    downloads: 980,
    previewPages: [
      'Cell organelles: Structure & function of Nucleus, Rough ER, Smooth ER, Mitochondria, and Ribosomes.',
      'Comparison: Eukaryotic vs Prokaryotic cell structures under high-magnification electron microscopes.',
      'Key drawing criteria: How to correctly label cellular slides for CAIE Practical Paper 3.'
    ],
    fullSummary: 'High-yield conceptual summaries of AS Cell Biology. Specially tailored to cover marking scheme requirements for magnification calculation formulas and organelle diameter questions.'
  }
];

export default function NotesDownloadCenter() {
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const startDownload = (note: NoteItem) => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadSuccess(note.id);
          setTimeout(() => {
            setDownloadSuccess(null);
            setDownloadProgress(null);
          }, 2500);
          return null;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <section className="bg-orange-50/40 border-y border-orange-100 py-16" id="notes-download-center">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-600 font-bold uppercase tracking-wider text-xs">🎓 Free Academic Library</span>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-1">Handwritten Notes & Study Center</h2>
          <p className="text-gray-500 mt-2">
            Instant digital previews & verified PDF downloads curated by Lahore’s prominent academic educators.
          </p>
        </div>

        {!selectedNote ? (
          /* LIST OF NOTES */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_NOTES.map((note) => (
              <div 
                key={note.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">
                      {note.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Download size={12} /> {note.downloads} dls
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">Subject: <strong className="text-gray-700">{note.subject}</strong></p>
                  <p className="text-xs text-gray-500 italic">By {note.author}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedNote(note)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    id={`preview-note-${note.id}`}
                  >
                    <Eye size={14} />
                    <span>Read Preview</span>
                  </button>

                  <button 
                    onClick={() => startDownload(note)}
                    disabled={downloadProgress !== null}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    id={`download-note-${note.id}`}
                  >
                    <Download size={14} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DETAILED NOTE PREVIEWER */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto"
          >
            {/* Header / Nav */}
            <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button 
                onClick={() => setSelectedNote(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
                id="back-notes-list-btn"
              >
                <ArrowLeft size={16} />
                <span>Back to Library</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedNote.category}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedNote.subject}
                </span>
              </div>
            </div>

            {/* Main Interactive Reader Layout */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Note Details Side */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">
                    {selectedNote.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Solved & Prepared by {selectedNote.author}</p>
                </div>

                <div className="space-y-4 text-xs text-gray-600">
                  <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100/50">
                    <p className="font-bold text-orange-700 flex items-center gap-1.5 mb-1">
                      <BookOpen size={14} /> Teacher Commentary:
                    </p>
                    <p className="leading-relaxed">{selectedNote.fullSummary}</p>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>Target Syllabus:</span>
                    <strong className="text-gray-800">CIE / Punjab Board</strong>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>File Type:</span>
                    <strong className="text-gray-800">Printable PDF</strong>
                  </div>
                </div>

                {/* Download CTA */}
                <div className="pt-4">
                  {downloadProgress !== null ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-orange-600">Generating Secure PDF...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    </div>
                  ) : downloadSuccess === selectedNote.id ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold border border-emerald-200">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <span>PDF Downloaded! Saved to device.</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startDownload(selectedNote)}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="reader-download-pdf-btn"
                    >
                      <Download size={16} />
                      <span>Download High-Resolution PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview Page Content Reader */}
              <div className="md:col-span-2 bg-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-inner min-h-[350px] flex flex-col justify-between">
                <div className="border-b border-zinc-700 pb-3 flex justify-between items-center text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} className="text-orange-500" />
                    Interactive PDF Notebook (Preview Mode)
                  </span>
                  <span>Lahore Urdu Bazar Library</span>
                </div>

                <div className="my-6 space-y-4">
                  {selectedNote.previewPages.map((page, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-zinc-900/60 rounded-xl border-l-4 border-orange-500 font-mono text-xs text-zinc-300 leading-relaxed shadow-xs"
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-700 pt-3 text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1">
                  <AlertCircle size={10} />
                  Complete solved notes are unlocked in the printed package. Order today!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
