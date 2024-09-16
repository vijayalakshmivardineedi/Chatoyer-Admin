import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import ConfirmationDialog from "../confirmation/Confirmation";
import "./GetCoupons.css";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import Dialog from "../DialogBox/dialogbox";

const Getcoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [couponIdToDelete, setCouponIdToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosInstance.get("/getCoupons");
        setCoupons(response.data.coupons);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async () => {
    try {
      const response = await axiosInstance.delete(`/deleteCoupons/${couponIdToDelete}`);
      setCoupons(coupons.filter((coupon) => coupon._id !== couponIdToDelete));
      setConfirmDelete(false);
      setMessage(response.data.message);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
        navigate('/getCoupons');
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 2000);
      console.error('Error:', error);
    }
  };


  const handleEditCoupon = (couponId) => {
    navigate(`/editCoupon/${couponId}`);
  };

  return (
    <div className="Coupons-container">
      <div className="Coupons-header">
        <h1 className="Coupons-header-text">Coupons</h1>
        <button
          className="Coupons-header-button"
          onClick={() => navigate("/addCoupon")}
        >
          Add Coupons
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="Coupons-list">
          <div className="card-wrapper">
            {coupons.map((coupon) => (
              <div className="card" key={coupon._id}>
                <div className="card-title">
                  <h1>{coupon.offerName}</h1>
                </div>
                <div className="card-body">
                  <div className="Coupons-container">
                    <label className="card-text">ID:</label>
                    <text className="card-subtitle">{coupon._id}</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Coupon Code:</label>
                    <text className="card-subtitle">{coupon.couponCode}</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Offer Amount:</label>
                    <text className="card-subtitle">{coupon.offerAmount || '-'}</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Discount Percentage:</label>
                    <text className="card-subtitle">{coupon.discountPercentage || '-' }</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Description:</label>
                    <text className="card-subtitle">{coupon.description}</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Offer Available From:</label>
                    <text className="card-subtitle">{new Date(coupon.startDate).toLocaleDateString()}</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Expiry Date:</label>
                    <text className="card-subtitle">{new Date(coupon.expiryDate).toLocaleDateString()}</text>
                  </div>
                  <div className="Coupons-container">
                    <label className="card-text">Available:</label>
                    <text className="card-subtitle">{coupon.applicableFor}</text>
                  </div>
                </div>
                <div className="Coupons-icons-container">
                  <button
                    className="Coupons-list-button "
                    onClick={() => handleEditCoupon(coupon._id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="Coupons-list-button "
                    onClick={() => {
                      setConfirmDelete(true);
                      setCouponIdToDelete(coupon._id);
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>

              </div>))}
          </div>
        </div>
      )}
      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteCoupon}
      />
      <Dialog
        message={message}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
};

export default Getcoupons;