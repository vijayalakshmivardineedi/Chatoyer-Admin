import React, { useState, useEffect } from "react";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./DetailedProduct.css";
import { FaArrowLeft } from 'react-icons/fa';

const DetailedProduct = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/getDetailsByProductId/${productId}`
      );
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const convertToIndianFormat = (value) => {
    if (value === "") return value;
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });

    return formatter.format(number).replace("₹", "₹ ");
  };

  return (
    <div className="container-fluid">
      <div className="detail-header">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            className="detailsproduct-back-button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>
          <h1 className="detail-header-text">Product Details</h1>
        </div>
      </div>
      {product && (
        <div className="detail-item-details row" >
          <div className="col-md-4">
            <div className="detail-images" >
              {product.productPictures &&
                product.productPictures.map((picture) => (
                  <img
                    key={picture._id}
                    src={`${ImagebaseURL}${picture.img}`}
                    alt="Product"
                    className="img-fluid mb-3"
                  />
                ))}
            </div>
            <div className="detail-video" >
              {product.productVideo && (
                <video
                  controls
                  className="img-fluid mb-3"
                >
                  <source
                    src={`${ImagebaseURL}${product.productVideo}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
          <div
            className="detail-info"
          >
            <div className="row " style={{ marginTop: "-6px" }}>
              <div className="col">
                <h2 style={{display:'flex', justifyContent: 'center', color: '#4f3267'}}>
                  <b>{product.name}</b>
                </h2>
              </div>
              </div>
           
            <h4>
              {" "}
              <b>Product Details</b>
            </h4>
            <div className="row ">
              <div className="col">
                <p>
                  <b>Id:</b> <span className="light">{product._id}</span>
                </p>
                <p>
                  <b>Category:</b> <span className="light">{product.category}</span>
                </p>
                <p>
                  <b>Product Code:</b> <span className="light">{product.productCode}</span>
                </p>
                <p>
                  <b>Height:</b> <span className="light">{product.height}</span>
                </p>
                <p>
                  <b>Width:</b> <span className="light">{product.width}</span>
                </p>
                <p>
                  <b>Quantity:</b> <span className="light">{product.quantity}</span>
                </p>
              </div>
              <div className="col">
                <p>
                  <b>Sizes:</b>
                </p>
                <ul
                  style={{ height: "200px", width: "300px", overflow: "auto" }}
                >
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size, index) => (
                      <li key={index}>
                        <p>- Size: {size.size}</p>
                        <p>Price: {size.price}</p>
                        <p>Quantity: {size.quantity}</p>
                      </li>
                    ))
                  ) : (
                    <p>No Sizes</p>
                  )}

                </ul>
              </div>
            </div>
            <h4>
              <b>Gold</b>
            </h4>
            <div className="row ">
              <div className="col">
                <p>
                  <b>Gold Weight:</b> <span className="light">{product.goldWeight}</span>
                </p>
              </div>
              <div className="col">
                <p>
                  <b>Gold Kt:</b> <span className="light">
                    {product.goldKt &&
                      product.goldKt.map((item) => item.goldKt).join(", ")}
                  </span>
                </p>
              </div>
              <div className="col">
                <p>
                  <b>Gold Type:</b>{" "}
                  <span className="light">
                    {product.goldType &&
                      product.goldType.map((item) => item.goldtype).join(", ")}
                  </span>
                </p>
              </div>
            </div>
            <h4>
              <b>Diamond</b>
            </h4>
            <div className="row">
              <div className="col">
                <p>
                  <b>Diamond Type:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond.type)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
                <p>
                  <b>Diamond Shape:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond.diamondShape)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
              </div>
              <div className="col">
                <p>
                  <b>Price:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond.price)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
                <p>
                  <b>ID:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond._id)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
              </div>
              <div className="col">
                <p>
                  <b>Diamond Count:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond.diamondCount)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
                <p>
                  <b>Diamond Clarity:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond.diamondClarity)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
                <p>
                  <b>Diamond Setting Type:</b>{" "}
                  <span className="light">
                    {product.diamondType && product.diamondType.length > 0
                      ? product.diamondType
                        .map((diamond) => diamond.diamondSettingType)
                        .join(", ")
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {product.stoneType && product.stoneType.length > 0 && (
              <div className="row">
                <h4>
                  <b>Stone</b>
                </h4>
                {product.stoneType.map((stone, index) => (
                  <React.Fragment key={index}>
                    <div className="col">
                      {stone.stone && (
                        <p>
                          <b>Stone:</b>{" "}
                          <span className="light">{stone.stone}</span>
                        </p>
                      )}
                      {stone.stonesCount && (
                        <p>
                          <b>Stones Count:</b>{" "}
                          <span className="light">{stone.stonesCount}</span>
                        </p>
                      )}
                      {stone.stoneSettingType && (
                        <p>
                          <b>stoneSettingType:</b>{" "}
                          <span className="light">
                            {stone.stoneSettingType}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="col">
                      {stone.stoneColour && (
                        <p>
                          <b>Stones Colour:</b>{" "}
                          <span className="light">{stone.stoneColour}</span>
                        </p>
                      )}
                      {stone.stoneWeight && (
                        <p>
                          <b>Stones Weight:</b>{" "}
                          <span className="light">{stone.stoneWeight}</span>
                        </p>
                      )}
                    </div>
                    <div className="col">
                      {stone.stoneSize && (
                        <p>
                          <b>Stone Size:</b>{" "}
                          <span className="light">{stone.stoneSize}</span>
                        </p>
                      )}
                      {stone.stoneShape && (
                        <p>
                          <b>Stone Shape:</b>{" "}
                          <span className="light">{stone.stoneShape}</span>
                        </p>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
            <h4>
              <b>Price</b>
            </h4>
              <div className="row">
                <div>
                  {product.makingCharges && product.gst && (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        marginRight: "50%",
                      }}
                    >
                      <p
                        style={{
                          marginRight: "50%",
                        }}
                      >
                        <b>Making Charges:</b>{" "}
                        <span className="light">{convertToIndianFormat(product.makingCharges)} /-</span>
                      </p>
                      <p>
                        <b>GST:</b> <span className="light">{convertToIndianFormat(product.gst)} /-</span>
                      </p>
                    </div>
                  )}
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedProduct;