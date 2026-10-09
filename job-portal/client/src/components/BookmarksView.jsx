import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ArrowRight, Eye, Briefcase } from 'lucide-react';
import { api } from '../services/api';

export default function BookmarksView({
  currentUser,
  onSelectJob,
  onApplyJob,
  setActiveTab
}) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await api.getBookmarks(currentUser?.id || 'user-cand-1');
      setBookmarks(data);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [currentUser]);

  const handleRemove = async (jobId) => {
    try {
      await api.removeBookmark(currentUser?.id || 'user-cand-1', jobId);
      setBookmarks(prev => prev.filter(b => b.job?.id !== jobId));
    } catch (err) {
      alert('Failed to remove bookmark');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Job Openings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Keep track of roles you are interested in applying to later
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
          {bookmarks.length} Bookmarked
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading bookmarks...</div>
        ) : bookmarks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-base font-semibold text-slate-700">No saved jobs yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the bookmark icon on any job card to save opportunities for easy access.
            </p>
            <button
              onClick={() => setActiveTab('jobs')}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
            >
              Explore Job Listings
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookmarks.map(({ bookmarkId, job }) => (
              <div key={bookmarkId} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={job?.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${job?.company || 'Company'}`}
                      alt={job?.company}
                      className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-200 bg-white shrink-0"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-500">{job?.company}</div>
                      <h3
                        onClick={() => onSelectJob(job)}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer mt-0.5"
                      >
                        {job?.title}
                      </h3>
                      <div className="flex items-center space-x-2.5 text-xs text-slate-400 mt-1">
                        <span>{job?.location}</span>
                        <span>•</span>
                        <span>{job?.workplaceType}</span>
                        <span>•</span>
                        <span>{job?.jobType}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">
                          ${Math.round(job?.salaryMin / 1000)}k - ${Math.round(job?.salaryMax / 1000)}k
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onApplyJob(job)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center space-x-1"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleRemove(job.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
