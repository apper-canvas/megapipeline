import dealService from '@/services/api/dealService';
import { ContactService } from '@/services/api/contactService';
const contactService = new ContactService();
import companyService from '@/services/api/companyService';
import taskService from '@/services/api/taskService';

// Simulate realistic delay for async operations
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Analytics Service
 * Aggregates data from all entity services to provide insights
 */

const analyticsService = {
  /**
   * Get comprehensive analytics data
   * @returns {Promise<Object>} Analytics metrics and data
   */
  async getAnalytics() {
    await delay(500); // Simulate API call

    try {
      // Fetch all data in parallel
      const [deals, contacts, companies, tasks] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
        taskService.getAll()
      ]);

      // Calculate total revenue from all deals
      const totalRevenue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

      // Calculate conversion rate (closed-won deals / total deals)
      const closedWonDeals = deals.filter(deal => deal.stage === 'Closed Won').length;
      const conversionRate = deals.length > 0 
        ? ((closedWonDeals / deals.length) * 100).toFixed(1)
        : 0;

      // Count active deals (not closed-won or closed-lost)
      const activeDeals = deals.filter(
        deal => deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost'
      ).length;

      // Total contacts count
      const totalContacts = contacts.length;

      // Deal pipeline distribution by stage
      const pipelineData = deals.reduce((acc, deal) => {
        const stage = deal.stage || 'Unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});

      // Convert pipeline data to array format for charts
      const pipelineArray = Object.entries(pipelineData).map(([stage, count]) => ({
        stage,
        count
      }));

      // Calculate monthly revenue trends (last 6 months)
      const monthlyRevenue = this.calculateMonthlyRevenue(deals);

      return {
        totalRevenue,
        conversionRate: parseFloat(conversionRate),
        activeDeals,
        totalContacts,
        pipelineDistribution: pipelineArray,
        revenueByMonth: monthlyRevenue
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to load analytics data');
    }
  },

  /**
   * Calculate revenue distribution by month
   * @param {Array} deals - Array of deals
   * @returns {Array} Monthly revenue data
   */
  calculateMonthlyRevenue(deals) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    // Generate last 6 months of data
    const monthlyData = months.map((month, index) => {
      // Simulate revenue distribution across months
      const baseRevenue = deals
        .filter(deal => deal.stage === 'Closed Won')
        .reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      // Distribute revenue with some variance
      const variance = 0.7 + (Math.random() * 0.6); // 70%-130%
      const monthRevenue = Math.floor((baseRevenue / 6) * variance);
      
      return {
        month,
        revenue: monthRevenue
      };
    });

    return monthlyData;
  }
};

export default analyticsService;