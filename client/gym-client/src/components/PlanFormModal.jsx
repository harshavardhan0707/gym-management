import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const PlanFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  mode = "add",
  loading = false,
  error = null,
}) => {
  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        duration: initialData.duration?.toString() || "",
        price: initialData.price?.toString() || "",
      });
    } else {
      setForm({ name: "", duration: "", price: "" });
    }
    setFormError("");
  }, [isOpen, initialData, mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim() || !form.duration.trim() || !form.price.trim()) {
      setFormError("All fields are required.");
      return false;
    }
    if (isNaN(Number(form.duration)) || Number(form.duration) <= 0) {
      setFormError("Duration must be a positive number.");
      return false;
    }
    if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      setFormError("Price must be a non-negative number.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      name: form.name.trim(),
      duration: Number(form.duration),
      price: Number(form.price),
    };
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">{mode === "add" ? "Add Plan" : "Edit Plan"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Plan Name</label>
          <input
            name="name"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Duration (days)</label>
          <input
            name="duration"
            type="number"
            min="1"
            className="w-full border rounded px-3 py-2"
            value={form.duration}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Price (₹)</label>
          <input
            name="price"
            type="number"
            min="0"
            className="w-full border rounded px-3 py-2"
            value={form.price}
            onChange={handleChange}
            required
            disabled={loading}
          />
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

export default PlanFormModal; 