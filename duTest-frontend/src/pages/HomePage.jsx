import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllTestCases, searchTestCases, deleteTestCase,
  getActiveCount, getHighPriorityCount, getProjectById
} from "../api/testCaseApi";

function HomePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const pageSize = 6;

  useEffect(() => {
    loadProject();
    loadTestCases(currentPage);
    loadCounts();
  }, [currentPage]);

  const loadProject = async () => {
    try {
      const response = await getProjectById(projectId);
      setProject(response.data);
    } catch (err) {
      console.error("Failed to load project", err);
    }
  };

  const loadTestCases = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllTestCases(projectId, page, pageSize);
      setTestCases(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      setError("Failed to load test cases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    try {
      const activeRes = await getActiveCount(projectId);
      const highRes = await getHighPriorityCount(projectId);
      setActiveCount(activeRes.data);
      setHighPriorityCount(highRes.data);
    } catch (err) {
      console.error("Failed to load counts", err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchTestCases(projectId, keyword, status, priority, 0, pageSize);
      setTestCases(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setCurrentPage(0);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setStatus("");
    setPriority("");
    setCurrentPage(0);
    loadTestCases(0);
  };

  const openDeleteModal = (id) => { setDeleteTargetId(id); setDeleteModalOpen(true); };
  const closeDeleteModal = () => { setDeleteTargetId(null); setDeleteModalOpen(false); };

  const confirmDelete = async () => {
    try {
      await deleteTestCase(projectId, deleteTargetId);
      closeDeleteModal();
      loadTestCases(currentPage);
      loadCounts();
    } catch (err) {
      setError("Failed to delete test case. Please try again.");
      closeDeleteModal();
    }
  };

  const goToPreviousPage = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };
  const goToNextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
    switch (status) {
      case "ACTIVE":   return `${base} bg-green-100 text-green-700`;
      case "INACTIVE": return `${base} bg-gray-100 text-gray-600`;
      case "PASS":     return `${base} bg-blue-100 text-blue-700`;
      case "FAIL":     return `${base} bg-red-100 text-red-700`;
      default:         return `${base} bg-gray-100 text-gray-500`;
    }
  };

  const getPriorityBadge = (priority) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
    switch (priority) {
      case "HIGH":   return `${base} bg-red-100 text-red-600`;
      case "MEDIUM": return `${base} bg-yellow-100 text-yellow-600`;
      case "LOW":    return `${base} bg-green-100 text-green-600`;
      default:       return `${base} bg-gray-100 text-gray-500`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition">
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{project ? project.projectName : "Test Cases"}</h1>
          <p className="text-gray-500 mt-1">{project?.description || "Manage your test cases."}</p>
        </div>
        <button onClick={() => navigate(`/projects/${projectId}/testcases/create`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition">
          + Create Test Case
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg text-2xl">📋</div>
          <div>
            <p className="text-sm text-gray-500">Total Test Cases</p>
            <p className="text-2xl font-bold text-gray-800">{totalElements}</p>
            <p className="text-xs text-gray-400">In this project</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-2xl">✅</div>
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            <p className="text-xs text-gray-400">In this project</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-2xl">📈</div>
          <div>
            <p className="text-sm text-gray-500">High Priority</p>
            <p className="text-2xl font-bold text-orange-500">{highPriorityCount}</p>
            <p className="text-xs text-gray-400">In this project</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Search by Test Case ID or Name..."
          value={keyword} onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All Priority</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <button onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
          🔍 Search
        </button>
        <button onClick={handleReset}
          className="border border-gray-300 hover:bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold transition">
          ↺ Reset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Test Case ID", "Name", "Status", "Priority", "Description", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-gray-600 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </td></tr>
            ) : testCases.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12 text-gray-400">No test cases found.</td></tr>
            ) : (
              testCases.map((tc) => (
                <tr key={tc.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-indigo-600 font-medium">{tc.testCaseID}</td>
                  <td className="px-5 py-3 text-gray-800 font-medium">{tc.name}</td>
                  <td className="px-5 py-3"><span className={getStatusBadge(tc.status)}>{tc.status}</span></td>
                  <td className="px-5 py-3"><span className={getPriorityBadge(tc.priority)}>{tc.priority}</span></td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{tc.description}</td>
                  <td className="px-5 py-3 flex gap-2">
                    <button onClick={() => navigate(`/projects/${projectId}/testcases/edit/${tc.id}`)}
                      className="flex items-center gap-1 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      ✏️ Edit
                    </button>
                    <button onClick={() => openDeleteModal(tc.id)}
                      className="flex items-center gap-1 border border-red-300 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {testCases.length} of {totalElements} test cases</p>
          <div className="flex items-center gap-2">
            <button onClick={goToPreviousPage} disabled={currentPage === 0}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPage === i ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={goToNextPage} disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">›</button>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Test Case</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={closeDeleteModal}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold py-2 rounded-lg transition text-sm">Cancel</button>
              <button onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
