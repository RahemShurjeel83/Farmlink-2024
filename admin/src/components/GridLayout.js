import React from 'react'
import CSS from './GridLayout.module.css'
import SideBar from '../pages/DashBoard/SideBar/SideBar'

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  window.location.reload();
};

const GridLayout = (props) => {
  return (
    <div className={CSS['grid']}>
      <div className={CSS['dashboard-header']}>
        <h1 className={CSS['Dashboard-title']}>DashBoard</h1>
        <button className={CSS['logout-btn']} onClick={handleLogout}>Logout</button>
      </div>
      <div className={`${CSS['grid-container']} container-fluid`}>
        <div className={CSS['category-filter']}>
          <SideBar />
        </div>
        <div className={CSS['product']}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default GridLayout
