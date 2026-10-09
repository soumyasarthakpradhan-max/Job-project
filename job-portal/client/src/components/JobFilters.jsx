import React from 'react';
import { Filter, RotateCcw, DollarSign, Briefcase, Globe, Award } from 'lucide-react';

export default function JobFilters({
  workplaceType,
  setWorkplaceType,
  jobType,
  setJobType,
  experienceLevel,
  setExperienceLevel,
  salaryMin,
  setSalaryMin,
  onResetFilters,
  totalJobsCount
}) {
  const workplaceOptions = ['All', 'Remote', 'Hybrid', 'On-site'];
  const jobTypeOptions = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceOptions = ['All', 'Entry Level', 'Mid Level', 'Senior', 'Lead / Director'];

  const hasActiveFilters =
    workplaceType !== 'All' ||
    jobType !== 'All' ||
    experienceLevel !== 'All' ||
    salaryMin > 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Filter Listings</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Workplace Type */}
      <div>
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Workplace Type</span>
        </label>
        <div className="space-y-1.5">
          {workplaceOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                workplaceType === option
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="workplaceType"
                  value={option}
                  checked={workplaceType === option}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option === 'All' ? 'Any Workplace' : option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          <span>Employment Type</span>
        </label>
        <div className="space-y-1.5">
          {jobTypeOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                jobType === option
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="jobType"
                  value={option}
                  checked={jobType === option}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option === 'All' ? 'All Types' : option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-slate-500" />
          <span>Experience Level</span>
        </label>
        <div className="space-y-1.5">
          {experienceOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                experienceLevel === option
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="experienceLevel"
                  value={option}
                  checked={experienceLevel === option}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option === 'All' ? 'All Experience Levels' : option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Filter */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            <span>Min Salary</span>
          </label>
          <span className="text-xs font-bold text-indigo-600">
            {salaryMin > 0 ? `$${(salaryMin / 1000).toFixed(0)}k+/yr` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={salaryMin}
          onChange={(e) => setSalaryMin(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>$0</span>
          <span>$100k</span>
          <span>$200k+</span>
        </div>
      </div>
    </div>
  );
}
