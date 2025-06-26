import coachingData from '../mockData/coaching.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CoachingService {
  constructor() {
    this.sessions = [...coachingData];
  }

  async getAll() {
    await delay(300);
    return [...this.sessions];
  }

  async getById(id) {
    await delay(200);
    const session = this.sessions.find(session => session.Id === parseInt(id, 10));
    if (!session) {
      throw new Error('Coaching session not found');
    }
    return { ...session };
  }

  async getByType(type) {
    await delay(250);
    return this.sessions
      .filter(session => session.type === type)
      .map(session => ({ ...session }));
  }

  async getUpcoming() {
    await delay(200);
    const now = new Date();
    return this.sessions
      .filter(session => new Date(session.schedule) > now)
      .sort((a, b) => new Date(a.schedule) - new Date(b.schedule))
      .map(session => ({ ...session }));
  }
}

export default new CoachingService();