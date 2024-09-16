import React, { useState, useEffect } from "react";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import "./GetCategories.css";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import ConfirmationDialog from "../confirmation/Confirmation";
import Dialog from "../DialogBox/dialogbox";

const GetCategories = () => {
  const [data, setData] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
    fetchCount();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getCategory");
      setData(response.data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCount = async () => {
    try {
      const response = await axiosInstance.get("/countOfProducts");
      setCategoryCounts(response.data.categoryCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClick = (categoryId) => {
    navigate(`/editCategory/${categoryId}`);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/deleteCategory/${categoryToDelete}`);
      setData(data.filter((category) => category._id !== categoryToDelete));
      setMessage(response.data.message);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
      console.error('Error deleting category:', error);
    } finally {
      setConfirmDelete(false);
    }
  };

  const findCategoryCount = (categoryName) => {
    const categoryCount = categoryCounts.find(category => category.category === categoryName);
    return categoryCount ? categoryCount.count : 0;
  };


  return (
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-header-text">Categories</h1>
        <button className="category-header-button" onClick={() => navigate("/addCategory")}> Add Category</button>
      </div>
      <ul className="category-list">
        {data.map((category) => (

          <li key={category._id} className="category-item">
            {category.categoryImage && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="image-container">
                  <img
                    src={`${ImagebaseURL}${category.categoryImage}`}
                    alt={`${category.name} Image`}
                    onClick={() => navigate(`/getProducts/${category.name}`)}
                  />
                </div>

                <div className="category-item-details">
                  <h2>{category.name}</h2>
                  <p style={{ marginTop: "10px" }}>Number of Products: {findCategoryCount(category.name)}</p>
                  <div className="category-icons-container">
                    <button className="category-icon-button" onClick={() => handleEditClick(category._id)}> <MdEdit /></button>
                    <button className="category-icon-button" onClick={() => handleDeleteClick(category._id)}> <MdDelete /></button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
      />
      <Dialog
        message={message}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
}
export default GetCategories;