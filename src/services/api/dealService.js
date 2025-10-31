import mockDeals from "@/services/mockData/deals.json";

/**
 * Deal Service
 * Handles all deal-related operations with mock data storage
 * 
 * FIELD MAPPING (for future database integration):
 * - Id: integer (auto-generated, never modified)
 * - name: string (required)
 * - company: string (required)
 * - contactName: string (required)
 * - value: number (required, deal value in dollars)
 * - stage: string (Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost)
 * - expectedCloseDate: string (ISO date format)
 * - probability: number (0-100, percentage)
 * - description: string (optional)
 * - lastUpdated: string (ISO datetime, auto-updated)
 * 
 * MIGRATION NOTES:
 * When database table becomes available:
 * 1. Replace mock data operations with database queries
 * 2. Maintain exact same function signatures
 * 3. Keep ID as integer type for consistency
 * 4. Add proper error handling for database operations
 */

// In-memory storage (persists during session only)
let deals = [...mockDeals];

// Simulate network delay for realistic behavior
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const dealService = {
  /**
   * Get all deals
   * @returns {Promise<Array>} Array of all deals
   */
  async getAll() {
    await delay();
    // Return a copy to prevent direct manipulation
    return deals.map(deal => ({ ...deal }));
  },

  /**
   * Get deal by ID
   * @param {number} id - Deal ID
   * @returns {Promise<Object>} Deal object
   * @throws {Error} If deal not found
   */
  async getById(id) {
    await delay();
    const dealId = parseInt(id, 10);
    const deal = deals.find(d => d.Id === dealId);
    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    return { ...deal };
  },

  /**
   * Create new deal
   * @param {Object} dealData - Deal data (without Id)
   * @returns {Promise<Object>} Created deal with generated Id
   */
  async create(dealData) {
    await delay();
    
    // Generate new ID (max existing ID + 1)
    const maxId = deals.reduce((max, d) => Math.max(max, d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      lastUpdated: new Date().toISOString()
    };
    
    deals.push(newDeal);
    return { ...newDeal };
  },

  /**
   * Update existing deal
   * @param {number} id - Deal ID to update
   * @param {Object} dealData - Updated deal data
   * @returns {Promise<Object>} Updated deal
   * @throws {Error} If deal not found
   */
  async update(id, dealData) {
    await delay();
    
    const dealId = parseInt(id, 10);
    const index = deals.findIndex(d => d.Id === dealId);
    
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    // Preserve Id and update lastUpdated
    const updatedDeal = {
      ...dealData,
      Id: dealId,
      lastUpdated: new Date().toISOString()
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  /**
   * Delete deal
   * @param {number} id - Deal ID to delete
   * @returns {Promise<boolean>} True if deleted successfully
   * @throws {Error} If deal not found
   */
  async delete(id) {
    await delay();
    
    const dealId = parseInt(id, 10);
    const index = deals.findIndex(d => d.Id === dealId);
    
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    deals.splice(index, 1);
    return true;
  },

  /**
   * Get deals by stage
   * @param {string} stage - Pipeline stage
   * @returns {Promise<Array>} Deals in specified stage
   */
  async getByStage(stage) {
    await delay();
    return deals
      .filter(d => d.stage === stage)
      .map(deal => ({ ...deal }));
  },

  /**
   * Get deal statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    await delay();
    
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
    const wonDeals = deals.filter(d => d.stage === "Closed Won");
    const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const lostDeals = deals.filter(d => d.stage === "Closed Lost");
    const activeDealCount = deals.filter(
      d => d.stage !== "Closed Won" && d.stage !== "Closed Lost"
    ).length;
    
    return {
      totalValue,
      wonValue,
      wonCount: wonDeals.length,
      lostCount: lostDeals.length,
      activeDealCount,
      totalCount: deals.length
    };
  }
};

export default dealService;