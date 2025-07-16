import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search, Calendar, User, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, getUsers, getPlans } from '../services/api';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    planId: '',
    startDate: '',
    paymentStatus: 'unpaid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subscriptionsRes, usersRes, plansRes] = await Promise.all([
        getSubscriptions(),
        getUsers(1, 1000),
        getPlans()
      ]);
      
      setSubscriptions(subscriptionsRes.data || []);
      setUsers(usersRes.data || []);
      setPlans(plansRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subscriptionData = {
        ...formData,
        userId: parseInt(formData.userId),
        planId: parseInt(formData.planId)
      };

      if (editingSubscription) {
        await updateSubscription(editingSubscription.id, subscriptionData);
        toast.success('Subscription updated successfully');
      } else {
        await createSubscription(subscriptionData);
        toast.success('Subscription created successfully');
      }
      setShowForm(false);
      setEditingSubscription(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      userId: subscription.userId.toString(),
      planId: subscription.planId.toString(),
      startDate: subscription.startDate.split('T')[0],
      paymentStatus: subscription.paymentStatus
    });
    setShowForm(true);
  };

  const handleDelete = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(subscriptionId);
        toast.success('Subscription deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete subscription');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      planId: '',
      startDate: '',
      paymentStatus: 'unpaid'
    });
  };

  const getSubscriptionStatus = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', variant: 'destructive' };
    if (daysUntilExpiry <= 7) return { status: 'expiring soon', variant: 'warning' };
    return { status: 'active', variant: 'success' };
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const user = users.find(u => u.id === subscription.userId);
    const plan = plans.find(p => p.id === subscription.planId);
    return (
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage member subscriptions</p>
        </div>
        <Button onClick={() => setShowForm(true)} variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions by member, plan, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Subscriptions ({filteredSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading subscriptions...</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No subscriptions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Member</th>
                    <th className="text-left p-2 font-medium">Plan</th>
                    <th className="text-left p-2 font-medium">Start Date</th>
                    <th className="text-left p-2 font-medium">End Date</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Payment</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => {
                    const user = users.find(u => u.id === subscription.userId);
                    const plan = plans.find(p => p.id === subscription.planId);
                    const status = getSubscriptionStatus(subscription.endDate);
                    
                    return (
                      <tr key={subscription.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{user?.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{plan?.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">${plan?.price}</p>
                          </div>
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {new Date(subscription.startDate).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <Badge variant={status.variant}>
                            {status.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge 
                            variant={subscription.paymentStatus === 'paid' ? 'success' : 'warning'}
                          >
                            {subscription.paymentStatus}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(subscription)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(subscription.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Member</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select a member</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select a plan</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price} ({plan.duration} days)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="gradient" className="flex-1">
                    {editingSubscription ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSubscription(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;