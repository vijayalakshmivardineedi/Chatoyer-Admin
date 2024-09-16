import React, { useState, useEffect } from 'react';
import './Auth.css';
import { Api } from '../helpers/axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import LogoImage from "../assets/logo/Logo.png"
import Dialog from '../DialogBox/dialogbox';
const Signin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showDialog, setShowDialog] = useState(false);
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/signin', formData);
            setMessage(response.data.message);
            if (response.status === 201) {
                setMessage(response.data.message);
                setShowDialog(true);
                localStorage.setItem('AdminToken', response.data.token);
                localStorage.setItem('Admin', JSON.stringify(response.data.admin));
                setTimeout(() => {
                    setShowDialog(false);
                    navigate('/dashboard');
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
            <h2>Sign In </h2>
            <form className="section" onSubmit={handleSubmit}>
                <div className="signin-text" style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        style={{
                            padding: "10px",
                            width: "350px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                        required
                        className='form-control'
                    />
                </div>
                <div className="signin-text" style={{ marginBottom: "15px" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className='form-control'
                        style={{
                            padding: "10px",
                            width: "350px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                        required
                    />
                    <div className="form-group">
                        <Link to="/Forgotpassword" className="btn btn-link">Forgot Password ?</Link>
                    </div>
                </div>
                <div className="form-group button-style">
                    <button type="submit">Sign In</button>
                </div>
            </form>
            <div className="form-group">
                <Link to="/signup" className="btn btn-link">Create New Account</Link>
            </div>
            <Dialog
                message={message}
                showDialog={showDialog}
                onClose={() => setShowDialog(false)}
            />
        </div>
    );
};

export default Signin;