import React, { useState, useEffect } from 'react';
import './Auth.css';
import { Api } from '../helpers/axios';
import { useNavigate, Link } from 'react-router-dom';

import LogoImage from "../assets/logo/Logo.png"
import Dialog from '../DialogBox/dialogbox';
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [showDialog, setShowDialog] = useState(false);


    useEffect(() => {
        if (showDialog) {
            const timer = setTimeout(() => {
                setShowDialog(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [showDialog]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        else if (name === 'code') setCode(value);
        else if (name === 'password') setPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/forgotPassword', { email });
            if (response.status === 200) {
                setStep(2);
                setShowDialog(true);
                setMessage('Verification code sent to your email');
            }
        } catch (error) {
            setMessage('Error: Unable to send verification code');
            setShowDialog(true);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setShowDialog(true);
            return;
        }
        try {
            const response = await Api.post('/verifyCodeAndResetPassword', { email, code, newPassword: password });
            if (response.status === 200) {
                setMessage('Password reset successfully');
                setShowDialog(true);
                setTimeout(() => {
                    setShowDialog(false);
                    navigate('/');
                }, 1500);
            }
        } catch (error) {
            setMessage('Error: Unable to reset password');
            setShowDialog(true);
        }
    };

    return (
        <div className="auth-container">
            <img src={LogoImage} alt='logo' style={{ width: "200px" }} />
            {step === 1 ? (
                <>
                    <h2>Forgot Password</h2>
                    <div className='section-2'>
                        <form onSubmit={handleSendVerificationCode}>
                            <div>
                                <input className="form-control box-1" type="email" name="email" value={email} onChange={handleChange} placeholder="Enter your email" required />
                            </div>
                            <div className='send-button'>
                                <button type="submit">Send</button>

                            </div>
                            
                        </form>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Link to="/" className="btn btn-link">Back to Sign In</Link>
                            </div>
                    </div>
                </>
            ) : (
                <>
                    <h3>Enter Verification Code and Reset Password</h3>
                    <form onSubmit={handleResetPassword}>
                        <div className="input-row">
                            <input type="text" name="code" value={code} onChange={handleChange} className=" form-control input-field" placeholder="Enter verification code" required />
                        </div>
                        <div className="input-row">
                            <input type="password" name="password" value={password} onChange={handleChange} className="form-control input-field" placeholder="Enter new password" required />
                        </div>
                        <div className="input-row">
                            <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} className=" form-control input-field" placeholder="Re-enter new password" required />
                        </div>
                        <div className="button-row">
                            <button type="submit" className="reset-button">Reset Password</button>
                        </div>
                    </form>

                </>
            )}
            <Dialog
                message={message}
                showDialog={showDialog}
                onClose={() => setShowDialog(false)}
            />
        </div>
    );
};

export default ForgotPassword;
