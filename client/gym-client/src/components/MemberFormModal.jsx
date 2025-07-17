import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const MemberFormModal = ({
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
    email: "",
    phone: "",
    rollNumber: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        rollNumber: initialData.rollNumber || "",
        password: "", // Don't prefill password
      });
    } else {
      setForm({ name: "", email: "", phone: "", rollNumber: "", password: "" });
    }
    setFormError("");
  }, [isOpen, initialData, mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.rollNumber.trim()) {
      setFormError("All fields except password are required.");
      return false;
    }
    if (mode === "add" && (!form.password || form.password.length < 6)) {
      setFormError("Password is required and must be at least 6 characters.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = { ...form };
    if (mode === "edit") delete data.password;
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">{mode === "add" ? "Add Member" : "Edit Member"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
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
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Roll Number</label>
          <input
            name="rollNumber"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.rollNumber}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        {mode === "add" && (
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        )}
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

export default MemberFormModal; 