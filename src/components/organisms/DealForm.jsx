import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const PIPELINE_STAGES = [
  "Lead",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost"
];

const DealForm = ({ deal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contactName: "",
    value: "",
    stage: "Lead",
    expectedCloseDate: "",
    probability: "50",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || "",
        company: deal.company || "",
        contactName: deal.contactName || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        expectedCloseDate: deal.expectedCloseDate?.split('T')[0] || "",
        probability: deal.probability?.toString() || "50",
        description: deal.description || ""
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Valid deal value is required";
    }
    
    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }
    
    if (!formData.probability || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: formData.name.trim(),
        company: formData.company.trim(),
        contactName: formData.contactName.trim(),
        value: parseFloat(formData.value),
        stage: formData.stage,
        expectedCloseDate: formData.expectedCloseDate,
        probability: parseInt(formData.probability, 10),
        description: formData.description.trim()
      });
    } catch (error) {
      console.error("Error saving deal:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <ApperIcon name="Target" size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {deal ? "Edit Deal" : "New Deal"}
              </h2>
              <p className="text-sm text-gray-500">
                {deal ? "Update deal information" : "Add a new deal to your pipeline"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deal Name */}
            <FormField
              label="Deal Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Enter deal name"
              className="md:col-span-2"
            />

            {/* Company */}
            <FormField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              required
              placeholder="Company name"
            />

            {/* Contact Name */}
            <FormField
              label="Contact Name"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              error={errors.contactName}
              required
              placeholder="Primary contact"
            />

            {/* Value */}
            <FormField
              label="Deal Value ($)"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              error={errors.value}
              required
              placeholder="0"
              min="0"
              step="1"
            />

            {/* Stage */}
            <div className="space-y-1">
              <Label required>Pipeline Stage</Label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {PIPELINE_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Expected Close Date */}
            <FormField
              label="Expected Close Date"
              name="expectedCloseDate"
              type="date"
              value={formData.expectedCloseDate}
              onChange={handleChange}
              error={errors.expectedCloseDate}
              required
            />

            {/* Probability */}
            <div className="space-y-1">
              <Label required>Probability (%)</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  name="probability"
                  value={formData.probability}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="5"
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {formData.probability}%
                </span>
              </div>
              {errors.probability && (
                <p className="text-sm text-red-600 mt-1">{errors.probability}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details about this deal..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  {deal ? "Update Deal" : "Create Deal"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DealForm;