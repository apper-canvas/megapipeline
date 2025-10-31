import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import analyticsService from '@/services/api/analyticsService';
import MetricCard from '@/components/molecules/MetricCard';
import DealPipelineChart from '@/components/organisms/DealPipelineChart';
import RevenueChart from '@/components/organisms/RevenueChart';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ReportsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data on mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getAnalytics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    toast.info('Refreshing analytics data...');
    await fetchAnalytics();
    toast.success('Analytics data updated');
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Loading rows={8} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Error
          title="Failed to load analytics"
          message={error}
          onRetry={fetchAnalytics}
        />
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h2>
            <p className="text-gray-600 mt-1">
              Track your sales performance and customer engagement metrics
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Refresh Data
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            icon="DollarSign"
            color="green"
            trend="From all closed deals"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            icon="TrendingUp"
            color="blue"
            trend="Deals won vs total"
          />
          <MetricCard
            title="Active Deals"
            value={metrics.activeDeals}
            icon="Briefcase"
            color="yellow"
            trend="Currently in pipeline"
          />
          <MetricCard
            title="Total Contacts"
            value={metrics.totalContacts}
            icon="Users"
            color="purple"
            trend="In your CRM"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DealPipelineChart data={metrics.pipelineDistribution} />
          <RevenueChart data={metrics.revenueByMonth} />
        </div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Lightbulb" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Insights
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <ApperIcon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your conversion rate of {metrics.conversionRate}% shows strong sales performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <ApperIcon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You have {metrics.activeDeals} deals actively progressing through your pipeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <ApperIcon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Total revenue of {formatCurrency(metrics.totalRevenue)} generated from closed deals</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;