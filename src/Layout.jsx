import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/organisms/BottomNavigation';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location.pathname} />
    </div>
  );
};

export default Layout;