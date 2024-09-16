import React, { useState, useEffect } from "react";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import "./Getproduct.css";
import ConfirmationDialog from "../confirmation/Confirmation";
import Dialog from "../DialogBox/dialogbox";
import { FaArrowLeft } from 'react-icons/fa';

const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);


  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/getProductByCategory/${category}`); // Fetch products by category
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/deleteProduct/${productToDelete}`);
      setProducts(products.filter(product => product._id !== productToDelete));
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

  const handleEdit = (productId) => {
    navigate(`/editProduct/${productId}`);
  };
  return (
    <div className="products-container">
      <div className="products-header">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            className="getproduct-back-button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>
          <h1 className="products-header-text">Products</h1>
        </div>
        <button className="products-header-button" onClick={() => navigate("/addProduct")}> Add Product</button>
      </div>
      <ul className="products-list">
        {products.map((product) => (
          <li key={product._id} className="product-item">
            <div className="card">
              <div className="card-body p-2" >
                <div className="product-images" onClick={() => navigate(`/detailedProduct/${product._id}`)} style={{ cursor: "pointer" }}>
                  {product.productPictures.length > 0 && (
                    <img
                      key={product.productPictures[0]._id}
                      className="card-img-top"
                      src={`${ImagebaseURL}${product.productPictures[0].img}`}
                      alt="Product"
                    />
                  )}
                </div>
                <h2 className="card-title">{product.name}</h2>
                <p className="card-text"><strong>Quantity:</strong> {product.quantity}</p>
                <div className="product-icons-container">
                  <button className="icon-button" onClick={() => handleEdit(product._id)} ><MdEdit /></button>
                  <button className="icon-button" onClick={() => handleDeleteClick(product._id)} ><MdDelete /></button>
                </div>
              </div>
            </div>
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
};

export default GetProducts;
