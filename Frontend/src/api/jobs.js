// src/api/jobs.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchJobs = () => API.get('/jobs');
export const createJob = (job) => API.post('/jobs', job);
