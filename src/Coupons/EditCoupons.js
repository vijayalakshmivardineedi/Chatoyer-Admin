import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditCoupons.css";
import Dialog from "../DialogBox/dialogbox";
import { FaArrowLeft } from 'react-icons/fa';

const EditCoupon = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const [couponData, setCouponData] = useState({
    offerName: "",
    offerAmount: "",
    discountPercentage: "",
    description: "",
    startDate: "",
    expiryDate: "",
    applicableFor: "",
  });

  useEffect(() => {
    const fetchCouponDetails = async () => {
        try {
          const response = await axiosInstance.get(`/getCouponsById/${couponId}`);
          const coupon = response.data.coupons;
          const startDate = new Date(coupon.startDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          const expiryDate = new Date(coupon.expiryDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          setCouponData({
            offerName: coupon.offerName,
            offerAmount: coupon.offerAmount,
            discountPercentage: coupon.discountPercentage,
            description: coupon.description,
            startDate: startDate,
            expiryDate: expiryDate,
            applicableFor: coupon.applicableFor,
          });
        } catch (error) {
          console.error("Error fetching coupon details:", error);
          // Handle error
        }
      };
      
  
    fetchCouponDetails();
  }, [couponId]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/editCoupons/${couponId}`, couponData);
      console.log(response.data.message)
      if (response.status === 201) {
        setMessage(response.data.message); // Access message from response.data
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
          navigate('/getCoupons');
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
      console.error('Error:', error);
    }
  };

  return (
    <div className="Editcoupons-container">
    <div className="Editcoupons-header">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
        className="Editcoupons-back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>
          <h1 className="Editcoupons-header-text">Categories</h1>
        </div>
      </div >
      <form onSubmit={handleSubmit} className="Editcard-wrapper">
        <div className="Editcard-container">
          <label className="Editcard-title">Offer Name</label>
          <input
            type="text"
            name="offerName"
            value={couponData.offerName}
            onChange={handleChange}
            className="Editcard-text"
          />
        </div>
        <div className="Editcard-container">
          <label className="Editcard-title">Offer Amount</label>
          <input
            type="text"
            name="offerAmount"
            value={couponData.offerAmount}
            onChange={handleChange}
            className="Editcard-text"
          />
        </div>

        <div className="Editcard-container">
          <label className="Editcard-title">Discount Percentage</label>
          <input
            type="text"
            name="discountPercentage"
            value={couponData.discountPercentage}
            onChange={handleChange}
            className="Editcard-text"
          />
        </div>
        <div className="Editcard-container">
          <label className="Editcard-title">Description</label>
          <input
            type="text"
            name="description"
            value={couponData.description}
            onChange={handleChange}
           className="Editcard-text"
          />
        </div>
    

        <div className="Editcard-container">
          <label className="Editcard-title">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={couponData.startDate}
            onChange={handleChange}
            className="Editcard-text"
          />
        </div>
        <div className="Editcard-container">
          <label className="Editcard-title">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={couponData.expiryDate}
            onChange={handleChange}
            className="Editcard-text"
          />
        </div>
        <div className="Editcard-container">
        <label className="Editcard-title">Applicable For</label>
          <input
            type="text"
            name="applicableFor"
            value={couponData.applicableFor}
            onChange={handleChange}
            className="Editcard-text"
          />
        </div>
        <button className="Editcoupons-button">Edit Coupon</button>
      </form>
      <Dialog
          message={message}
          showDialog={showDialog}
          onClose={() => setShowDialog(false)}
        />
    </div>
  );
};

export default EditCoupon;