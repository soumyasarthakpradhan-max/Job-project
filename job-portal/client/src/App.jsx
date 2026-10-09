import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryPills from './components/CategoryPills';
import JobFilters from './components/JobFilters';
import JobCard from './components/JobCard';
import JobDetailModal from './components/JobDetailModal';
import ApplyModal from './components/ApplyModal';
import CandidateDashboard from './components/CandidateDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import BookmarksView from './components/BookmarksView';
import PostJobModal from './components/PostJobModal';
import UserSwitcherModal from './components/UserSwitcherModal';
import Toast from './components/Toast';
import { api } from './services/api';
import {
  Briefcase,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  Heart,
  Globe,
  CheckCircle2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'categories' | 'applications' | 'bookmarks' | 'employer'
  const [currentUser, setCurrentUser] = useState(null);

  // Data State
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [workplaceType, setWorkplaceType] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [salaryMin, setSalaryMin] = useState(0);
  const [sort, setSort] = useState('featured');

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [toast, setToast] = useState(null);

  // Initialize users and default current user
  useEffect(() => {
    const initUser = async () => {
      try {
        const users = await api.getUsers();
        if (users && users.length > 0) {
          setCurrentUser(users[0]); // Alex Morgan (candidate)
        }
      } catch (err) {
        console.error('Failed to init users:', err);
      }
    };
    initUser();
  }, []);

  // Load Categories & Portal Stats
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, st] = await Promise.all([
          api.getCategories(),
          api.getStats()
        ]);
        setCategories(cats);
        setStats(st);
      } catch (err) {
        console.error('Failed to load categories/stats:', err);
      }
    };
    loadMetadata();
  }, []);

  // Load Bookmarks & Applied Jobs for current user
  useEffect(() => {
    if (!currentUser) return;
    const loadUserData = async () => {
      try {
        const [bmarks, userApps] = await Promise.all([
          api.getBookmarks(currentUser.id),
          api.getCandidateApplications(currentUser.id)
        ]);
        setBookmarkedIds(new Set(bmarks.map(b => b.job?.id).filter(Boolean)));
        setAppliedJobIds(new Set(userApps.map(a => a.jobId)));
      } catch (err) {
        console.error('Failed to load user bookmarks/apps:', err);
      }
    };
    loadUserData();
  }, [currentUser]);

  // Load Jobs with active filters
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.getJobs({
        search: searchTerm,
        category: categoryFilter,
        location: locationFilter,
        workplaceType,
        jobType,
        experienceLevel,
        salaryMin: salaryMin > 0 ? salaryMin : undefined,
        sort
      });
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [categoryFilter, workplaceType, jobType, experienceLevel, salaryMin, sort]);

  // Handle Search submit
  const handleSearchSubmit = () => {
    fetchJobs();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('All');
    setCategoryFilter('All');
    setWorkplaceType('All');
    setJobType('All');
    setExperienceLevel('All');
    setSalaryMin(0);
    setSort('featured');
    setTimeout(fetchJobs, 10);
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (jobId) => {
    if (!currentUser) {
      setShowUserSwitcher(true);
      return;
    }

    const isSaved = bookmarkedIds.has(jobId);
    try {
      if (isSaved) {
        await api.removeBookmark(currentUser.id, jobId);
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        setToast({ message: 'Removed from saved jobs', type: 'info' });
      } else {
        await api.saveBookmark(currentUser.id, jobId);
        setBookmarkedIds(prev => new Set(prev).add(jobId));
        setToast({ message: 'Job saved to your bookmarks!', type: 'success' });
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  // Handle application success
  const handleApplicationSuccess = (jobId) => {
    setAppliedJobIds(prev => new Set(prev).add(jobId));
    setToast({ message: 'Application submitted successfully!', type: 'success' });
    fetchJobs(); // refresh counts
  };

  // Handle job created
  const handleJobCreated = (newJob) => {
    setToast({ message: `Job "${newJob.title}" published successfully!`, type: 'success' });
    fetchJobs();
    if (currentUser?.role === 'employer') {
      setActiveTab('employer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenUserSwitcher={() => setShowUserSwitcher(true)}
        onOpenPostJob={() => setShowPostJobModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: EXPLORE JOBS (DEFAULT) */}
        {activeTab === 'jobs' && (
          <div>
            {/* Hero Banner with Search */}
            <Hero
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
              onSearchSubmit={handleSearchSubmit}
              stats={stats}
            />

            {/* Quick Category Selector Strip */}
            <CategoryPills
              categories={categories}
              selectedCategory={categoryFilter}
              onSelectCategory={(cat) => setCategoryFilter(cat)}
            />

            {/* Main Listings Body with Sidebar Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar Filters */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <JobFilters
                      workplaceType={workplaceType}
                      setWorkplaceType={setWorkplaceType}
                      jobType={jobType}
                      setJobType={setJobType}
                      experienceLevel={experienceLevel}
                      setExperienceLevel={setExperienceLevel}
                      salaryMin={salaryMin}
                      setSalaryMin={setSalaryMin}
                      onResetFilters={handleResetFilters}
                      totalJobsCount={jobs.length}
                    />
                  </div>
                </div>

                {/* Right Listings Column */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Sorting & Result Count Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="text-xs sm:text-sm text-slate-600 font-medium">
                      Showing <span className="font-bold text-slate-900">{jobs.length}</span> positions available
                      {categoryFilter !== 'All' && <span> in <span className="text-indigo-600 font-semibold">{categoryFilter}</span></span>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400 font-medium flex items-center">
                        <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                        Sort by:
                      </span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="featured">Featured & Newest</option>
                        <option value="salary-high">Highest Salary</option>
                        <option value="salary-low">Lowest Salary</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                  </div>

                  {/* Listings Grid */}
                  {loading ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <div className="text-sm font-semibold text-slate-700">Loading open opportunities...</div>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                      <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                      <h3 className="text-base font-bold text-slate-800">No matching jobs found</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try clearing some filters or searching for broader terms like "Software" or "Design".
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Filters</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {jobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onSelectJob={(j) => setSelectedJob(j)}
                          onApplyJob={(j) => setApplyingJob(j)}
                          isBookmarked={bookmarkedIds.has(job.id)}
                          onToggleBookmark={handleToggleBookmark}
                          hasApplied={appliedJobIds.has(job.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CATEGORIES BREAKDOWN */}
        {activeTab === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900">Explore by Specialty</h1>
              <p className="text-sm text-slate-600">
                Browse positions tailored across key technology and business verticals
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => {
                    setCategoryFilter(cat.name);
                    setActiveTab('jobs');
                  }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Explore high-impact positions with competitive compensation and remote flexibility.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>{cat.count} Open Requisitions</span>
                    <span>Browse &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: CANDIDATE DASHBOARD */}
        {activeTab === 'applications' && (
          <CandidateDashboard
            currentUser={currentUser}
            onSelectJob={(j) => setSelectedJob(j)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 4: SAVED JOBS */}
        {activeTab === 'bookmarks' && (
          <BookmarksView
            currentUser={currentUser}
            onSelectJob={(j) => setSelectedJob(j)}
            onApplyJob={(j) => setApplyingJob(j)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 5: EMPLOYER HUB */}
        {activeTab === 'employer' && (
          <EmployerDashboard
            currentUser={currentUser}
            onOpenPostJobModal={() => setShowPostJobModal(true)}
            onSelectJob={(j) => setSelectedJob(j)}
          />
        )}
      </main>

      {/* Global Modals */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={(j) => setApplyingJob(j)}
          isBookmarked={bookmarkedIds.has(selectedJob.id)}
          onToggleBookmark={handleToggleBookmark}
          hasApplied={appliedJobIds.has(selectedJob.id)}
          onSelectRelatedJob={(rj) => setSelectedJob(rj)}
        />
      )}

      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          currentUser={currentUser}
          onClose={() => setApplyingJob(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {showPostJobModal && (
        <PostJobModal
          currentUser={currentUser}
          categories={categories}
          onClose={() => setShowPostJobModal(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      {showUserSwitcher && (
        <UserSwitcherModal
          currentUser={currentUser}
          onSelectUser={(u) => {
            setCurrentUser(u);
            if (u.role === 'employer') {
              setActiveTab('employer');
            } else {
              setActiveTab('jobs');
            }
          }}
          onClose={() => setShowUserSwitcher(false)}
        />
      )}

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">TalentSphere</span>
            <span>— Next-Generation Career & Talent Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUserSwitcher(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Demo Role Switcher
            </button>
            <span>•</span>
            <span>REST API Active</span>
            <span>•</span>
            <span>JSON Database Synced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
