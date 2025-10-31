import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
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

  return (
    <aside className={cn("w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
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
                        layoutId="activeTab"
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
    </aside>
  );
};

export default Sidebar;