import React from 'react';

const PlansTable = ({ plans, setPlans }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {plans.map((plan) => (
                        <tr key={plan.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.duration}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900" onClick={() => {/* Edit plan logic */}}>Edit</button>
                                <button className="text-red-600 hover:text-red-900 ml-4" onClick={() => {/* Delete plan logic */}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlansTable;