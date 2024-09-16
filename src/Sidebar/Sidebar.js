import React, { useState, useEffect } from 'react';
import { FaUsers, FaSignOutAlt } from "react-icons/fa";
import axiosInstance from "../helpers/axios";
import { MdSpaceDashboard, MdCategory, MdDiscount, MdToday } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import LogoImage from "../assets/logo/Logo.png";
import { FaBasketShopping } from "react-icons/fa6";
import ConfirmationDialog from "../confirmation/Confirmation";
import Dialog from '../DialogBox/dialogbox';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [ConfirmSignout, setConfirmSignout] = useState(false);

  const menuItem = [
    { path: "/dashboard", name: "Dashboard", icon: <MdSpaceDashboard /> },
    { path: "/getCategories", name: "Categories", icon: <MdCategory /> },
    { path: "/getCoupons", name: "Coupons", icon: <MdDiscount /> },
    { path: "/orders", name: "Orders", icon: <FaBasketShopping /> },
    { path: "/customers", name: "Customers", icon: <FaUsers /> },
    { path: "/todayPrices", name: "Today", icon: <MdToday /> },
  ];

  const handleSignOutClick = async () => {
    try {
      const response = await axiosInstance.post(`/signout`);
      console.log('Sign-out response:', response);
      setMessage(response.data.message);
  
      if (response.status === 200) {
        console.log('Setting showDialog to true');
        setShowDialog(true);  
        console.log('showDialog after setting:', showDialog); 
        localStorage.clear();
        setTimeout(() => {
          setShowDialog(false);
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Sign-out error:', error);
  
      setMessage(
        error.response?.data.message ||
        error.response?.data.error ||
        'Sign-out failed'
      );
      setShowDialog(true);
  
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
    }
  };

  

  return (
    <div className='sidebar-main-component'>
      <div className="sidebar-container">
        <div className='sidebar'>
          <div className='sidebar-main'>
            <div className="top_section">
              <div className="logo-container">
                <img className="Logo" src={LogoImage} alt="logo" />
                <h1 className="logo-text">Chatoyer</h1>
              </div>
            </div>
            <div className="menu_items">
              {menuItem.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                >
                  <div className="icon">{item.icon}</div>
                  <div className="link_text">{item.name}</div>
                </NavLink>
              ))}
            </div>
            <div className="sidebar-footer">
              <div onClick={() => setConfirmSignout(true)} className="link">
                <div className="icon">
                  <FaSignOutAlt />
                </div>
                <div className="link_text">SignOut</div>
              </div>
            </div>
          </div>
        </div>
        <div className='main-container'>
          <main>{children}</main>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={ConfirmSignout}
        onClose={() => setConfirmSignout(false)}
        onConfirm={() => {
          handleSignOutClick();
          setConfirmSignout(false);
        }}
        message="Are you sure you want to sign out?"
      />
      <Dialog
        message={message}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
};

export default Sidebar;
