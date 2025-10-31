import React from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';

/**
 * DealPipelineChart Component
 * Displays deal distribution across pipeline stages using a donut chart
 */
function DealPipelineChart({ data = [] }) {
  // Extract series data (counts) and labels (stages)
  const series = data.map(item => item.count);
  const labels = data.map(item => item.stage);

  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      }
    },
    labels: labels,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#374151'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827',
              formatter: function(val) {
                return val;
              }
            },
            total: {
              show: true,
              label: 'Total Deals',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6b7280',
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline</h3>
      <Chart options={options} series={series} type="donut" height={350} />
    </motion.div>
  );
}

export default DealPipelineChart;