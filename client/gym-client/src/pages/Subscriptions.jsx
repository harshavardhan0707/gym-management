import React, { useEffect, useState } from "react";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import SubscriptionFormModal from "../components/SubscriptionFormModal";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const statusBadge = (status) => {
  let color = "bg-gray-300 text-gray-700";
  if (status === "paid" || status === "active") color = "bg-green-200 text-green-800";
  if (status === "unpaid" || status === "expired") color = "bg-red-200 text-red-800";
  if (status === "expiring_soon") color = "bg-yellow-200 text-yellow-800";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
};

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedSubscription, setSelectedSubscription] = useState(null); // For edit
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // For select fields
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchSubscriptions(page);
  }, [page]);

  const fetchSubscriptions = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/subscriptions?page=${pageNum}&limit=${PAGE_SIZE}`);
      setSubscriptions(res.data.subscriptions || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch subscriptions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch members and plans for modal
  const fetchMembersAndPlans = async () => {
    try {
      console.log('Fetching members and plans...');
      const [usersRes, plansRes] = await Promise.all([
        api.get("/users"),
        api.get("/plans"),
      ]);
      
      console.log('Users response:', usersRes.data);
      console.log('Plans response:', plansRes.data);
      
      setMembers(usersRes.data.users || []);
      setPlans(plansRes.data.plans || []);
      
      console.log('Members set:', usersRes.data.users || []);
      console.log('Plans set:', plansRes.data.plans || []);
    } catch (error) {
      console.error('Error fetching members or plans:', error);
      toast.error("Failed to load members or plans for subscription form.");
    }
  };

  // Handlers for modal
  const handleAddSubscription = () => {
    setModalMode("add");
    setSelectedSubscription(null);
    setModalError("");
    fetchMembersAndPlans();
    setIsModalOpen(true);
  };
  const handleEditSubscription = (sub) => {
    setModalMode("edit");
    setSelectedSubscription(sub);
    setModalError("");
    fetchMembersAndPlans();
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
    setModalError("");
  };

  // Add subscription submit handler
  const handleAddSubscriptionSubmit = async (data) => {
    setModalLoading(true);
    setModalError("");
    
    // Debug logging
    console.log('Submitting subscription data:', data);
    
    try {
      const response = await api.post("/subscriptions", data);
      console.log('Subscription created successfully:', response.data);
      toast.success("Subscription added successfully!");
      handleCloseModal();
      fetchSubscriptions(page);
    } catch (err) {
      console.error('Error creating subscription:', err);
      console.error('Error response:', err.response);
      setModalError(
        err.response?.data?.error || "Failed to add subscription. Please try again."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Edit subscription submit handler
  const handleEditSubscriptionSubmit = async (data) => {
    setModalLoading(true);
    setModalError("");
    try {
      await api.put(`/subscriptions/${selectedSubscription.id}`, data);
      toast.success("Subscription updated successfully!");
      handleCloseModal();
      fetchSubscriptions(page);
    } catch (err) {
      setModalError(
        err.response?.data?.error || "Failed to update subscription. Please try again."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Delete subscription handler
  const handleDeleteSubscription = async (sub) => {
    if (!window.confirm(`Are you sure you want to delete this subscription?`)) return;
    try {
      await api.delete(`/subscriptions/${sub.id}`);
      toast.success("Subscription deleted successfully!");
      fetchSubscriptions(page);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to delete subscription. Please try again."
      );
    }
  };

  // Modal submit dispatcher
  const handleModalSubmit = (data) => {
    if (modalMode === "add") {
      handleAddSubscriptionSubmit(data);
    } else {
      handleEditSubscriptionSubmit(data);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-blue-700 drop-shadow">Subscriptions</h2>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-lg hover:scale-[1.03] hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleAddSubscription}
        >
          + Add Subscription
        </button>
      </div>
      <SubscriptionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedSubscription}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
        members={members}
        plans={plans}
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
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Member</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Plan</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Start Date</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">End Date</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Payment Status</th>
                <th className="py-4 px-6 font-bold text-blue-700 text-left text-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">💳</span>
                      <span>No subscriptions found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, idx) => (
                  <tr
                    key={sub.id}
                    className={
                      `transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`
                    }
                  >
                    <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-900 text-base">{sub.user?.name || sub.userId}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-gray-700 text-base">{sub.plan?.name || sub.planId}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-gray-700 text-base">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-gray-700 text-base">{new Date(sub.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{statusBadge(sub.paymentStatus)}</td>
                    <td className="py-3 px-6 space-x-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow font-semibold hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        onClick={() => handleEditSubscription(sub)}
                        aria-label={`Edit subscription for ${sub.user?.name || sub.userId}`}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow font-semibold hover:scale-105 hover:from-red-600 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => handleDeleteSubscription(sub)}
                        aria-label={`Delete subscription for ${sub.user?.name || sub.userId}`}
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

export default Subscriptions;
