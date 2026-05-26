import axios from "axios";

const api = axios.create({baseURL: "http://localhost:8080/api/testcases",});

export const getAllTestCases = (page=0, size=6) => api.get("",{params:{page, size},});

export const getTestCaseById = (id) => api.get(`/${id}`);

export const createTestCase = (data) => api.post("", data);

export const updateTestCase = (id, data) => api.patch(`/${id}`, data);

export const deleteTestCase = (id) => api.delete(`/${id}`);

export const searchTestCases = ( keyword, status, priority, page=0, size=6) => api.get("/search",{params: {keyword, status,priority, page, size,},});

export default api;