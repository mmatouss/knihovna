import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ManualEntry } from './components/ManualEntry';
import { IsbnList, IsbnItem } from './components/IsbnList';
import { Library, BookMarked, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'librarian_isbn_list_v1';

export function App() {
  const [isbnList, setIsbnList] = useState<IsbnItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load saved items from localStorage:', e);
      return [];
    }
  });

  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isbnList));
    } catch (e) {
      console.error('Failed to save items to localStorage:', e);
    }
  }, [isbnList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddIsbn = (isbn: string) => {
    const newItem: IsbnItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isbn,
      timestamp: Date.now(),
    };

    setIsbnList((prev) => [newItem, ...prev]);
    showToast(`ISBN ${isbn} bylo úspěšně přidáno`);
  };

  const handleDeleteItem = (id: string) => {
    setIsbnList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setIsbnList([]);
    showToast('Seznam ISBN byl vymazán');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      {/* Toast feedback notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Library className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight m-0 text-white">Knihovní skener ISBN</h1>
              <p className="text-xs text-slate-400 m-0">Aplikace pro správy knihovny</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <BookMarked className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">{isbnList.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-4">
        {/* Barcode Camera Scanner */}
        <BarcodeScanner
          onScan={handleAddIsbn}
          isScanning={isScanning}
          setIsScanning={setIsScanning}
        />

        {/* Manual ISBN Entry */}
        <ManualEntry onAddIsbn={handleAddIsbn} />

        {/* Saved List */}
        <IsbnList
          items={isbnList}
          onDeleteItem={handleDeleteItem}
          onClearAll={handleClearAll}
        />
      </main>
    </div>
  );
}

export default App;
