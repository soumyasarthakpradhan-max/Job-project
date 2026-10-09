import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Eye,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function CandidateDashboard({
  currentUser,
  onSelectJob,
  setActiveTab
}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getCandidateApplications(currentUser?.id || 'user-cand-1');
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  const handleWithdraw = async (appId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.withdrawApplication(appId);
      setApplications(prev => prev.filter(a => a.id !== appId));
    } catch (err) {
      alert(err.message || 'Failed to withdraw application');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Offer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Reviewing':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Stats
  const totalApplied = applications.length;
  const inReview = applications.filter(a => a.status === 'Reviewing').length;
  const inInterview = applications.filter(a => a.status === 'Interview').length;
  const offers = applications.filter(a => a.status === 'Offer').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status updates, recruiter communications, and interview schedules for <span className="font-semibold text-slate-700">{currentUser?.name}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('jobs')}
          className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse More Jobs</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalApplied}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Total active entries</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Review</div>
          <div className="text-2xl font-extrabold text-violet-600 mt-1">{inReview}</div>
          <div className="text-[11px] text-violet-600 font-medium mt-1">Recruiter screening</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{inInterview}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">In discussion phase</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Offers Received</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{offers}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Final decisions</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Submitted Applications</h2>
          <span className="text-xs text-slate-400 font-medium">{applications.length} positions</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-base font-semibold text-slate-700">No applications yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't submitted any job applications yet. Explore openings and apply with one click!
            </p>
            <button
              onClick={() => setActiveTab('jobs')}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
            >
              Explore Openings
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Job & Company Info */}
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={app.job?.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.job?.company || 'Company'}`}
                      alt={app.job?.company}
                      className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-200 bg-white shadow-xs shrink-0"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-500">{app.job?.company || 'Unknown Company'}</div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                        {app.job?.title || 'Applied Position'}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1 flex-wrap">
                        <span>{app.job?.location}</span>
                        <span>•</span>
                        <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                        {app.resumeFileName && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 flex items-center">
                              <FileText className="w-3 h-3 mr-0.5" />
                              {app.resumeFileName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center space-x-3 self-end md:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>

                    {app.job && (
                      <button
                        onClick={() => onSelectJob(app.job)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Job Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Withdraw Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recruiter feedback notes if present */}
                {app.notes && (
                  <div className="mt-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-slate-700 flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-indigo-900">Note from Recruiter: </span>
                      <span>{app.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
