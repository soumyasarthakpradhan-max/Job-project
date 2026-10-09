import React from 'react';
import { Briefcase, Bookmark, UserCheck, PlusCircle, Search, Sparkles, Building2, User } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenUserSwitcher,
  onOpenPostJob
}) {
  const isCandidate = currentUser?.role === 'candidate';
  const isEmployer = currentUser?.role === 'employer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('jobs')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Talent<span className="text-indigo-600">Sphere</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                  v2.0
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'jobs'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Explore Jobs</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'categories'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Categories</span>
              </button>

              {isCandidate && (
                <>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                      activeTab === 'applications'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>My Applications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                      activeTab === 'bookmarks'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Saved Jobs</span>
                  </button>
                </>
              )}

              {isEmployer && (
                <button
                  onClick={() => setActiveTab('employer')}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'employer'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Employer Hub</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls & User Info */}
          <div className="flex items-center space-x-3">
            {/* Quick Action Button */}
            {isEmployer ? (
              <button
                onClick={onOpenPostJob}
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-all hover:shadow-md hover:shadow-indigo-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Job</span>
              </button>
            ) : (
              <button
                onClick={onOpenPostJob}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
                title="Switch to employer role or post directly"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </button>
            )}

            {/* Profile & Role Switcher Pill */}
            <button
              onClick={onOpenUserSwitcher}
              className="flex items-center space-x-2.5 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              title="Click to switch role or account"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-white"
              />
              <div className="hidden lg:block text-xs leading-tight">
                <div className="font-semibold text-slate-800 flex items-center space-x-1">
                  <span>{currentUser?.name || 'Guest User'}</span>
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {currentUser?.role === 'employer' ? (
                    <span className="text-purple-600 font-medium">🏢 Employer ({currentUser?.companyName || 'Recruiter'})</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">🎯 Candidate</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                Switch
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu for Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Explore Jobs
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Categories
          </button>
          {isCandidate && (
            <>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                  activeTab === 'applications' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-700'
                }`}
              >
                My Applications
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                  activeTab === 'bookmarks' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Saved Jobs
              </button>
            </>
          )}
          {isEmployer && (
            <button
              onClick={() => setActiveTab('employer')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'employer' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Employer Hub
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
