import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...userData];
  }

  async getCurrentUser() {
    await delay(300);
    // Return the first user as the current user for demo
    return { ...this.users[0] };
  }

  async updateUser(id, userData) {
    await delay(300);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(id, 10));
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = { ...this.users[userIndex], ...userData, Id: this.users[userIndex].Id };
    return { ...this.users[userIndex] };
  }

  async purchaseLesson(userId, lessonId) {
    await delay(300);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(userId, 10));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (!this.users[userIndex].purchasedLessons.includes(lessonId)) {
      this.users[userIndex].purchasedLessons.push(lessonId);
    }
    
    return { ...this.users[userIndex] };
  }

  async addAchievement(userId, achievementId) {
    await delay(200);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(userId, 10));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (!this.users[userIndex].achievements.includes(achievementId)) {
      this.users[userIndex].achievements.push(achievementId);
    }
    
    return { ...this.users[userIndex] };
  }
}

export default new UserService();