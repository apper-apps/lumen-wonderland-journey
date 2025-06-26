import { toast } from 'react-toastify';

class WisdomService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author" } },
          { field: { Name: "category" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('wisdom', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching wisdom quotes:', error);
      toast.error('Failed to fetch wisdom quotes');
      return [];
    }
  }

  async getDailyQuote() {
    try {
      const allQuotes = await this.getAll();
      if (allQuotes.length === 0) {
        return null;
      }

      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      const quoteIndex = dayOfYear % allQuotes.length;
      
      return allQuotes[quoteIndex];
    } catch (error) {
      console.error('Error getting daily wisdom quote:', error);
      throw new Error('Failed to get daily wisdom quote');
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author" } },
          { field: { Name: "category" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById('wisdom', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Wisdom quote not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching wisdom quote by id:', error);
      throw new Error('Wisdom quote not found');
    }
  }

  async create(wisdomData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: wisdomData.Name,
        text: wisdomData.text,
        author: wisdomData.author,
        category: wisdomData.category,
        Tags: wisdomData.Tags,
        Owner: wisdomData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('wisdom', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create wisdom quote');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }

      return response.data;
    } catch (error) {
      console.error('Error creating wisdom quote:', error);
      throw error;
    }
  }

  async update(id, wisdomData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: wisdomData.Name,
        text: wisdomData.text,
        author: wisdomData.author,
        category: wisdomData.category,
        Tags: wisdomData.Tags,
        Owner: wisdomData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('wisdom', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update wisdom quote');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }

      return response.data;
    } catch (error) {
      console.error('Error updating wisdom quote:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('wisdom', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0;
      }

      return true;
    } catch (error) {
      console.error('Error deleting wisdom quote:', error);
      throw error;
    }
  }
}

const wisdomService = new WisdomService();
export default wisdomService;