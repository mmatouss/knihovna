import React, { useState } from 'react';
import { PlusCircle, BookOpen, AlertCircle } from 'lucide-react';

interface ManualEntryProps {
  onAddIsbn: (isbn: string) => void;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({ onAddIsbn }) => {
  const [isbnInput, setIsbnInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cleanIsbn = (val: string) => {
    // Remove characters other than numbers and 'X'/'x'
    return val.replace(/[^0-9Xx]/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleaned = cleanIsbn(isbnInput);

    if (!cleaned) {
      setError('Zadejte prosím číslo ISBN.');
      return;
    }

    if (cleaned.length !== 10 && cleaned.length !== 13) {
      setError('ISBN kód by měl mít 10 nebo 13 číslic.');
    }

    onAddIsbn(cleaned);
    setIsbnInput('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-emerald-600" />
        Ruční zadání ISBN
      </h2>
      <p className="text-xs text-slate-500 mb-3">
        Pro starší knihy bez čárového kódu zadajte číslo ISBN ručně:
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={isbnInput}
            onChange={(e) => {
              setIsbnInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="např. 978-80-204-1234-5 nebo 9788020412345"
            className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl text-sm transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Přidat
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};
