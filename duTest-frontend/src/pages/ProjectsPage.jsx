import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, createProject, deleteProject } from "../api/testCaseApi";

function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ projectName: "", description: "" });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const pageSize = 6;

  useEffect(() => {
    loadProjects(currentPage);
  }, [currentPage]);

  const loadProjects = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProjects(page, pageSize);
      setProjects(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.projectName.trim()) {
      setError("Project name is required.");
      return;
    }
    try {
      await createProject(formData);
      setCreateModalOpen(false);
      setFormData({ projectName: "", description: "" });
      loadProjects(currentPage);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create project. Please try again."
      );
    }
  };

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteProject(deleteTargetId);
      closeDeleteModal();
      loadProjects(currentPage);
    } catch (err) {
      closeDeleteModal();
      setError(
        err.response?.data?.message || "Failed to delete project. Please try again."
      );
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 mt-1">Select a project to manage its test cases.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
        >
          + New Project
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 mb-6 w-fit">
        <div className="bg-indigo-100 p-3 rounded-lg text-2xl">📁</div>
        <div>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-2xl font-bold text-gray-800">{totalElements}</p>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center text-gray-400">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm mt-1">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer border border-transparent hover:border-indigo-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className="flex-1"
                  onClick={() => navigate(`/projects/${project.id}/testcases`)}
                >
                  <h2 className="text-lg font-bold text-gray-800">{project.projectName}</h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {project.description || "No description provided."}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); openDeleteModal(project.id); }}
                  className="ml-3 text-red-400 hover:text-red-600 transition text-lg"
                  title="Delete project"
                >
                  🗑️
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate(`/projects/${project.id}/testcases`)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Open →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
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
      )}

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Create New Project</h2>
            <p className="text-sm text-gray-500 mb-5">Projects cannot be edited after creation.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Example: Banking App"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows="3"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setCreateModalOpen(false); setFormData({ projectName: "", description: "" }); }}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold py-2 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition text-sm"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Project</h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure? This action cannot be undone. Make sure all test cases are deleted first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold py-2 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
