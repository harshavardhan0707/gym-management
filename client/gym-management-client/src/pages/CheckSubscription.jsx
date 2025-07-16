import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Search, User, Calendar, CreditCard, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { checkSubscription, testApiConnection } from '../services/api';

const CheckSubscription = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log('CheckSubscription component rendering, searchResult:', searchResult);

  const handleTestConnection = async () => {
    try {
      const result = await testApiConnection();
      toast.success('API connection successful!');
      console.log('Test result:', result);
    } catch (error) {
      toast.error('API connection failed!');
      console.error('Test error:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      toast.error('Please enter a roll number');
      return;
    }

    setLoading(true);
    try {
      console.log('Making API call for roll number:', rollNumber);
      const response = await checkSubscription(rollNumber);
      console.log('API response received:', response);
      setSearchResult(response);
      
      // Show appropriate message based on status
      if (response.status === 'no_subscription') {
        toast.info('User found but has no active subscription');
      } else if (response.status === 'active') {
        toast.success('Active subscription found');
      } else if (response.status === 'expired') {
        toast.warning('Subscription has expired');
      } else if (response.status === 'expiring_soon') {
        toast.warning('Subscription expires soon');
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setSearchResult(null);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Member not found';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'expired':
        return <XCircle className="h-6 w-6 text-destructive" />;
      case 'expiring_soon':
        return <AlertTriangle className="h-6 w-6 text-warning" />;
      case 'no_subscription':
        return <XCircle className="h-6 w-6 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'destructive';
      case 'expiring_soon':
        return 'warning';
      case 'no_subscription':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'active':
        return 'Subscription is active';
      case 'expired':
        return 'Subscription has expired';
      case 'expiring_soon':
        return 'Subscription expires soon';
      case 'no_subscription':
        return 'No active subscription';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Check Subscription Status</h1>
        <p className="text-muted-foreground">Search for a member's subscription status by roll number</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Roll Number</label>
              <Input
                placeholder="Enter roll number (e.g., 12345)"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="gradient" 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Searching..." : "Check Status"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestConnection}
              className="w-full"
            >
              Test API Connection
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Simple Search Results Display */}
      {searchResult && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(searchResult.status)}
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(searchResult.status)} className="text-sm">
                {searchResult.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">
                {getStatusMessage(searchResult.status)}
              </span>
            </div>

            {/* Member Information */}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Member Information</p>
                <p className="text-sm text-muted-foreground">{searchResult.user.name}</p>
                <p className="text-sm text-muted-foreground">{searchResult.user.email}</p>
                <p className="text-sm text-muted-foreground">Roll: {searchResult.user.rollNumber}</p>
              </div>
            </div>

            {/* Plan Information */}
            {searchResult.plan && (
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Plan Information</p>
                  <p className="text-sm text-muted-foreground">{searchResult.plan.name}</p>
                  <p className="text-sm text-muted-foreground">${searchResult.plan.price}</p>
                  <p className="text-sm text-muted-foreground">{searchResult.plan.duration} days</p>
                </div>
              </div>
            )}

            {/* Subscription Dates */}
            {searchResult.subscription && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Subscription Period</p>
                  <p className="text-sm text-muted-foreground">
                    Start: {new Date(searchResult.subscription.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    End: {new Date(searchResult.subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Status */}
            {searchResult.subscription && (
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Payment Status</p>
                  <Badge 
                    variant={searchResult.subscription.paymentStatus === 'paid' ? 'success' : 'warning'}
                    className="mt-1"
                  >
                    {searchResult.subscription.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}

            {/* Days Remaining */}
            {searchResult.daysRemaining !== undefined && (
              <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                <p className="text-sm font-medium text-muted-foreground">
                  {searchResult.status === 'active' && `${searchResult.daysRemaining} days remaining`}
                  {searchResult.status === 'expiring_soon' && `Expires in ${Math.abs(searchResult.daysRemaining)} days`}
                  {searchResult.status === 'expired' && `Expired ${Math.abs(searchResult.daysRemaining)} days ago`}
                  {searchResult.status === 'no_subscription' && 'No active subscription'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {searchResult === null && !loading && rollNumber && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No subscription found for this roll number</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check the roll number and try again
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckSubscription;