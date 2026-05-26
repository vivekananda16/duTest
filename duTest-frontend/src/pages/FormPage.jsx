import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTestCase, getTestCaseById, updateTestCase } from "../api/testCaseApi";

function FormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        testCaseID: "",
        name: "",
        description: "",
        status: "ACTIVE",
        priority: "MEDIUM",
    });

    useEffect(() => {
        if (isEditMode) {
            loadTestCase();
        }
    }, [id]);

    const loadTestCase = async () => {
        const response = await getTestCaseById(id);
        setFormData({
            testCaseID: response.data.testCaseID,
            name: response.data.name,
            description: response.data.description,
            status: response.data.status,
            priority: response.data.priority,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditMode) {
            await updateTestCase(id, formData);
            alert("Test Case updated successfully");
        } else {
            await createTestCase(formData);
            alert("Test Case created successfully");
        }
        navigate("/");
    };

    const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-sm w-full max-w-2xl p-8">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 transition"
                    >
                        ← Back to list
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditMode ? "Edit Test Case" : "Create Test Case"}
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {isEditMode
                            ? "Update existing test case details."
                            : "Add a new test case to your project."}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Test Case ID */}
                    <div>
                        <label className={labelClass}>Test Case ID</label>
                        <input
                            type="text"
                            name="testCaseID"
                            value={formData.testCaseID}
                            onChange={handleChange}
                            placeholder="Example: TC001"
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>Test Case Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: Login Test"
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write test case description..."
                            rows="4"
                            className={inputClass}
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="PASS">PASS</option>
                                <option value="FAIL">FAIL</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold py-2.5 rounded-lg transition text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                        >
                            {isEditMode ? "Update Test Case" : "Create Test Case"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormPage;