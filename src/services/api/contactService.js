import contactsData from "@/services/mockData/contacts.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await delay(300);
    return [...this.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(Id) {
    await delay(200);
    const contact = this.contacts.find(c => c.Id === parseInt(Id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await delay(400);
    
    // Generate new ID
    const maxId = Math.max(...this.contacts.map(c => c.Id), 0);
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      lastContactDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.contacts.unshift(newContact);
    return { ...newContact };
  }

  async update(Id, updateData) {
    await delay(350);
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.contacts[index] };
  }

  async delete(Id) {
    await delay(300);
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }

  async search(query) {
    await delay(250);
    
    const searchTerm = query.toLowerCase();
    return this.contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm)) ||
      contact.phone.toLowerCase().includes(searchTerm)
    );
  }
}

export const contactService = new ContactService();