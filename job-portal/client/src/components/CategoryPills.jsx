import React from 'react';
import { Code, Palette, Layers, BarChart3, Cloud, Megaphone, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Code: Code,
  Palette: Palette,
  Layers: Layers,
  BarChart3: BarChart3,
  Cloud: Cloud,
  Megaphone: Megaphone
};

export default function CategoryPills({
  categories = [],
  selectedCategory,
  onSelectCategory
}) {
  return (
    <div className="py-6 border-b border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Explore by Job Family</h2>
            <p className="text-xs text-slate-500">Pick a domain to filter top matching vacancies</p>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Reset filter</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Code;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
                className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs ring-1 ring-indigo-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate leading-tight">{cat.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{cat.count || 0} Openings</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
