import lessonData from '../mockData/lessons.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LessonService {
  constructor() {
    this.lessons = [...lessonData];
  }

  async getAll() {
    await delay(400);
    return [...this.lessons];
  }

  async getById(id) {
    await delay(300);
    const lesson = this.lessons.find(lesson => lesson.Id === parseInt(id, 10));
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return { ...lesson };
  }

  async getByCategory(category) {
    await delay(350);
    return this.lessons.filter(lesson => lesson.category === category).map(lesson => ({ ...lesson }));
  }

  async getFeatured() {
    await delay(250);
    return this.lessons.filter(lesson => lesson.featured).map(lesson => ({ ...lesson }));
  }

  async searchLessons(query) {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return this.lessons
      .filter(lesson => 
        lesson.title.toLowerCase().includes(lowercaseQuery) ||
        lesson.description.toLowerCase().includes(lowercaseQuery) ||
        lesson.category.toLowerCase().includes(lowercaseQuery)
      )
      .map(lesson => ({ ...lesson }));
  }
}

export default new LessonService();