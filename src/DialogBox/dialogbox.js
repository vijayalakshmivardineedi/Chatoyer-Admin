import React from 'react';
import './dialogbox.css'; 

const Dialog = ({ message, showDialog, onClose }) => {
    if (!showDialog) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <p className="dialog-message">{message}</p>
                <button className="dialog-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Dialog;
