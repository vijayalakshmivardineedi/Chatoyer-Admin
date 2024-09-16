import React, { useState, useEffect } from 'react';
import axiosInstance, { ImagebaseURL } from '../helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Dialog from '../DialogBox/dialogbox';
import './EditCategories.css';
import { FaArrowLeft } from 'react-icons/fa';

const EditCategory = () => {
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    uploadImage: false,
    uploadVideo: false,
    image: null,
    video: null,
    categoryImage: null,
    newImage: null,
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axiosInstance.get(`/getCategoryById/${categoryId}`)
        const category = response.data.category;
        setFormData({
          name: category.name,
          uploadImage: !!category.categoryImage,
          uploadVideo: !!category.categoryVideo,
          image: null,
          video: null,
          categoryImage: category.categoryImage,
        });
      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
      newImage: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleVideoChange = (e) => {
    setFormData({
      ...formData,
      video: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('uploadImage', formData.uploadImage);
    formDataToSend.append('uploadVideo', formData.uploadVideo);
    formDataToSend.append('categoryImage', formData.categoryImage);

    if (formData.uploadImage && formData.image) {
      formDataToSend.append('image', formData.image);
    }

    if (formData.uploadVideo && formData.video) {
      formDataToSend.append('video', formData.video);
    }

    try {
      const response = await axiosInstance.put(`/editCategory/${categoryId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
          navigate('/getCategories');
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An error occurred while updating the category.';

      if (error.response) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      categoryImage: null,
    });
  };

  return (
    <div className="editcategory-container">
      <div className="editcategory-header">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
        className="editcategory-back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>
          <h1 className="editcategory-header-text">Categories</h1>
        </div>
      </div>
         <form className="editcategory-wrap" onSubmit={handleSubmit}>
          <div >
              <label htmlFor="name" className="editform-label">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="edittext-control"
              />
            </div>
            <div >
              {formData.categoryImage && (
                <div className="mb-3">
                  <label htmlFor="existingImage" className="editform-label">Existing Image:</label>
                  <img
                    src={`${ImagebaseURL}${formData.categoryImage}`}
                    alt={`${formData.name} Image`}
                    style={{ height: "250px", width: "500px", }}
                  />
                </div>
              )}
              {formData.newImage && (
                <div className="mb-3">
                  <label htmlFor="newImage" className="editform-label">New Image:</label>
                  <img
                    src={formData.newImage}
                    alt="New Image"
                    style={{ height: "250px", width: "500px" }}
                  />
                </div>
              )}
            </div>
            
            
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id="uploadImage"
                  name="uploadImage"
                  checked={formData.uploadImage}
                  onChange={handleCheckboxChange}
                  className="editform-check-input"
                />
                <label htmlFor="uploadImage" className="editform-check-label">Change Image</label>
              </div>
              {formData.categoryImage && (
                <div className="mb-3 form-check" style={{ marginLeft: "20px" }}>
                  <input
                    type="checkbox"
                    id="removeImage"
                    name="removeImage"
                    onChange={handleRemoveImage}
                    className="editform-check-input"
                  />
                  <label htmlFor="removeImage" className="editform-check-label">Remove Image</label>
                </div>
              )}
            </div>
            {formData.uploadImage && (
              <div className="mb-3">
                <label htmlFor="image" className="editform-label">New Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="edittext-control"
                />
              </div>
            )}
            <button className="editcategory-button">Update Category</button>
          </form>
          <Dialog
            message={message}
            showDialog={showDialog}
            onClose={() => setShowDialog(false)}
          />
        
    </div>
  );
};

export default EditCategory;
