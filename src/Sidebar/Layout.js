import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='layout'>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className='content'>
        {children}
      </div>
    </div>
  );
};

export default Layout;
