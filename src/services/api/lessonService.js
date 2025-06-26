import { toast } from 'react-toastify';

class LessonService {
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
          { field: { Name: "description" } },
          { field: { Name: "price" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "duration" } },
          { field: { Name: "featured" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "instructor" } },
          { field: { Name: "level" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('lesson', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to fetch lessons');
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
          { field: { Name: "description" } },
          { field: { Name: "price" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "duration" } },
          { field: { Name: "featured" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "instructor" } },
          { field: { Name: "level" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById('lesson', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Lesson not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching lesson by id:', error);
      throw new Error('Lesson not found');
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "price" } },
          { field: { Name: "category" } },
          { field: { Name: "duration" } },
          { field: { Name: "featured" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "instructor" } },
          { field: { Name: "level" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('lesson', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching lessons by category:', error);
      return [];
    }
  }

  async getFeatured() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "price" } },
          { field: { Name: "category" } },
          { field: { Name: "duration" } },
          { field: { Name: "featured" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "instructor" } },
          { field: { Name: "level" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "featured",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('lesson', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching featured lessons:', error);
      return [];
    }
  }

  async create(lessonData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: lessonData.Name,
        title: lessonData.title,
        description: lessonData.description,
        price: lessonData.price,
        content: lessonData.content,
        category: lessonData.category,
        duration: lessonData.duration,
        featured: lessonData.featured,
        thumbnail: lessonData.thumbnail,
        instructor: lessonData.instructor,
        level: lessonData.level,
        Tags: lessonData.Tags,
        Owner: lessonData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('lesson', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create lesson');
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
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  async update(id, lessonData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: lessonData.Name,
        title: lessonData.title,
        description: lessonData.description,
        price: lessonData.price,
        content: lessonData.content,
        category: lessonData.category,
        duration: lessonData.duration,
        featured: lessonData.featured,
        thumbnail: lessonData.thumbnail,
        instructor: lessonData.instructor,
        level: lessonData.level,
        Tags: lessonData.Tags,
        Owner: lessonData.Owner
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('lesson', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update lesson');
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
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('lesson', params);
      
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
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }
}

export default new LessonService();