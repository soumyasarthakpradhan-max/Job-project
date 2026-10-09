import React from 'react';
import {
  X,
  MapPin,
  DollarSign,
  Building2,
  Briefcase,
  Calendar,
  Bookmark,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Share2,
  Sparkles
} from 'lucide-react';

export default function JobDetailModal({
  job,
  onClose,
  onApply,
  isBookmarked,
  onToggleBookmark,
  hasApplied,
  onSelectRelatedJob
}) {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive Compensation';
    const minK = min ? Math.round(min / 1000) : null;
    const maxK = max ? Math.round(max / 1000) : null;
    if (minK && maxK) return `$${minK},000 - $${maxK},000`;
    if (minK) return `From $${minK},000`;
    return `Up to $${maxK},000`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <div className="flex items-start space-x-4">
            <img
              src={job.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company}`}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-contain p-2 border border-slate-200 bg-white shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-700">{job.company}</span>
                {job.featured && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{job.title}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.location} ({job.workplaceType})
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.jobType}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.applicantsCount || 0} applied
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Share job"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Compensation</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{formatSalary(job.salaryMin, job.salaryMax)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Experience</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.experienceLevel || 'Mid Level'}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Job Domain</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.category}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Work Setting</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.workplaceType}</div>
            </div>
          </div>

          {/* Role Overview */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About This Role</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Qualifications & Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Benefits & Perks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-medium">
                    ✨ {benefit}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Jobs */}
          {job.relatedJobs && job.relatedJobs.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Similar Roles in {job.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.relatedJobs.map((relJob) => (
                  <div
                    key={relJob.id}
                    onClick={() => onSelectRelatedJob(relJob)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="text-xs font-bold text-slate-800 truncate">{relJob.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{relJob.company} • {relJob.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Fixed Action Strip */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={() => onToggleBookmark(job.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save for Later'}</span>
          </button>

          <div className="flex items-center space-x-3">
            {hasApplied ? (
              <span className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                <span>Apply for this Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
