import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

const DefaultLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-2 w-full overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;
