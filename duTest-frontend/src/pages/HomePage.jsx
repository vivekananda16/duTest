import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTestCases, searchTestCases, deleteTestCase } from "../api/testCaseApi";

function HomePage() {
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    loadTestCases(currentPage);
  }, [currentPage]);

  const loadTestCases = async (page) => {
    const response = await getAllTestCases(page, pageSize);
    setTestCases(response.data.content);
    setTotalPages(response.data.totalPages);
    setTotalElements(response.data.totalElements);
  };

  const handleSearch = async () => {
    const response = await searchTestCases(keyword, status, priority, 0, pageSize);
    setTestCases(response.data.content);
    setTotalPages(response.data.totalPages);
    setTotalElements(response.data.totalElements);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setKeyword("");
    setStatus("");
    setPriority("");
    setCurrentPage(0);
    loadTestCases(0);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test case?");
    if (confirmDelete) {
      await deleteTestCase(id);
      loadTestCases(currentPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  // Color helpers for badges
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Test Case Management</h1>
          <p className="text-gray-500 mt-1">Manage, search, filter, update and track your test cases.</p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
        >
          + Create Test Case
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg text-2xl">📋</div>
          <div>
            <p className="text-sm text-gray-500">Total Test Cases</p>
            <p className="text-2xl font-bold text-gray-800">{totalElements}</p>
            <p className="text-xs text-gray-400">All test cases</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-2xl">✅</div>
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {testCases.filter((tc) => tc.status === "ACTIVE").length}
            </p>
            <p className="text-xs text-gray-400">On current page</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-2xl">📈</div>
          <div>
            <p className="text-sm text-gray-500">High Priority</p>
            <p className="text-2xl font-bold text-orange-500">
              {testCases.filter((tc) => tc.priority === "HIGH").length}
            </p>
            <p className="text-xs text-gray-400">On current page</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by Test Case ID or Name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Priority</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
        >
          🔍 Search
        </button>
        <button
          onClick={handleReset}
          className="border border-gray-300 hover:bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold transition"
        >
          ↺ Reset
        </button>
      </div>

      {/* Table */}
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
            {testCases.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-400">
                  No test cases found.
                </td>
              </tr>
            ) : (
              testCases.map((tc) => (
                <tr key={tc.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-indigo-600 font-medium">{tc.testCaseID}</td>
                  <td className="px-5 py-3 text-gray-800 font-medium">{tc.name}</td>
                  <td className="px-5 py-3">
                    <span className={getStatusBadge(tc.status)}>{tc.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={getPriorityBadge(tc.priority)}>{tc.priority}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{tc.description}</td>
                  <td className="px-5 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/edit/${tc.id}`)}
                      className="flex items-center gap-1 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tc.id)}
                      className="flex items-center gap-1 border border-red-300 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {testCases.length} of {totalElements} test cases
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentPage === i
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
