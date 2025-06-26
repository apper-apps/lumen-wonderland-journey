import React from "react";
import Progress from "@/components/pages/Progress";
import LessonDetail from "@/components/pages/LessonDetail";
import Lessons from "@/components/pages/Lessons";
import Coaching from "@/components/pages/Coaching";
import Profile from "@/components/pages/Profile";
import Home from "@/components/pages/Home";
import GardenLabyrinth from "@/components/pages/GardenLabyrinth";

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
  },
  gardenLabyrinth: {
    id: 'gardenLabyrinth',
    label: 'Garden Labyrinth',
    path: '/garden-labyrinth',
    icon: 'Map',
    component: GardenLabyrinth
  }
};

export const routeArray = Object.values(routes);
export default routes;