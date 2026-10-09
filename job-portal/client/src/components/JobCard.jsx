import React from 'react';
import { MapPin, DollarSign, Bookmark, ArrowRight, CheckCircle2, Sparkles, Users, Clock } from 'lucide-react';

export default function JobCard({
  job,
  onSelectJob,
  onApplyJob,
  isBookmarked,
  onToggleBookmark,
  hasApplied
}) {
  // Format salary
  const formatSalary = (min, max, cur = 'USD') => {
    if (!min && !max) return 'Competitive';
    const minK = min ? Math.round(min / 1000) : null;
    const maxK = max ? Math.round(max / 1000) : null;
    if (minK && maxK) return `$${minK}k - $${maxK}k`;
    if (minK) return `From $${minK}k`;
    return `Up to $${maxK}k`;
  };

  // Workplace badge style
  const getWorkplaceBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'hybrid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on-site':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:border-indigo-300 ${
        job.featured ? 'border-indigo-200 ring-1 ring-indigo-100 bg-gradient-to-b from-indigo-50/20 to-white' : 'border-slate-200/90'
      }`}
    >
      {/* Top row: Company info, badges, bookmark button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5 min-w-0">
          <img
            src={job.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company}`}
            alt={job.company}
            className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 bg-white shadow-xs shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                {job.company}
              </span>
              {job.featured && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            <h3
              onClick={() => onSelectJob(job)}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer mt-0.5 truncate group-hover:text-indigo-600"
            >
              {job.title}
            </h3>
          </div>
        </div>

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(job.id);
          }}
          className={`p-2 rounded-xl border transition-colors shrink-0 ${
            isBookmarked
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Save job'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Meta tags: Location, Workplace, Salary, Category */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center text-slate-500">
          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
          <span>{job.location}</span>
        </div>

        <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${getWorkplaceBadge(job.workplaceType)}`}>
          {job.workplaceType}
        </span>

        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
          {job.jobType}
        </span>

        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
          {job.experienceLevel}
        </span>
      </div>

      {/* Job Description preview snippet */}
      <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Requirements / skills chips */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.requirements.slice(0, 3).map((req, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/60 max-w-[220px] truncate"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 3 && (
            <span className="text-[11px] px-1.5 py-0.5 text-slate-400 font-medium">
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900 flex items-center">
            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
            <span className="text-[10px] text-slate-400 font-normal ml-1">/year</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-0.5" />
              {job.applicantsCount || 0} applicants
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasApplied ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Applied</span>
            </span>
          ) : (
            <>
              <button
                onClick={() => onSelectJob(job)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => onApplyJob(job)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-all flex items-center space-x-1 group/btn"
              >
                <span>Apply</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
