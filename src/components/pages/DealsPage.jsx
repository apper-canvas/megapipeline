import React from "react";
import Empty from "@/components/ui/Empty";
import { motion } from "framer-motion";

const DealsPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Deals Pipeline
          </h2>
          <p className="text-gray-600 mt-1">
            Track your sales opportunities through the pipeline
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
          <Empty
            title="No deals yet"
            message="Start tracking your sales opportunities by creating your first deal. Organize prospects through your sales pipeline and never miss a revenue opportunity."
            icon="Target"
            buttonText="Create First Deal"
            onAction={() => {
              // Future: Open deal creation form
              console.log("Create deal functionality coming soon");
            }}
          />
        </div>

        {/* Future Pipeline Board Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 opacity-20">
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
            <h3 className="font-semibold text-gray-700 mb-4">Lead</h3>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded border border-gray-200">
                <h4 className="font-medium text-sm">Sample Deal</h4>
                <p className="text-xs text-gray-500">$50,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
            <h3 className="font-semibold text-gray-700 mb-4">Qualified</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
            <h3 className="font-semibold text-gray-700 mb-4">Proposal</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
            <h3 className="font-semibold text-gray-700 mb-4">Closed Won</h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DealsPage;