import React, { useState } from 'react';
import axiosInstance from '../helpers/axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '../DialogBox/dialogbox';
import "./AddCategories.css";
import { FaArrowLeft } from 'react-icons/fa';

const AddCategory = () => {
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await axiosInstance.post('/addCategory', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setMessage('Category successfully created');
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
          navigate('/getCategories');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 2000);
      console.error('Error:', error);
    }
  };

  return (
    <div className="addcategory-container">
      <div className="addcategory-header">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
        className="addcategory-back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>
          <h1 className="addcategory-header-text">Categories</h1>
        </div>
        </div>
      <div className='addcategory-wrap'>
        <form className="addcategory-card" onSubmit={handleSubmit}>
          <div style={{marginBottom: '10px'}}>
            <label className='addcategory-title'>Name:</label>
            <input
              type="text"
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="addform-control fs-4"
            />
          </div>
          <div>
            <label className='addcategory-title'>Image:</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              onChange={handleImageChange}
              required
            />
            <br />
            {formData.image && (
              <img src={URL.createObjectURL(formData.image)} alt="Uploaded Image" style={{ marginTop: '30px', maxWidth: '100%', maxHeight: '250px' }} />
            )}
          </div>        
        </form>
        <button className="addcategory-button" onClick={handleSubmit}>Create Category</button>
        </div>
        <Dialog
          message={message}
          showDialog={showDialog}
          onClose={() => setShowDialog(false)}
        />
    </div>
  );
};

export default AddCategory;
