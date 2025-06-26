import wisdomData from '@/services/mockData/wisdom.json';

const wisdomService = {
  // Get all wisdom quotes
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...wisdomData]);
      }, 300);
    });
  },

  // Get daily wisdom quote based on current date
  getDailyQuote: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const today = new Date();
          const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
          const quoteIndex = dayOfYear % wisdomData.length;
          const dailyQuote = wisdomData[quoteIndex];
          
          if (dailyQuote) {
            resolve({ ...dailyQuote });
          } else {
            resolve({ ...wisdomData[0] }); // Fallback to first quote
          }
        } catch (error) {
          reject(new Error('Failed to get daily wisdom quote'));
        }
      }, 300);
    });
  },

  // Get wisdom quote by ID
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const quoteId = parseInt(id);
        if (isNaN(quoteId)) {
          reject(new Error('Invalid quote ID'));
          return;
        }

        const quote = wisdomData.find(q => q.Id === quoteId);
        if (quote) {
          resolve({ ...quote });
        } else {
          reject(new Error('Wisdom quote not found'));
        }
      }, 300);
    });
  }
};

export default wisdomService;