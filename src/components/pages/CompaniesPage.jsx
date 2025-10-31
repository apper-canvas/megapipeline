import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import companyService from '@/services/api/companyService';
import CompanyForm from '@/components/organisms/CompanyForm';
import CompanyCard from '@/components/organisms/CompanyCard';
import SearchBar from '@/components/molecules/SearchBar';
import FloatingActionButton from '@/components/molecules/FloatingActionButton';
import Pagination from '@/components/molecules/Pagination';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const itemsPerPage = 9;

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
    setCurrentPage(1);
  }, [searchQuery, companies]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (companyData) => {
    try {
      await companyService.create(companyData);
      toast.success('Company added successfully!');
      setShowForm(false);
      loadCompanies();
    } catch (err) {
      toast.error('Failed to add company');
    }
  };

  const handleUpdate = async (companyData) => {
    try {
      await companyService.update(selectedCompany.Id, companyData);
      toast.success('Company updated successfully!');
      setShowForm(false);
      setSelectedCompany(null);
      loadCompanies();
    } catch (err) {
      toast.error('Failed to update company');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    try {
      await companyService.delete(id);
      toast.success('Company deleted successfully!');
      loadCompanies();
    } catch (err) {
      toast.error('Failed to delete company');
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCompany(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCompanies} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
            <p className="text-gray-600 mt-1">
              Manage your business relationships and company information
            </p>
          </div>
          {companies.length > 0 && (
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search companies..."
              className="sm:w-80"
            />
          )}
        </div>

        {companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            <Empty
              title="Add your first company"
              message="Build a comprehensive directory of companies you work with. Track key information, contacts, and business relationships to strengthen your partnerships."
              icon="Building2"
              buttonText="Add Company"
              onAction={() => setShowForm(true)}
            />
          </div>
        ) : (
          <>
            {filteredCompanies.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <Empty
                  title="No companies found"
                  message="Try adjusting your search criteria"
                  icon="Search"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCompanies.map((company) => (
                    <CompanyCard
                      key={company.Id}
                      company={company}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}

        <FloatingActionButton
          onClick={() => setShowForm(true)}
          tooltip="Add Company"
        />

        {showForm && (
          <CompanyForm
            company={selectedCompany}
            onSubmit={selectedCompany ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CompaniesPage;