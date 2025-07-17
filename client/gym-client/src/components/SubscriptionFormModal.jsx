import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const SubscriptionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  mode = "add",
  loading = false,
  error = null,
  members = [],
  plans = [],
}) => {
  const [form, setForm] = useState({
    userId: "",
    planId: "",
    startDate: "",
    endDate: "",
    paymentStatus: "paid",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        userId: initialData.userId?.toString() || "",
        planId: initialData.planId?.toString() || "",
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : "",
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
        paymentStatus: initialData.paymentStatus || "paid",
      });
    } else {
      setForm({ userId: "", planId: "", startDate: "", endDate: "", paymentStatus: "paid" });
    }
    setFormError("");
  }, [isOpen, initialData, mode]);

  // Auto-calculate end date when plan or startDate changes
  useEffect(() => {
    if (form.planId && form.startDate) {
      const plan = plans.find((p) => p.id.toString() === form.planId);
      if (plan) {
        const start = new Date(form.startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + plan.duration - 1);
        setForm((f) => ({ ...f, endDate: end.toISOString().slice(0, 10) }));
      }
    }
    // eslint-disable-next-line
  }, [form.planId, form.startDate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.userId || !form.planId || !form.startDate || !form.endDate || !form.paymentStatus) {
      setFormError("All fields are required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      userId: Number(form.userId),
      planId: Number(form.planId),
      startDate: form.startDate,
      endDate: form.endDate,
      paymentStatus: form.paymentStatus,
    };
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">{mode === "add" ? "Add Subscription" : "Edit Subscription"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Member</label>
          <select
            name="userId"
            className="w-full border rounded px-3 py-2"
            value={form.userId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.rollNumber})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Plan</label>
          <select
            name="planId"
            className="w-full border rounded px-3 py-2"
            value={form.planId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select plan</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.duration} days)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            className="w-full border rounded px-3 py-2"
            value={form.startDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={form.endDate}
            readOnly
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            className="w-full border rounded px-3 py-2"
            value={form.paymentStatus}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        {(formError || error) && (
          <div className="text-red-500 text-sm">{formError || error}</div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (mode === "add" ? "Adding..." : "Saving...") : mode === "add" ? "Add" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubscriptionFormModal; 