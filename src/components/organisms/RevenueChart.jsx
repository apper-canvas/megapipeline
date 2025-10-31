import React from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';

/**
 * RevenueChart Component
 * Displays monthly revenue trends using an area chart
 */
function RevenueChart({ data = [] }) {
  // Extract series data
  const series = [{
    name: 'Revenue',
    data: data.map(item => item.revenue)
  }];

  const categories = data.map(item => item.month);

  const options = {
    chart: {
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        },
        formatter: function(val) {
          return '$' + (val / 1000).toFixed(0) + 'K';
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return '$' + val.toLocaleString();
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        }
      }
    }]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
      <Chart options={options} series={series} type="area" height={350} />
    </motion.div>
  );
}

export default RevenueChart;