import React from "react";
import "./ConfirmationDialog.css";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog">
      <div className="confirmation-dialog-content">
        <div className="confirmation-dialog-text">
          <p>Are you sure?</p>
        </div>
        <div className="confirmation-dialog-buttons">
          <button className="confirmation-dialog-button" onClick={onConfirm}>Yes</button>
          <button className="confirmation-dialog-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
