import React from "react";
import Empty from "@/components/ui/Empty";
import { motion } from "framer-motion";

const TasksPage = () => {
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
            Tasks
          </h2>
          <p className="text-gray-600 mt-1">
            Stay organized with your to-do list and track important activities
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
          <Empty
            title="Create your first task"
            message="Stay on top of your responsibilities by creating tasks. Set reminders, track progress, and never miss important follow-ups with your contacts and deals."
            icon="CheckSquare"
            buttonText="Create Task"
            onAction={() => {
              // Future: Open task creation form
              console.log("Create task functionality coming soon");
            }}
          />
        </div>

        {/* Future Task List Structure */}
        <div className="space-y-4 opacity-20">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Sample Task</h3>
                  <p className="text-sm text-gray-500">Task description goes here</p>
                </div>
                <div className="text-sm text-gray-500">
                  Due: Today
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TasksPage;