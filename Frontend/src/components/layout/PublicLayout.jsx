import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import ChatWidget from '../ui/ChatWidget';

export default function PublicLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[65px]">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
