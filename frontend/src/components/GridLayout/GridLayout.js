import React from 'react'
import CSS from './GridLayout.module.css'
import SideBar from '../../pages/Vendor/DashBoard/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';

const GridLayout = (props) => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className={CSS['grid']}>
      <div  className={CSS['logout-container']}>
        <p style={{ color: 'var(--text-color)', fontWeight: 500, float: 'right' }} onClick={handleLogout}>Logout</p>
      </div>
      <h1 className={CSS['Dashboard-title']}>Dashboard</h1>
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