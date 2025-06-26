import progressData from '../mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getUserProgress(userId) {
    await delay(300);
    return this.progress
      .filter(p => p.userId === userId.toString())
      .map(p => ({ ...p }));
  }

  async getLessonProgress(userId, lessonId) {
    await delay(200);
    const progress = this.progress.find(p => 
      p.userId === userId.toString() && p.lessonId === lessonId.toString()
    );
    return progress ? { ...progress } : null;
  }

  async updateProgress(userId, lessonId, progressData) {
    await delay(300);
    const progressIndex = this.progress.findIndex(p => 
      p.userId === userId.toString() && p.lessonId === lessonId.toString()
    );

    if (progressIndex === -1) {
      // Create new progress entry
      const newProgress = {
        Id: Math.max(...this.progress.map(p => p.Id), 0) + 1,
        userId: userId.toString(),
        lessonId: lessonId.toString(),
        completionPercentage: 0,
        lastAccessed: new Date().toISOString(),
        bookmarks: [],
        ...progressData
      };
      this.progress.push(newProgress);
      return { ...newProgress };
    } else {
      // Update existing progress
      this.progress[progressIndex] = {
        ...this.progress[progressIndex],
        ...progressData,
        lastAccessed: new Date().toISOString()
      };
      return { ...this.progress[progressIndex] };
    }
  }

  async addBookmark(userId, lessonId, timestamp) {
    await delay(200);
    const progressIndex = this.progress.findIndex(p => 
      p.userId === userId.toString() && p.lessonId === lessonId.toString()
    );

    if (progressIndex !== -1) {
      if (!this.progress[progressIndex].bookmarks.includes(timestamp)) {
        this.progress[progressIndex].bookmarks.push(timestamp);
      }
      return { ...this.progress[progressIndex] };
    }
    return null;
  }
}

export default new ProgressService();