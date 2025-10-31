import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const ContactTable = ({ contacts, onContactClick, loading = false }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedContacts = () => {
    if (!contacts?.length) return [];
    
    return [...contacts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date sorting
      if (sortField === "lastContactDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const sortedContacts = getSortedContacts();

  const SortHeader = ({ field, children, className }) => (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        <div className="flex flex-col">
          <ApperIcon 
            name="ChevronUp" 
            className={cn(
              "h-3 w-3 transition-colors duration-200",
              sortField === field && sortDirection === "asc" 
                ? "text-primary-600" 
                : "text-gray-400"
            )} 
          />
          <ApperIcon 
            name="ChevronDown" 
            className={cn(
              "h-3 w-3 -mt-1 transition-colors duration-200",
              sortField === field && sortDirection === "desc" 
                ? "text-primary-600" 
                : "text-gray-400"
            )} 
          />
        </div>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-50 px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="company">Company</SortHeader>
              <SortHeader field="email">Email</SortHeader>
              <SortHeader field="phone">Phone</SortHeader>
              <SortHeader field="lastContactDate">Last Contact</SortHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedContacts.map((contact, index) => (
              <motion.tr
                key={contact.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                onClick={() => onContactClick(contact)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {contact.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.company || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{contact.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {contact.lastContactDate ? format(new Date(contact.lastContactDate), "MMM dd, yyyy") : "Never"}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;