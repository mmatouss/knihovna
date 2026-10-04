import React from 'react';
import { Trash2, ListFilter, Hash, Clock, AlertTriangle } from 'lucide-react';

export interface IsbnItem {
  id: string;
  isbn: string;
  timestamp: number;
}

interface IsbnListProps {
  items: IsbnItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const IsbnList: React.FC<IsbnListProps> = ({
  items,
  onDeleteItem,
  onClearAll,
}) => {
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            Seznam ISBN
          </h2>
          <span className="ml-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full border border-indigo-200">
            {items.length}
          </span>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Opravdu chcete vymazat celý seznam ISBN?')) {
                onClearAll();
              }
            }}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vymazat vše
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
          <Hash className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">Zatím žádná naskenovaná ISBN</p>
          <p className="text-xs text-slate-400 mt-1">
            Naskenujte čárový kód pomocí kamery nebo zadejte číslo ručně.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium text-slate-400 w-6 text-right">
                  {items.length - index}.
                </span>
                <div>
                  <div className="font-mono font-bold text-slate-800 text-base tracking-wider">
                    {item.isbn}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-80 group-hover:opacity-100 cursor-pointer"
                title="Smazat položku"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
