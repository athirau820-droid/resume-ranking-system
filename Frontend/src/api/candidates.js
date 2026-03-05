// src/api/candidates.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const applyToJob = (jobId, candidate) =>
  API.post(`/resumes/bulk`, { jobId, ...candidate });
