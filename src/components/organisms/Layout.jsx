import { useState } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={title}
        />
        
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;