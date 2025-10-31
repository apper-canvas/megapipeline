import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import ContactTable from "@/components/organisms/ContactTable";
import ContactDetailPanel from "@/components/organisms/ContactDetailPanel";
import ContactForm from "@/components/organisms/ContactForm";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import Pagination from "@/components/molecules/Pagination";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact => {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
        contact.phone.toLowerCase().includes(searchLower)
      );
    });
    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, contacts]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setIsDetailPanelOpen(true);
  };

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [newContact, ...prev]);
      toast.success("Contact added successfully!");
    } catch (err) {
      toast.error("Failed to add contact. Please try again.");
      throw err;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination calculations
  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <Loading rows={10} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Error
          title="Unable to load contacts"
          message={error}
          onRetry={loadContacts}
        />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Empty
          title="No contacts yet"
          message="Start building your network by adding your first contact. Keep track of important connections and never lose touch with valuable relationships."
          icon="Users"
          buttonText="Add First Contact"
          onAction={() => setIsFormOpen(true)}
        />
        
        <ContactForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddContact}
        />
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Contacts
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your customer relationships and contacts
            </p>
          </div>
          
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search contacts..."
            className="w-full sm:w-64"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
            <div className="flex items-center">
              <div className="p-2 bg-primary-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-primary-600">Total Contacts</p>
                <p className="text-2xl font-bold text-primary-700">{contacts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-6 border border-accent-200">
            <div className="flex items-center">
              <div className="p-2 bg-accent-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-accent-600">Companies</p>
                <p className="text-2xl font-bold text-accent-700">
                  {new Set(contacts.filter(c => c.company).map(c => c.company)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-6 border border-secondary-200">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">This Month</p>
                <p className="text-2xl font-bold text-secondary-700">
                  {contacts.filter(c => {
                    const contactDate = new Date(c.createdAt);
                    const now = new Date();
                    return contactDate.getMonth() === now.getMonth() && 
                           contactDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Showing {filteredContacts.length} of {contacts.length} contacts 
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Contact Table */}
        {filteredContacts.length === 0 && searchTerm ? (
          <Empty
            title="No contacts found"
            message={`We couldn't find any contacts matching "${searchTerm}". Try adjusting your search terms or add a new contact.`}
            icon="Search"
            buttonText="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <>
            <ContactTable
              contacts={currentContacts}
              onContactClick={handleContactClick}
              loading={false}
            />

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
        tooltip="Add new contact"
      />

      {/* Contact Detail Panel */}
      <ContactDetailPanel
        contact={selectedContact}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
      />

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddContact}
      />
    </div>
  );
};

export default ContactsPage;