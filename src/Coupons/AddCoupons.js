import React, { useState } from "react";
import axiosInstance from "../helpers/axios";
import { useNavigate } from "react-router-dom";
import "./AddCoupons.css";
import Dialog from '../DialogBox/dialogbox';
import { FaArrowLeft } from 'react-icons/fa';

const AddCoupon = () => {
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const [couponData, setCouponData] = useState({
    offerAmount: "",
    offerName: "",
    discountPercentage: "",
    description: "",
    startDate: "",
    expiryDate: "",
    applicableFor: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value,
    });
  };

  const convertToIndianFormat = (value) => {
    if (value === "") return value;

    const number = parseFloat(value);
    if (isNaN(number)) return value;

    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });

    return formatter.format(number).replace("₹", "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quantity = parseInt(couponData.quantity, 10);
    for (let i = 0; i < quantity; i++) {
      try {
        const formDataWithIndianFormat = {
          ...couponData,
          offerAmount: convertToIndianFormat(couponData.offerAmount),
        };

        const response = await axiosInstance.post("/addCoupon", formDataWithIndianFormat);

        if (response.status === 201) {
          setMessage(`Successfully created ${quantity} coupons`);
        }
      } catch (error) {
        setMessage(error.response.data.message || error.response.data.error);
        console.error('Error:', error);
        break;  // Stop creating coupons if an error occurs
      }
    }

    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
      navigate('/getCoupons');
    }, 1500);
  };

  return (
    <div className="Addcoupons-container">
      <div className="Addcoupons-header">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
        className="Addcoupons-back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>
          <h1 className="Addcoupons-header-text">Categories</h1>
        </div>
      </div>
      <form className="Addcard-wrapper" onSubmit={handleSubmit}>
        <div className="Addcard-container">
          <label className="Addcard-title" >Offer Name:</label>
          <input
            type="text"
            name="offerName"
            value={couponData.offerName}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div>
        <div className="Addcard-container">
          <label className="Addcard-title">Offer Amount:</label>
          <input
            type="text"
            name="offerAmount"
            value={couponData.offerAmount}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div >
        <div className="Addcard-container">
          <label className="Addcard-title">Discount Percentage:</label>
          <input
            type="text"
            name="discountPercentage"
            value={couponData.discountPercentage}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div >
        <div className="Addcard-container">
          <label className="Addcard-title">Description:</label>
          <input
            type="text"
            name="description"
            value={couponData.description}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div >
        <div className="Addcard-container">
          <label className="Addcard-title">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={couponData.startDate}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div >
        <div className="Addcard-container">
          <label className="Addcard-title">Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={couponData.expiryDate}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div >
        <div className="Addcard-container">
          <label className="Addcard-title">Applicable For:</label>
          <input
            type="text"
            name="applicableFor"
            value={couponData.applicableFor}
            onChange={handleChange}
            className="Addcard-text"
          />
        </div>
        <div className="Addcard-container">
          <label className="Addcard-title">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={couponData.quantity}
            onChange={handleChange}
            style={{maxWidth: '275px', fontSize: '15px', border: '1px solid gray'}}
            min="1"
          />
        </div>
        <button className="Addcoupons-button">Add Coupon</button>
      </form >

      <Dialog
        message={message}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div >
  );
};

export default AddCoupon;
