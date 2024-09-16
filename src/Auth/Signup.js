import React, { useState, useEffect } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../helpers/axios';
import LogoImage from "../assets/logo/Logo.png"
import Dialog from '../DialogBox/dialogbox';
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    contactNumber: '',
  });
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/signup', formData);
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowDialog(true);
        setFormData({
          firstName: '',
          secondName: '',
          email: '',
          password: '',
          contactNumber: '',
        });
        setTimeout(() => {
          setShowDialog(false);
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
    }
  };



  return (
    <div className="auth-container">
      <img src={LogoImage} alt='logo' style={{ width: "200px" }} />
      <h2 style={{ fontWeight: "600", marginBottom: "20px" }}>Sign Up</h2>
      <form className="section" onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required style={{ marginRight: "10px" }} className='form-control' />
            <input type="text" name="secondName" value={formData.secondName} onChange={handleChange} placeholder="Second Name" required className='form-control' />
          </div>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required style={{ marginBottom: "10px" }} className='form-control' />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={{ marginBottom: "10px" }} className='form-control' />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ marginBottom: "10px" }} className='form-control' />
          <div className="form-group button-style">
            <button type="submit">Sign Up</button>
          </div>
        </div>

      </form>
      <div className="form-group ">
        <p className="already-have-account fs-5">Already have an account?
          <Link to="/" className="btn btn-link ">Sign In</Link>
        </p>
      </div>
      <Dialog
        message={message}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
};
export default Signup;