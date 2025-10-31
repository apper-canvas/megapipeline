import mockData from '@/services/mockData/companies.json';

let companies = [...mockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const companyService = {
  async getAll() {
    await delay(300);
    return [...companies].sort((a, b) => b.Id - a.Id);
  },

  async getById(id) {
    await delay(300);
    const company = companies.find(c => c.Id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(300);
    const newCompany = {
      ...companyData,
      Id: companies.length > 0 ? Math.max(...companies.map(c => c.Id)) + 1 : 1,
      contactCount: 0,
      dealCount: 0,
      createdAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(300);
    const index = companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies[index] = {
      ...companies[index],
      ...companyData,
      Id: id
    };
    return { ...companies[index] };
  },

  async delete(id) {
    await delay(300);
    const index = companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm) ||
      company.industry.toLowerCase().includes(searchTerm)
    );
  }
};

export default companyService;