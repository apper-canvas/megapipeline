import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format, isPast } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'default',
      'In Progress': 'primary',
      'Completed': 'success'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'secondary'
    };
    return colors[priority] || 'default';
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== 'Completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getStatusColor(task.status)} size="sm">
              {task.status}
            </Badge>
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Calendar" size={14} className="mr-2 flex-shrink-0" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            Due: {format(dueDate, 'MMM dd, yyyy')}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>

        {task.contactName && (
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="User" size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{task.contactName}</span>
          </div>
        )}

        {task.company && (
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Building2" size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{task.company}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
          className="flex-1"
        >
          <ApperIcon name="Edit2" size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(task.Id)}
          className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <ApperIcon name="Trash2" size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskCard;