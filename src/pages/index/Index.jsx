import React, { memo, useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../../components/dashboardHeader.jsx/DashboardHeader';
import DashboardSideBar from '../../components/dashboardSideBar/DashboardSideBar';
import { AuthContext } from '../../context2/AuthContext';
const Index = memo(() => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const toggleSidebar = () => {
    console.log("triggered")
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [isSidebarOpen]);

  return (
    <div className="container-fluid">
      <div className="dashboard-wrapper">
        <DashboardSideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`sidebar-overlay ${isSidebarOpen ? 'sidebar-overlay-active' : ''}`} onClick={toggleSidebar} />
        <div className="dashboard-right">
          <div className="dashboard-right-header">
            <DashboardHeader onToggleSidebar={toggleSidebar} currentUser={currentUser}  />
          </div>
          <div className="dashboard-right-main">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Index; 