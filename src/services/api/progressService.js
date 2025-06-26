import { toast } from 'react-toastify';

class ProgressService {
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
          { field: { Name: "completion_percentage" } },
          { field: { Name: "last_accessed" } },
          { field: { Name: "bookmarks" } },
          { field: { Name: "notes" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "lesson_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching progress records:', error);
      toast.error('Failed to fetch progress records');
      return [];
    }
  }

  async getUserProgress(userId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completion_percentage" } },
          { field: { Name: "last_accessed" } },
          { field: { Name: "bookmarks" } },
          { field: { Name: "notes" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "lesson_id" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [parseInt(userId, 10)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }

  async getLessonProgress(userId, lessonId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completion_percentage" } },
          { field: { Name: "last_accessed" } },
          { field: { Name: "bookmarks" } },
          { field: { Name: "notes" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "lesson_id" } },
          { field: { Name: "user_id" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                operator: "AND",
                conditions: [
                  {
                    fieldName: "user_id",
                    operator: "EqualTo",
                    values: [parseInt(userId, 10)]
                  },
                  {
                    fieldName: "lesson_id",
                    operator: "EqualTo",
                    values: [parseInt(lessonId, 10)]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return null;
    }
  }

  async create(progressData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: progressData.Name,
        completion_percentage: progressData.completion_percentage,
        last_accessed: progressData.last_accessed,
        bookmarks: progressData.bookmarks,
        notes: progressData.notes,
        completed_at: progressData.completed_at,
        lesson_id: progressData.lesson_id,
        user_id: progressData.user_id,
        Tags: progressData.Tags,
        Owner: progressData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create progress record');
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
      console.error('Error creating progress record:', error);
      throw error;
    }
  }

  async update(id, progressData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: progressData.Name,
        completion_percentage: progressData.completion_percentage,
        last_accessed: progressData.last_accessed,
        bookmarks: progressData.bookmarks,
        notes: progressData.notes,
        completed_at: progressData.completed_at,
        lesson_id: progressData.lesson_id,
        user_id: progressData.user_id,
        Tags: progressData.Tags,
        Owner: progressData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update progress record');
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
      console.error('Error updating progress record:', error);
      throw error;
    }
  }

  async updateProgress(userId, lessonId, progressData) {
    try {
      // First try to find existing progress
      const existing = await this.getLessonProgress(userId, lessonId);
      
      if (existing) {
        // Update existing record
        const updateData = {
          ...progressData,
          last_accessed: new Date().toISOString()
        };
        return await this.update(existing.Id, updateData);
      } else {
        // Create new progress record
        const newProgress = {
          Name: `Progress for Lesson ${lessonId}`,
          completion_percentage: 0,
          last_accessed: new Date().toISOString(),
          bookmarks: "",
          notes: "",
          completed_at: null,
          lesson_id: parseInt(lessonId, 10),
          user_id: parseInt(userId, 10),
          ...progressData
        };
        return await this.create(newProgress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  async addBookmark(userId, lessonId, timestamp) {
    try {
      const existing = await this.getLessonProgress(userId, lessonId);
      
      if (existing) {
        // Parse existing bookmarks (stored as comma-separated string)
        const currentBookmarks = existing.bookmarks ? existing.bookmarks.split(',').map(b => b.trim()).filter(b => b) : [];
        
        // Add new bookmark if it doesn't exist
        if (!currentBookmarks.includes(timestamp.toString())) {
          currentBookmarks.push(timestamp.toString());
        }
        
        // Update with new bookmarks string
        const updateData = {
          bookmarks: currentBookmarks.join(',')
        };
        
        return await this.update(existing.Id, updateData);
      }
      
      return null;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('progress', params);
      
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
      console.error('Error deleting progress record:', error);
      throw error;
    }
  }
}

export default new ProgressService();