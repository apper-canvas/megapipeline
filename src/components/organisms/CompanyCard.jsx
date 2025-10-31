import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const CompanyCard = ({ company, onEdit, onDelete }) => {
  const getIndustryColor = (industry) => {
    const colors = {
      Technology: 'primary',
      Finance: 'secondary',
      Healthcare: 'accent',
      Manufacturing: 'default',
      Retail: 'primary',
      Education: 'secondary',
      Energy: 'accent',
      'Real Estate': 'default',
      Consulting: 'primary',
      Other: 'default'
    };
    return colors[industry] || 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Building2" size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {company.name}
            </h3>
            <Badge variant={getIndustryColor(company.industry)} size="sm" className="mt-1">
              {company.industry}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {company.website && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Globe" size={16} className="mr-2 flex-shrink-0" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 truncate"
            >
              {company.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}

        {company.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{company.phone}</span>
          </div>
        )}

        {company.email && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{company.email}</span>
          </div>
        )}

        {company.address && (
          <div className="flex items-start text-sm text-gray-600">
            <ApperIcon name="MapPin" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{company.address}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {company.contactCount || 0}
            </div>
            <div className="text-xs text-gray-500">Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {company.dealCount || 0}
            </div>
            <div className="text-xs text-gray-500">Deals</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(company)}
            className="flex-1"
          >
            <ApperIcon name="Edit2" size={16} className="mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(company.Id)}
            className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCard;