import { toast } from 'react-toastify';

class CoachingService {
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
          { field: { Name: "title" } },
          { field: { Name: "marco_polo_link" } },
          { field: { Name: "type" } },
          { field: { Name: "schedule" } },
          { field: { Name: "description" } },
          { field: { Name: "max_participants" } },
          { field: { Name: "current_participants" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "duration" } },
          { field: { Name: "price" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('coaching', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching coaching sessions:', error);
      toast.error('Failed to fetch coaching sessions');
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "marco_polo_link" } },
          { field: { Name: "type" } },
          { field: { Name: "schedule" } },
          { field: { Name: "description" } },
          { field: { Name: "max_participants" } },
          { field: { Name: "current_participants" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "duration" } },
          { field: { Name: "price" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById('coaching', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Coaching session not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching coaching session by id:', error);
      throw new Error('Coaching session not found');
    }
  }

  async getByType(type) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "marco_polo_link" } },
          { field: { Name: "type" } },
          { field: { Name: "schedule" } },
          { field: { Name: "description" } },
          { field: { Name: "max_participants" } },
          { field: { Name: "current_participants" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "duration" } },
          { field: { Name: "price" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('coaching', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching coaching sessions by type:', error);
      return [];
    }
  }

  async getUpcoming() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "marco_polo_link" } },
          { field: { Name: "type" } },
          { field: { Name: "schedule" } },
          { field: { Name: "description" } },
          { field: { Name: "max_participants" } },
          { field: { Name: "current_participants" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "duration" } },
          { field: { Name: "price" } }
        ],
        where: [
          {
            FieldName: "schedule",
            Operator: "GreaterThan",
            Values: [new Date().toISOString()]
          }
        ],
        orderBy: [
          {
            fieldName: "schedule",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('coaching', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching upcoming coaching sessions:', error);
      return [];
    }
  }

  async create(coachingData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: coachingData.Name,
        title: coachingData.title,
        marco_polo_link: coachingData.marco_polo_link,
        type: coachingData.type,
        schedule: coachingData.schedule,
        description: coachingData.description,
        max_participants: coachingData.max_participants,
        current_participants: coachingData.current_participants,
        thumbnail: coachingData.thumbnail,
        duration: coachingData.duration,
        price: coachingData.price,
        Tags: coachingData.Tags,
        Owner: coachingData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('coaching', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create coaching session');
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
      console.error('Error creating coaching session:', error);
      throw error;
    }
  }

  async update(id, coachingData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: coachingData.Name,
        title: coachingData.title,
        marco_polo_link: coachingData.marco_polo_link,
        type: coachingData.type,
        schedule: coachingData.schedule,
        description: coachingData.description,
        max_participants: coachingData.max_participants,
        current_participants: coachingData.current_participants,
        thumbnail: coachingData.thumbnail,
        duration: coachingData.duration,
        price: coachingData.price,
        Tags: coachingData.Tags,
        Owner: coachingData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('coaching', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update coaching session');
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
      console.error('Error updating coaching session:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('coaching', params);
      
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
      console.error('Error deleting coaching session:', error);
      throw error;
    }
  }
}

export default new CoachingService();