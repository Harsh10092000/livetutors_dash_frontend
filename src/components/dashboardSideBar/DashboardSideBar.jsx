import React, { useState } from "react";
import "./DashboardSideBar.css";
import { Link } from "react-router-dom";
import { AddPropertyIcon, AllProperties, MyProperties, ShortlistedIcon, SubscriptionIcon, UserIcon, LogoutIcon, MyJobsIcon, PostJobsIcon } from "../SvgIcons";
//import { IconDashboard } from "@tabler/icons-react";

const DashboardSideBar = ({ isSidebarOpen, toggleSidebar }) => {
  const is_tutor = false;
  const DashboardIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-dashboard"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M13.45 11.55l2.05 -2.05" />
      <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
    </svg>
  );


  const [selectedItem, setSelectedItem] = useState("My Properties");
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const menuItems = [
    // {
    //   name: "My Profile",
    //   url: "/dashboard",
    //   icon: <UserIcon />,
    // },
    // {
    //   name: "Become a Tutor",
    //   url: "/become-a-tutor",
    //   icon: <UserIcon />,
    //   sx: {
    //     color: "#000",
    //     backgroundColor: "blue",
    //   }
    // },
    {
      name: "My Jobs",
      url: "/my-jobs",
      icon: <MyJobsIcon />,
    },
    

    {
      name: "Post Jobs",
      url: "/request-tutor",
      icon: <PostJobsIcon />,
    },
    {
      name: "Logout",
      url: "/dashboard",
      icon: <LogoutIcon />,
    },
  
  ];
  console.log("sidebarCollapse : " , sidebarCollapse);
  return (
    <div className={`dashboard-sideBar-wrapper ${sidebarCollapse ? "sidebar-close" : "sidebar-open"} ${isSidebarOpen ? "open-mobile-sidebar" : ""}  `}>
        <div className="sidebar-logo">
          <img src="/favicon.png" />
          <div className='sidebar-toggle-icon px-3' onClick={toggleSidebar}>
     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--custom minimal__iconify__root css-18oi841" id="«rl»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" opacity="0.4" d="M15.7798 4.5H5.2202C4.27169 4.5 3.5 5.06057 3.5 5.75042C3.5 6.43943 4.27169 7 5.2202 7H15.7798C16.7283 7 17.5 6.43943 17.5 5.75042C17.5 5.06054 16.7283 4.5 15.7798 4.5Z"></path> <path fill="currentColor" d="M18.7798 10.75H8.2202C7.27169 10.75 6.5 11.3106 6.5 12.0004C6.5 12.6894 7.27169 13.25 8.2202 13.25H18.7798C19.7283 13.25 20.5 12.6894 20.5 12.0004C20.5 11.3105 19.7283 10.75 18.7798 10.75Z"></path> <path fill="currentColor" d="M15.7798 17H5.2202C4.27169 17 3.5 17.5606 3.5 18.2504C3.5 18.9394 4.27169 19.5 5.2202 19.5H15.7798C16.7283 19.5 17.5 18.9394 17.5 18.2504C17.5 17.5606 16.7283 17 15.7798 17Z"></path></svg>
    </div>
        </div>
    <div className="dashboardSideBar">
      <div className="dashboardSidebar-inside">
     
         
        <div className="sidebar-icon mobile-hidden" onClick={() => setSidebarCollapse(!sidebarCollapse)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--eva minimal__iconify__root css-mihbd4"
            id="«r2»"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"
            ></path>
          </svg>
        </div>
        <Link
          className={`menu-link menu-link-selected`}
          to="/become-a-tutor"
          onClick={() => setSelectedItem("Become a Tutor")}
          style={{
            backgroundColor: selectedItem == "Become a Tutor" ? "blue" : "rgb(0 167 111 / 8%);",
            color: selectedItem == "Become a Tutor" ? "white" : "#00a76f;",
          }}
        >
    
          <div className="dashboardSidebar-menu-inside">
            <span className="menu-icon"><UserIcon /></span>
            Become a Tutor
          </div>
        </Link>
        {menuItems.map((item, index) => (
          <Link
            onClick={() => setSelectedItem(item.name)}
            className={
              selectedItem == item.name
                ? `menu-link menu-link-selected`
                : `menu-link`
            }
            to={item.url}
          >
            <div className="dashboardSidebar-menu-inside">
              <span className="menu-icon">{item.icon}</span>
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default DashboardSideBar;
