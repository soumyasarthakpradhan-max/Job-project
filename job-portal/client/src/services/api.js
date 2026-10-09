const API_BASE = '/api';

export const api = {
  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'All') {
        query.append(key, value);
      }
    });
    const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getJobById(id) {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    return res.json();
  },

  async createJob(jobData) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create job');
    }
    return res.json();
  },

  async updateJob(id, jobData) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error('Failed to update job');
    return res.json();
  },

  async deleteJob(id) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete job');
    return res.json();
  },

  // Applications
  async submitApplication(formData) {
    // If formData is an instance of FormData, send as multipart; else send as JSON
    const isFormData = formData instanceof FormData;
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? formData : JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit application');
    }
    return data;
  },

  async getCandidateApplications(candidateId) {
    const res = await fetch(`${API_BASE}/applications/candidate/${candidateId}`);
    if (!res.ok) throw new Error('Failed to fetch candidate applications');
    return res.json();
  },

  async getEmployerApplications(employerId) {
    const res = await fetch(`${API_BASE}/applications/employer/${employerId}`);
    if (!res.ok) throw new Error('Failed to fetch employer applications');
    return res.json();
  },

  async updateApplicationStatus(id, status, notes) {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update application status');
    }
    return res.json();
  },

  async withdrawApplication(id) {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to withdraw application');
    return res.json();
  },

  // Bookmarks
  async getBookmarks(userId) {
    const res = await fetch(`${API_BASE}/bookmarks/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch bookmarks');
    return res.json();
  },

  async saveBookmark(userId, jobId) {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, jobId })
    });
    if (!res.ok) throw new Error('Failed to bookmark job');
    return res.json();
  },

  async removeBookmark(userId, jobId) {
    const res = await fetch(`${API_BASE}/bookmarks/${userId}/${jobId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove bookmark');
    return res.json();
  },

  // Stats & Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Auth & Users
  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  async login(email, role) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register');
    }
    return res.json();
  }
};
