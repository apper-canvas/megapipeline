import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: "Contacts",
      icon: "Users",
      route: "/contacts",
      isActive: location.pathname === "/" || location.pathname === "/contacts"
    },
    {
      label: "Deals", 
      icon: "Target",
      route: "/deals",
      isActive: location.pathname === "/deals"
    },
    {
      label: "Companies",
      icon: "Building2", 
      route: "/companies",
      isActive: location.pathname === "/companies"
    },
    {
      label: "Tasks",
      icon: "CheckSquare",
      route: "/tasks", 
      isActive: location.pathname === "/tasks"
    },
    {
      label: "Reports",
      icon: "BarChart3",
      route: "/reports",
      isActive: location.pathname === "/reports"
    }
  ];

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col shadow-2xl lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    Pipeline Pro
                  </h2>
                  <p className="text-sm text-gray-500">CRM Dashboard</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6">
              <div className="space-y-1 px-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.route}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.route}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                          isActive || item.isActive
                            ? "bg-primary-50 text-primary-700 shadow-sm border-l-4 border-primary-500 ml-1"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ApperIcon 
                            name={item.icon} 
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive || item.isActive ? "text-primary-600" : "text-gray-500 group-hover:text-gray-700"
                            )} 
                          />
                          <span>{item.label}</span>
                          
                          {/* Active indicator */}
                          {(isActive || item.isActive) && (
                            <motion.div
                              layoutId="mobileActiveTab"
                              className="absolute right-2 w-2 h-2 bg-primary-500 rounded-full"
                              initial={false}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Version 1.0.0</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;