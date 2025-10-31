import React from "react";
import Empty from "@/components/ui/Empty";
import { motion } from "framer-motion";

const CompaniesPage = () => {
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
            Companies
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your business relationships and company information
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
          <Empty
            title="Add your first company"
            message="Build a comprehensive directory of companies you work with. Track key information, contacts, and business relationships to strengthen your partnerships."
            icon="Building2"
            buttonText="Add Company"
            onAction={() => {
              // Future: Open company creation form
              console.log("Add company functionality coming soon");
            }}
          />
        </div>

        {/* Future Company Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-20">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-700">Company Name</h3>
                  <p className="text-sm text-gray-500">Industry Type</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contacts</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deals</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CompaniesPage;