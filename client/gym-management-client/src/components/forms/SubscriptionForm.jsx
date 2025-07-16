import React, { useState } from 'react';

const SubscriptionForm = () => {
    const [subscriptionData, setSubscriptionData] = useState({
        planName: '',
        startDate: '',
        endDate: '',
        paymentStatus: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubscriptionData({
            ...subscriptionData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle subscription form submission logic here
        console.log('Subscription Data:', subscriptionData);
    };

    return (
        <form onSubmit={handleSubmit} className="subscription-form">
            <h2 className="text-xl font-bold mb-4">Manage Subscription</h2>
            <div className="mb-4">
                <label htmlFor="planName" className="block text-sm font-medium">Plan Name</label>
                <input
                    type="text"
                    id="planName"
                    name="planName"
                    value={subscriptionData.planName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={subscriptionData.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={subscriptionData.endDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="paymentStatus" className="block text-sm font-medium">Payment Status</label>
                <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={subscriptionData.paymentStatus}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Submit
            </button>
        </form>
    );
};

export default SubscriptionForm;