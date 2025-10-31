import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const STAGE_COLORS = {
  "Lead": "default",
  "Qualified": "primary",
  "Proposal": "secondary",
  "Negotiation": "warning",
  "Closed Won": "success",
  "Closed Lost": "danger"
};

const DealCard = ({ deal, onEdit, onDelete }) => {
  const stageColor = STAGE_COLORS[deal.stage] || "default";
  const closeDate = new Date(deal.expectedCloseDate);
  const daysUntilClose = Math.ceil((closeDate - new Date()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilClose < 0 && deal.stage !== "Closed Won" && deal.stage !== "Closed Lost";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {deal.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">{deal.company}</p>
        </div>
        <Badge variant={stageColor} className="ml-2 shrink-0">
          {deal.probability}%
        </Badge>
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="text-lg font-bold text-gray-900">
          ${(deal.value / 1000).toFixed(0)}K
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <ApperIcon name="User" size={12} />
          {deal.contactName}
        </div>
      </div>

      {/* Close Date */}
      <div className={`flex items-center gap-1 text-xs mb-3 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
        <ApperIcon name="Calendar" size={12} />
        {isOverdue ? (
          <span className="font-medium">Overdue {Math.abs(daysUntilClose)} days</span>
        ) : daysUntilClose === 0 ? (
          <span>Closes today</span>
        ) : daysUntilClose > 0 ? (
          <span>Closes in {daysUntilClose} days</span>
        ) : (
          <span>{closeDate.toLocaleDateString()}</span>
        )}
      </div>

      {/* Description Preview */}
      {deal.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {deal.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex-1"
        >
          <ApperIcon name="Edit" size={14} />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </motion.div>
  );
};

export default DealCard;