import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileText,
  Mail,
  Phone,
  Filter,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function EmployerDashboard({
  currentUser,
  onOpenPostJobModal,
  onSelectJob
}) {
  const [activeSubTab, setActiveSubTab] = useState('jobs'); // 'jobs' | 'applicants' | 'post'
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Quick note editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Fetch employer's jobs & applicants
  const loadData = async () => {
    try {
      setLoading(true);
      const employerId = currentUser?.id || 'user-emp-1';
      const jobsRes = await api.getJobs({ employerId });
      const appsRes = await api.getEmployerApplications(employerId);
      setJobs(jobsRes.jobs || []);
      setApplicants(appsRes || []);
    } catch (err) {
      console.error('Error fetching employer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Handle changing applicant status
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, newStatus);
      setApplicants(prev =>
        prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Handle saving recruiter note
  const handleSaveNote = async (appId) => {
    try {
      await api.updateApplicationStatus(appId, undefined, noteText);
      setApplicants(prev =>
        prev.map(a => (a.id === appId ? { ...a, notes: noteText } : a))
      );
      setEditingNoteId(null);
      setNoteText('');
    } catch (err) {
      alert(err.message || 'Failed to save note');
    }
  };

  // Handle deleting a job
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting? All applicants for this job will also be removed.')) return;
    try {
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setApplicants(prev => prev.filter(a => a.jobId !== jobId));
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  // Handle toggle active/closed status
  const handleToggleJobStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await api.updateJob(job.id, { status: newStatus });
      setJobs(prev =>
        prev.map(j => (j.id === job.id ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      alert(err.message || 'Failed to update job status');
    }
  };

  // Filtered applicants
  const filteredApplicants =
    selectedJobFilter === 'All'
      ? applicants
      : applicants.filter(a => a.jobId === selectedJobFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Offer':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Reviewing':
        return 'bg-violet-50 text-violet-700 border-violet-300';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Employer Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{currentUser?.companyName || 'Hiring Dashboard'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Talent Acquisition Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your open job requisitions, review candidates, and conduct screening workflows.
          </p>
        </div>

        <button
          onClick={onOpenPostJobModal}
          className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Postings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {jobs.filter(j => j.status === 'active').length}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">{jobs.length} total created</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Candidates</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{applicants.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Across all requisitions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Review</div>
          <div className="text-2xl font-extrabold text-violet-600 mt-1">
            {applicants.filter(a => a.status === 'Reviewing').length}
          </div>
          <div className="text-[11px] text-violet-600 font-medium mt-1">Awaiting decision</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {applicants.filter(a => a.status === 'Interview').length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Scheduled / in-progress</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('jobs')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center space-x-2 ${
            activeSubTab === 'jobs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Job Postings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('applicants')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center space-x-2 ${
            activeSubTab === 'applicants'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Applicant Pipeline ({applicants.length})</span>
        </button>
      </div>

      {/* TAB 1: JOBS LIST */}
      {activeSubTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Open Requisitions</h2>
            <span className="text-xs text-slate-500 font-medium">{jobs.length} total listings</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-base font-semibold text-slate-700">No jobs posted yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Get started by creating your first job opening to attract top engineers and designers.
              </p>
              <button
                onClick={onOpenPostJobModal}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
              >
                Create Job Requisition
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            job.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        <span className="text-xs font-semibold text-slate-500 capitalize">{job.status}</span>
                        {job.featured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectJob(job)}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer mt-1"
                      >
                        {job.title}
                      </h3>

                      <div className="flex items-center space-x-2.5 text-xs text-slate-400 mt-1 flex-wrap">
                        <span>{job.location} ({job.workplaceType})</span>
                        <span>•</span>
                        <span>{job.category}</span>
                        <span>•</span>
                        <span>{job.jobType}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-600">
                          {job.applicantsCount || 0} Applicants
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 self-end md:self-center">
                      <button
                        onClick={() => {
                          setSelectedJobFilter(job.id);
                          setActiveSubTab('applicants');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        View {job.applicantsCount || 0} Applicants
                      </button>

                      <button
                        onClick={() => handleToggleJobStatus(job)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          job.status === 'active'
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {job.status === 'active' ? 'Close Job' : 'Reactivate'}
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete listing"
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
      )}

      {/* TAB 2: APPLICANTS PIPELINE */}
      {activeSubTab === 'applicants' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4">
          {/* Header & Filter by Job */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Candidate Pipeline & Review</h2>
              <p className="text-xs text-slate-500">Update hiring stage, record feedback notes, and inspect resumes.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Filter by requisition:</span>
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Jobs ({applicants.length})</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplicants.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No candidates found matching the selected requisition.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredApplicants.map((app) => (
                <div key={app.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Candidate Details */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{app.candidateName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        {app.candidateHeadline || 'Candidate'} • Applied for{' '}
                        <span className="font-bold text-slate-800">{app.jobTitle}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <a href={`mailto:${app.candidateEmail}`} className="hover:underline text-indigo-600">
                            {app.candidateEmail}
                          </a>
                        </span>
                        {app.candidatePhone && (
                          <span className="flex items-center">
                            <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {app.candidatePhone}
                          </span>
                        )}
                        {app.portfolioUrl && (
                          <span className="flex items-center">
                            <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <a
                              href={app.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              Portfolio / GitHub
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hiring Stage Dropdown */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-semibold">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${getStatusColor(app.status)}`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Resume</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Candidate Cover Note */}
                  {app.coverNote && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/60">
                      <span className="font-semibold text-slate-800">Candidate Statement: </span>
                      "{app.coverNote}"
                    </div>
                  )}

                  {/* Recruiter Private Notes */}
                  <div className="pt-1 flex items-center space-x-2 text-xs">
                    {editingNoteId === app.id ? (
                      <div className="flex items-center space-x-2 w-full">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add private evaluation notes..."
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleSaveNote(app.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2 py-1.5 text-slate-500 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-500">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600">
                          {app.notes ? (
                            <span className="italic text-slate-700">"{app.notes}"</span>
                          ) : (
                            <span className="text-slate-400">No evaluation notes yet.</span>
                          )}
                        </span>
                        <button
                          onClick={() => {
                            setEditingNoteId(app.id);
                            setNoteText(app.notes || '');
                          }}
                          className="text-indigo-600 hover:underline font-semibold ml-2"
                        >
                          {app.notes ? 'Edit Note' : '+ Add Note'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
