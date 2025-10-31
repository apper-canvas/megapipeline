import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import dealService from "@/services/api/dealService";
import DealForm from "@/components/organisms/DealForm";
import DealCard from "@/components/organisms/DealCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { cn } from "@/utils/cn";

const PIPELINE_STAGES = [
  { value: "Lead", label: "Lead", color: "default" },
  { value: "Qualified", label: "Qualified", color: "primary" },
  { value: "Proposal", label: "Proposal", color: "secondary" },
  { value: "Negotiation", label: "Negotiation", color: "warning" },
  { value: "Closed Won", label: "Closed Won", color: "success" },
  { value: "Closed Lost", label: "Closed Lost", color: "danger" }
];

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [viewMode, setViewMode] = useState("pipeline"); // pipeline, table, list
  const [sortBy, setSortBy] = useState("value"); // value, closeDate, updated
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData);
      setDeals([...deals, newDeal]);
      setIsFormOpen(false);
      toast.success("Deal created successfully!");
    } catch (err) {
      toast.error("Failed to create deal");
      throw err;
    }
  };

  const handleUpdate = async (dealData) => {
    try {
      const updated = await dealService.update(editingDeal.Id, dealData);
      setDeals(deals.map(d => d.Id === updated.Id ? updated : d));
      setIsFormOpen(false);
      setEditingDeal(null);
      toast.success("Deal updated successfully!");
    } catch (err) {
      toast.error("Failed to update deal");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await dealService.delete(id);
      setDeals(deals.filter(d => d.Id !== id));
      setDeleteConfirm(null);
      toast.success("Deal deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete deal");
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDeal(null);
  };

  const filteredAndSortedDeals = deals
    .filter(deal => {
      const matchesSearch = !searchTerm || 
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = filterStage === "all" || deal.stage === filterStage;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === "value") return b.value - a.value;
      if (sortBy === "closeDate") return new Date(a.expectedCloseDate) - new Date(b.expectedCloseDate);
      if (sortBy === "updated") return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      return 0;
    });

  const dealsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.value] = filteredAndSortedDeals.filter(d => d.stage === stage.value);
    return acc;
  }, {});

  const totalValue = filteredAndSortedDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(d => d.stage === "Closed Won");
  const totalWonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

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
            <h2 className="text-2xl font-bold text-gray-900">Deals Pipeline</h2>
            <p className="text-gray-600 mt-1">
              Track your sales opportunities through the pipeline
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${(totalValue / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-gray-500">Pipeline Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(totalWonValue / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-gray-500">Won This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {filteredAndSortedDeals.length}
              </div>
              <div className="text-xs text-gray-500">Active Deals</div>
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
                placeholder="Search deals by name or company..."
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Stage Filter */}
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Stages</option>
                {PIPELINE_STAGES.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="value">Sort by Value</option>
                <option value="closeDate">Sort by Close Date</option>
                <option value="updated">Sort by Last Updated</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode("pipeline")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-l-md border",
                    viewMode === "pipeline"
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name="LayoutGrid" size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium border-t border-b",
                    viewMode === "table"
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name="Table" size={16} />
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

              {/* Add Deal Button (Desktop) */}
              <Button
                variant="primary"
                onClick={() => setIsFormOpen(true)}
                className="hidden sm:flex"
              >
                <ApperIcon name="Plus" size={16} />
                Add Deal
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedDeals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            <Empty
              title={searchTerm || filterStage !== "all" ? "No deals found" : "No deals yet"}
              message={
                searchTerm || filterStage !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start tracking your sales opportunities by creating your first deal. Organize prospects through your sales pipeline and never miss a revenue opportunity."
              }
              icon="Target"
              buttonText="Create First Deal"
              onAction={() => setIsFormOpen(true)}
            />
          </div>
        ) : (
          <>
            {/* Pipeline View */}
            {viewMode === "pipeline" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {PIPELINE_STAGES.map(stage => {
                  const stageDeals = dealsByStage[stage.value] || [];
                  const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                  
                  return (
                    <motion.div
                      key={stage.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {stageDeals.length} deals · ${(stageValue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <Badge variant={stage.color}>{stageDeals.length}</Badge>
                      </div>
                      
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {stageDeals.map(deal => (
                          <DealCard
                            key={deal.Id}
                            deal={deal}
                            onEdit={() => handleEdit(deal)}
                            onDelete={() => setDeleteConfirm(deal)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deal Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Close Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedDeals.map(deal => {
                        const stage = PIPELINE_STAGES.find(s => s.value === deal.stage);
                        return (
                          <motion.tr
                            key={deal.Id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                              <div className="text-xs text-gray-500">{deal.contactName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {deal.company}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${deal.value.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={stage?.color}>{deal.stage}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(deal.expectedCloseDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(deal)}
                              >
                                <ApperIcon name="Edit" size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm(deal)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </Button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {filteredAndSortedDeals.map(deal => {
                  const stage = PIPELINE_STAGES.find(s => s.value === deal.stage);
                  return (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {deal.name}
                            </h3>
                            <Badge variant={stage?.color}>{deal.stage}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ApperIcon name="Building2" size={14} />
                              {deal.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <ApperIcon name="User" size={14} />
                              {deal.contactName}
                            </span>
                            <span className="flex items-center gap-1">
                              <ApperIcon name="DollarSign" size={14} />
                              ${deal.value.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ApperIcon name="Calendar" size={14} />
                              {new Date(deal.expectedCloseDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(deal)}
                          >
                            <ApperIcon name="Edit" size={16} />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(deal)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Floating Action Button (Mobile) */}
      <FloatingActionButton
        onClick={() => setIsFormOpen(true)}
        tooltip="Add new deal"
      />

      {/* Deal Form Modal */}
      {isFormOpen && (
        <DealForm
          deal={editingDeal}
          onSave={editingDeal ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Deal</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
              This will permanently remove the deal and all associated data.
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
                Delete Deal
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DealsPage;