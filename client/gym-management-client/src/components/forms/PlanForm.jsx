import React, { useState } from 'react';

const PlanForm = ({ setPlans }) => {
    const [planName, setPlanName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPlan = { planName, price, duration };
        // Logic to add the new plan to the state or send it to the server
        setPlans((prevPlans) => [...prevPlans, newPlan]);
        // Reset form fields
        setPlanName('');
        setPrice('');
        setDuration('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-xl font-bold mb-2">Add New Subscription Plan</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="planName">Plan Name</label>
                <input
                    type="text"
                    id="planName"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="price">Price</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="duration">Duration (in months)</label>
                <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Add Plan
            </button>
        </form>
    );
};

export default PlanForm;