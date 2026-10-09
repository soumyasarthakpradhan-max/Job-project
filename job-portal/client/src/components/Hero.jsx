import React from 'react';
import { Search, MapPin, Briefcase, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  onSearchSubmit,
  stats
}) {
  const popularKeywords = ['React', 'Remote', 'Product Designer', 'AI Engineer', 'DevOps', 'Full-time'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-20 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-violet-600 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-800/60 border border-indigo-700/50 text-indigo-200 text-xs font-medium shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Tech, Design & Leadership Opportunities</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Where Top Companies <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-violet-300">
            Hire Exceptional Talent
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
          Discover verified engineering, design, and product roles at world-class companies. Apply in seconds with zero friction.
        </p>

        {/* Interactive Search Bar Box */}
        <div className="mt-8 max-w-4xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl shadow-indigo-950/60 border border-slate-200/20 text-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit?.();
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3"
          >
            {/* Keyword Input */}
            <div className="md:col-span-5 flex items-center px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Job title, keyword, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Location Input */}
            <div className="md:col-span-3 flex items-center px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, SF)..."
                value={locationFilter === 'All' ? '' : locationFilter}
                onChange={(e) => setLocationFilter(e.target.value || 'All')}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-2 flex items-center px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-full min-h-[42px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Keywords Pill row */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400 flex items-center mr-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              Popular:
            </span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setSearchTerm(kw)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Live Metrics Counters */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto text-left">
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats?.totalJobs || '10+'}</div>
              <div className="text-[11px] text-slate-300">Active Openings</div>
            </div>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats?.totalCompanies || '8+'}</div>
              <div className="text-[11px] text-slate-300">Verified Companies</div>
            </div>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-center space-x-3">
            <div className="p-2 bg-violet-500/20 text-violet-300 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">48 hrs</div>
              <div className="text-[11px] text-slate-300">Avg. Response Time</div>
            </div>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">$160k+</div>
              <div className="text-[11px] text-slate-300">Competitive Salaries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
