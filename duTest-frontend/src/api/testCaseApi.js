import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api" });

// ─── Project APIs ───────────────────────────────────────────
export const getAllProjects = (page = 0, size = 6) =>
  api.get("/projects", { params: { page, size } });

export const getProjectById = (id) => api.get(`/projects/${id}`);

export const createProject = (data) => api.post("/projects", data);

export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ─── Test Case APIs ─────────────────────────────────────────
export const getAllTestCases = (projectId, page = 0, size = 6) =>
  api.get(`/projects/${projectId}/testcases`, { params: { page, size } });

export const getTestCaseById = (projectId, id) =>
  api.get(`/projects/${projectId}/testcases/${id}`);

export const createTestCase = (projectId, data) =>
  api.post(`/projects/${projectId}/testcases`, data);

export const updateTestCase = (projectId, id, data) =>
  api.patch(`/projects/${projectId}/testcases/${id}`, data);

export const deleteTestCase = (projectId, id) =>
  api.delete(`/projects/${projectId}/testcases/${id}`);

export const searchTestCases = (projectId, keyword, status, priority, page = 0, size = 6) =>
  api.get(`/projects/${projectId}/testcases/search`, {
    params: { keyword, status, priority, page, size },
  });

export const getActiveCount = (projectId) =>
  api.get(`/projects/${projectId}/testcases/count/active`);

export const getHighPriorityCount = (projectId) =>
  api.get(`/projects/${projectId}/testcases/count/high`);

export default api;
