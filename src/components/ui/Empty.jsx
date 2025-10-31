import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Empty = ({ 
  title = "No data found",
  message = "Get started by adding your first item.",
  icon = "Database",
  buttonText = "Add Item",
  onAction,
  showButton = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ApperIcon name={icon} className="h-10 w-10 text-gray-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {showButton && onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>{buttonText}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;