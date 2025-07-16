import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, TrendingUp, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getUsers, getPlans, getSubscriptions } from '../services/api';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPlans: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, plansRes, subscriptionsRes] = await Promise.all([
          getUsers(1, 1000), // Get all users for stats
          getPlans(),
          getSubscriptions()
        ]);

        const users = usersRes.users || [];
        const plans = plansRes.plans || [];
        const subscriptions = subscriptionsRes.subscriptions || [];

        const activeSubscriptions = subscriptions.filter(sub => {
          const endDate = new Date(sub.endDate);
          return endDate > new Date();
        });

        setStats({
          totalMembers: users.length,
          totalPlans: plans.length,
          totalSubscriptions: subscriptions.length,
          activeSubscriptions: activeSubscriptions.length
        });

        // Get recent members (last 5)
        setRecentMembers(users.slice(-5).reverse());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      color: "text-primary",
      change: "+12%"
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: Calendar,
      color: "text-success",
      change: "+8%"
    },
    {
      title: "Total Plans",
      value: stats.totalPlans,
      icon: CreditCard,
      color: "text-muted-foreground",
      change: "0%"
    },
    {
      title: "Total Subscriptions",
      value: stats.totalSubscriptions,
      icon: TrendingUp,
      color: "text-warning",
      change: "+23%"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-hero rounded-lg p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome to GymManager</h1>
          <p className="text-blue-100 text-lg">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to GymManager</h1>
        <p className="text-blue-100 text-lg">
          Manage your gym members, subscriptions, and plans all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMembers.length > 0 ? (
                recentMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="outline">{member.rollNumber}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No members found</p>
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Member
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Plans
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Subscriptions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Check Subscription Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;