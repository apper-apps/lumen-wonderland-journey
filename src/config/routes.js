import Home from '@/components/pages/Home';
import Lessons from '@/components/pages/Lessons';
import Progress from '@/components/pages/Progress';
import Coaching from '@/components/pages/Coaching';
import Profile from '@/components/pages/Profile';
import LessonDetail from '@/components/pages/LessonDetail';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  lessons: {
    id: 'lessons',
    label: 'Lessons',
    path: '/lessons',
    icon: 'BookOpen',
    component: Lessons
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  coaching: {
    id: 'coaching',
    label: 'Coaching',
    path: '/coaching',
    icon: 'MessageCircle',
    component: Coaching
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  },
  lessonDetail: {
    id: 'lessonDetail',
    label: 'Lesson Detail',
    path: '/lessons/:id',
    icon: 'Play',
    component: LessonDetail
  }
};

export const routeArray = Object.values(routes);
export default routes;