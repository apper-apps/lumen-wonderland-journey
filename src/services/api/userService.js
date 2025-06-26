import { toast } from 'react-toastify';

class UserService {
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

  async getCurrentUser() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "joined_date" } },
          { field: { Name: "avatar" } },
          { field: { Name: "total_lessons_completed" } },
          { field: { Name: "current_streak" } },
          { field: { Name: "total_watch_time" } },
          { field: { Name: "last_active" } },
          { field: { Name: "first_lesson" } },
          { field: { Name: "week_streak" } },
          { field: { Name: "early_bird" } },
          { field: { Name: "Tags" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "joined_date" } },
          { field: { Name: "avatar" } },
          { field: { Name: "total_lessons_completed" } },
          { field: { Name: "current_streak" } },
          { field: { Name: "total_watch_time" } },
          { field: { Name: "last_active" } },
          { field: { Name: "first_lesson" } },
          { field: { Name: "week_streak" } },
          { field: { Name: "early_bird" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById('user_profile', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('User not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw new Error('User not found');
    }
  }

  async create(userData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: userData.Name,
        email: userData.email,
        joined_date: userData.joined_date,
        avatar: userData.avatar,
        total_lessons_completed: userData.total_lessons_completed,
        current_streak: userData.current_streak,
        total_watch_time: userData.total_watch_time,
        last_active: userData.last_active,
        first_lesson: userData.first_lesson,
        week_streak: userData.week_streak,
        early_bird: userData.early_bird,
        Tags: userData.Tags,
        Owner: userData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create user');
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
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: userData.Name,
        email: userData.email,
        joined_date: userData.joined_date,
        avatar: userData.avatar,
        total_lessons_completed: userData.total_lessons_completed,
        current_streak: userData.current_streak,
        total_watch_time: userData.total_watch_time,
        last_active: userData.last_active,
        first_lesson: userData.first_lesson,
        week_streak: userData.week_streak,
        early_bird: userData.early_bird,
        Tags: userData.Tags,
        Owner: userData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update user');
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
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('user_profile', params);
      
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
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new UserService();