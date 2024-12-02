import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
      const [sidebarOpen, setSidebarOpen] = useState(true);
  
      const toggleSidebar = () => {
          setSidebarOpen(!sidebarOpen);
      };
  
      return (
          <div className="flex h-screen">
              <div className="fixed top-0 left-0 h-full z-50">
                  <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
              </div>
              <div
                  className={`flex-1 p-4 overflow-y-auto transition-all duration-300 ${
                      sidebarOpen ? "ml-60" : "ml-20"
                  }`}
              >
                  <Outlet />
              </div>
          </div>
      );
  }
  
