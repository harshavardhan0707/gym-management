import React, { useState } from "react";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

const statusBadge = (status) => {
  let color = "bg-gray-300 text-gray-700";
  if (status === "active") color = "bg-green-200 text-green-800";
  if (status === "expired") color = "bg-red-200 text-red-800";
  if (status === "expiring_soon") color = "bg-yellow-200 text-yellow-800";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
};

const CheckSubscription = () => {
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.get(`/subscriptions/check?roll=${encodeURIComponent(roll)}`);
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "No subscription found or user not found."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Check Subscription Status</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter roll number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </form>
        {loading && <LoadingSpinner />}
        {error && (
          <div className="text-red-500 text-center py-4">{error}</div>
        )}
        {result && (
          <div className="bg-blue-50 rounded-xl shadow p-6 mt-4 animate-fade-in">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Name:</span> {result.user.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Roll Number:</span> {result.user.rollNumber}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Email:</span> {result.user.email}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Plan:</span> {result.subscription.plan?.name || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">End Date:</span> {new Date(result.subscription.endDate).toLocaleDateString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Status:</span> {statusBadge(result.subscription.status)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckSubscription;
