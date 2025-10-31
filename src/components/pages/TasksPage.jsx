import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";
import TaskForm from "@/components/organisms/TaskForm";
import TaskCard from "@/components/organisms/TaskCard";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Pagination from "@/components/molecules/Pagination";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import SearchBar from "@/components/molecules/SearchBar";
import { cn } from "@/utils/cn";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks([newTask, ...tasks]);
      setIsFormOpen(false);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    }
  };

  const handleUpdate = async (taskData) => {
    try {
      const updated = await taskService.update(editingTask.Id, taskData);
      setTasks(tasks.map(t => t.Id === updated.Id ? updated : t));
      setIsFormOpen(false);
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t.Id !== id));
      setDeleteConfirm(null);
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.contactName && task.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.company && task.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const overdueCount = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return new Date() > dueDate && t.status !== 'Completed';
  }).length;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  if (tasks.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
          <Empty
            title="Create your first task"
            message="Stay on top of your responsibilities by creating tasks. Set reminders, track progress, and never miss important follow-ups with your contacts and deals."
            icon="CheckSquare"
            buttonText="Create Task"
            onAction={() => setIsFormOpen(true)}
          />
        </div>
        
        <TaskForm
          isOpen={isFormOpen}
          task={null}
          onSubmit={handleCreate}
          onCancel={handleCloseForm}
        />
      </div>
    );
  }

return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <p className="text-gray-600 mt-1">
              Manage your tasks and stay organized
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {tasks.length}
              </div>
              <div className="text-xs text-gray-500">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedCount}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {overdueCount}
              </div>
              <div className="text-xs text-gray-500">Overdue</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-l-md border",
                    viewMode === "grid"
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name="LayoutGrid" size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-r-md border",
                    viewMode === "list"
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>

              {/* Add Task Button (Desktop) */}
              <Button
                variant="primary"
                onClick={() => setIsFormOpen(true)}
                className="hidden sm:flex"
              >
                <ApperIcon name="Plus" size={16} />
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            <Empty
              title="No tasks found"
              message="Try adjusting your search or filters to find what you're looking for."
              icon="Search"
              buttonText="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterPriority("all");
              }}
            />
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTasks.map(task => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={() => setDeleteConfirm(task)}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {currentTasks.map(task => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={() => setDeleteConfirm(task)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                className="mt-6"
              />
            )}
          </>
        )}
      </motion.div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsFormOpen(true)}
        tooltip="Add new task"
      />

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? 
              This will permanently remove the task.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDelete(deleteConfirm.Id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Task
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;