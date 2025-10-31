import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const ContactDetailPanel = ({ contact, isOpen, onClose }) => {
  const panelVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      opacity: 1,
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

  if (!contact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            className="fixed lg:absolute inset-y-0 right-0 w-full lg:w-96 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-white/50"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Avatar and Name */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{contact.name}</h3>
                {contact.company && (
                  <p className="text-gray-600 mt-1">{contact.company}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Contact Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Mail" className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm text-gray-900 font-medium">{contact.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Phone" className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm text-gray-900 font-medium">{contact.phone}</p>
                      </div>
                    </div>

                    {contact.company && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <ApperIcon name="Building2" className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                          <p className="text-sm text-gray-900 font-medium">{contact.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Information */}
                <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Activity
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Contact</span>
                      <Badge variant="accent">
                        {contact.lastContactDate 
                          ? format(new Date(contact.lastContactDate), "MMM dd, yyyy")
                          : "Never"
                        }
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Added</span>
                      <Badge variant="default">
                        {format(new Date(contact.createdAt), "MMM dd, yyyy")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Quick Actions
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                      Note
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <Button variant="primary" className="flex-1">
                  <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                  Edit Contact
                </Button>
                <Button variant="ghost" size="icon">
                  <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactDetailPanel;