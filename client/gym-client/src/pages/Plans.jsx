import React, { useEffect, useState } from "react";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import PlanFormModal from "../components/PlanFormModal";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedPlan, setSelectedPlan] = useState(null); // For edit
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchPlans(page);
  }, [page]);

  const fetchPlans = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/plans?page=${pageNum}&limit=${PAGE_SIZE}`);
      setPlans(res.data.plans || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch plans. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handlers for modal
  const handleAddPlan = () => {
    setModalMode("add");
    setSelectedPlan(null);
    setModalError("");
    setIsModalOpen(true);
  };
  const handleEditPlan = (plan) => {
    setModalMode("edit");
    setSelectedPlan(plan);
    setModalError("");
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setModalError("");
  };

  // Add plan submit handler
  const handleAddPlanSubmit = async (data) => {
    setModalLoading(true);
    setModalError("");
    try {
      await api.post("/plans", data);
      toast.success("Plan added successfully!");
      handleCloseModal();
      fetchPlans(page);
    } catch (err) {
      setModalError(
        err.response?.data?.error || "Failed to add plan. Please try again."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Edit plan submit handler
  const handleEditPlanSubmit = async (data) => {
    setModalLoading(true);
    setModalError("");
    try {
      await api.put(`/plans/${selectedPlan.id}`, data);
      toast.success("Plan updated successfully!");
      handleCloseModal();
      fetchPlans(page);
    } catch (err) {
      setModalError(
        err.response?.data?.error || "Failed to update plan. Please try again."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Delete plan handler
  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`Are you sure you want to delete the plan '${plan.name}'?`)) return;
    try {
      await api.delete(`/plans/${plan.id}`);
      toast.success("Plan deleted successfully!");
      fetchPlans(page);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to delete plan. Please try again."
      );
    }
  };

  // Modal submit dispatcher
  const handleModalSubmit = (data) => {
    if (modalMode === "add") {
      handleAddPlanSubmit(data);
    } else {
      handleEditPlanSubmit(data);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-blue-700 drop-shadow">Plans</h2>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-lg hover:scale-[1.03] hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleAddPlan}
        >
          + Add Plan
        </button>
      </div>
      <PlanFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedPlan}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
      />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white border border-blue-100">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Plan Name</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Duration (days)</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Price (₹)</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <span>No plans found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan, idx) => (
                  <tr
                    key={plan.id}
                    className={
                      `transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`
                    }
                  >
                    <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-900 text-base">{plan.name}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-gray-700 text-base">{plan.duration}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-gray-700 text-base">₹{plan.price}</td>
                    <td className="py-3 px-6 space-x-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow font-semibold hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        onClick={() => handleEditPlan(plan)}
                        aria-label={`Edit ${plan.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow font-semibold hover:scale-105 hover:from-red-600 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => handleDeletePlan(plan)}
                        aria-label={`Delete ${plan.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
          <button
            className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {pages.map((p) => (
            <button
              key={p}
              className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium ${
                p === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setPage(p)}
              disabled={p === page}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Plans;
