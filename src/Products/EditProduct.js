import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { sizes, types, goldtype, goldKt, diamondType } from './Details';
import Dialog from "../DialogBox/dialogbox";
import { FaArrowLeft } from 'react-icons/fa';

const EditProduct = () => {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const { productId } = useParams();

    const [formData, setFormData] = useState({
        category: '',
        name: '',
        type: '',
        productBy: '',
        quantity: 1,
        height: '',
        width: '',
        length: '',
        sizes: [{ size: '', price: '', quantity: '' }],
        goldType: [{ goldtype: '', price: '' }],
        goldKt: [{ goldKt: '', price: '', goldWeight: '' }],
        diamondType: [{
            type: '', price: '', diamondShape: '', diamondColour: '',
            diamondCount: '',
            diamondWeight: '',
            diamondClarity: '',
            diamondSettingType: ''
        }],
        stoneType: [{
            stone: '', price: '', stoneSize: '', stoneShape: '',
            stonesCount: '', stoneColour: '', stoneWeight: '', stoneSettingtype: ''
        }],
        makingCharges: '',
        gst: '',
        offer: '',
        total: '',
        productPictures: [],
        productVideo: null,
        reviews: [],
    });

    useEffect(() => {
        fetchData();
        fetchProduct();
        console.log(types);
        console.log(sizes);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/getCategory");
            setCategories(response.data.categories);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axiosInstance.get(`/getDetailsByProductId/${productId}`);
            setFormData(response.data.product);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const calculateTotalQuantity = () => {
        return formData.sizes.reduce((acc, curr) => {
            return acc + parseInt(curr.quantity || 0);
        }, 0);
    };

    const handleChange = (e, field, index) => {
        const { name, value } = e.target;
        const newValues = [...formData[field]];
        if (name === 'quantity') {
            newValues[index][name] = parseInt(value);
        } else {
            newValues[index][name] = value;
        }
        setFormData({ ...formData, [field]: newValues });
    };

    const handleAddItem = (field) => {
        let newItem;
        if (field === 'goldType') {
            newItem = { goldtype: '', price: '' };
        } else if (field === 'goldKt') {
            newItem = { goldKt: '', price: '', goldWeight: '' };
        } else if (field === 'diamondType') {
            newItem = {
                type: '', price: '', diamondShape: '', diamondColour: '',
                diamondCount: '',
                diamondWeight: '',
                diamondClarity: '',
                diamondSettingType: ''
            };
        } else if (field === 'stoneType') {
            newItem = {
                stone: '', price: '', stoneSize: '', stoneShape: '',
                stonesCount: '', stoneColour: '', stoneWeight: '', stoneSettingtype: ''
            };
        } else if (field === 'sizes') {

            if (formData.category) {
                const newSize = { size: sizes[formData.category][0], price: '', quantity: '' };
                newItem = newSize;
            } else {
                newItem = null;
            }
        }
        if (newItem !== null) {
            setFormData(prevState => ({ ...prevState, [field]: [...prevState[field], newItem] }));
        }
    };

    const handleRemoveItem = (field, index) => {
        const newValues = [...formData[field]];
        newValues.splice(index, 1);
        setFormData({ ...formData, [field]: newValues });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();


        let filteredSizes = [];
        if (formData.category) {
            filteredSizes = formData.sizes.filter(size => size.size !== '' && size.price !== '' && size.quantity !== '');
        }


        const updatedFormData = {
            ...formData,
            sizes: formData.category ? filteredSizes : [],
        };

        try {
            const response = await axiosInstance.put(`/editProduct/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                setMessage(response.data.message);
                setShowDialog(true);
                setTimeout(() => {
                    setShowDialog(false);
                    navigate("/getCategories");
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


    const handleProductPicturesChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, productPictures: files });
    };

    const handleproductVideoChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, productVideo: file });
    };



    return (
        <div className="Editproducts-container">
            <div className='Editproducts-header'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        className="Editproduct-back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className='Editproducts-header-text'>Edit Product</h2>
                </div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Category</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.category}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Category</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.category}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Name</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    {formData.category && types[formData.category] && types[formData.category].length > 0 && (
                        <div className="Editproducts-container">
                            <label className="Editproducts-title">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                {types[formData.category].map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Product By</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="productBy"
                            value={formData.productBy}
                            onChange={(e) => setFormData({ ...formData, productBy: e.target.value })}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Quantity</label>
                        <input
                            className="Editproducts-text"
                            type="number"
                            name="quantity"
                            value={calculateTotalQuantity() || formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Height</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="height"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Width</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="width"
                            value={formData.width}
                            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Length</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="length"
                            value={formData.length}
                            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        />
                    </div>
                    {formData.category && sizes[formData.category] && sizes[formData.category].length > 0 && (
                        <div className="Editproducts-container">
                            <label className="Editproducts-title">Sizes</label>
                            {formData.sizes.map((size, index) => (
                                <div key={index}>
                                    <select
                                        name="size"
                                        value={size.size}
                                        onChange={(e) => handleChange(e, 'sizes', index)}
                                    >
                                        <option value="">Select Size</option>
                                        {sizes[formData.category].map((sizeOption, sizeIndex) => (
                                            <option key={sizeIndex} value={sizeOption}>
                                                {sizeOption}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        className="Editproducts-text"
                                        type="number"
                                        name="price"
                                        value={size.price}
                                        onChange={(e) => handleChange(e, 'sizes', index)}
                                        placeholder="Price"
                                    />
                                    <input
                                        className="Editproducts-text"
                                        type="number"
                                        name="quantity"
                                        value={size.quantity}
                                        onChange={(e) => handleChange(e, 'sizes', index)}
                                        placeholder="Quantity"
                                    />
                                    <br />
                                    <button type="button" className="Editproducts-button2" onClick={() => handleRemoveItem('sizes', index)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="Editproducts-button1" onClick={() => handleAddItem('sizes')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, marginRight: '50px' }}>
                    <div style={{ flex: 1 }}>
                        <div className="Editproducts-container">
                            <label className="Editproducts-title">Gold Types</label>
                            {formData.goldType.map((type, index) => (
                                <div key={index}>
                                    <select
                                        name="goldtype"
                                        value={type.goldtype}
                                        onChange={(e) => handleChange(e, 'goldType', index)}
                                    >
                                        <option value="">Select</option>
                                        {Object.keys(goldtype).map((key) => (
                                            <option key={key} value={goldtype[key]}>
                                                {goldtype[key]}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        className="Editproducts-text"
                                        type="number"
                                        name="price"
                                        value={type.price}
                                        onChange={(e) => handleChange(e, 'goldType', index)}
                                        placeholder="Price"
                                    />
                                    <br />
                                    <button type="button" className="Editproducts-button2" onClick={() => handleRemoveItem('goldType', index)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="Editproducts-button1" onClick={() => handleAddItem('goldType')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Gold Karats</label>
                        {formData.goldKt.map((kt, index) => (
                            <div key={index}>
                                <select
                                    name="goldKt"
                                    value={kt.goldKt}
                                    onChange={(e) => handleChange(e, 'goldKt', index)}
                                >
                                    <option value="">Select</option>
                                    {Object.keys(goldKt).map((key) => (
                                        <option key={key} value={goldKt[key]}>
                                            {goldKt[key]}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    className="Editproducts-text"
                                    type="number"
                                    name="price"
                                    value={kt.price}
                                    onChange={(e) => handleChange(e, 'goldKt', index)}
                                    placeholder="Price"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="goldWeight"
                                    value={kt.goldWeight}
                                    onChange={(e) => handleChange(e, 'goldKt', index)}
                                    placeholder="Gold Weight"
                                />
                                <br />
                                <button type="button" className="Editproducts-button2" onClick={() => handleRemoveItem('goldKt', index)}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="Editproducts-button1" onClick={() => handleAddItem('goldKt')}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Diamond Types</label>
                        {formData.diamondType.map((type, index) => (
                            <div key={index}>
                                <select
                                    name="type"
                                    value={type.type}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                >
                                    <option value="">Select</option>
                                    {Object.keys(diamondType).map((key) => (
                                        <option key={key} value={diamondType[key]}>
                                            {diamondType[key]}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    className="Editproducts-text"
                                    type="number"
                                    name="price"
                                    value={type.price}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Price"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="diamondCount"
                                    value={type.diamondCount}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Count"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="diamondColour"
                                    value={type.diamondColour}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Colour"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="diamondClarity"
                                    value={type.diamondClarity}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Clarity"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="diamondShape"
                                    value={type.diamondShape}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Shape"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="diamondWeight"
                                    value={type.diamondWeight}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Weight"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="diamondSettingType"
                                    value={type.diamondSettingType}
                                    onChange={(e) => handleChange(e, 'diamondType', index)}
                                    placeholder="Setting Type"
                                />
                                <br />
                                <button type="button" className="Editproducts-button2" onClick={() => handleRemoveItem('diamondType', index)}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="Editproducts-button1" onClick={() => handleAddItem('diamondType')}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">stone</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stone}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">stoneSize</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stoneSize}
                        />
                    </div><div className="Editproducts-container">
                        <label className="Editproducts-title">stoneShape</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stoneShape}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">stonesCount</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stonesCount}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">stoneColour</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stoneColour}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">stoneWeight</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stoneWeight}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">stoneSettingtype</label>
                        <input
                            className="Editproducts-text"
                            type="text"
                            name="name"
                            value={formData.stoneSettingtype}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Stone Types</label>
                        {formData.stoneType.map((type, index) => (
                            <div key={index}>

                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stone"
                                    value={type.stone}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Stone"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="number"
                                    name="price"
                                    value={type.price}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Price"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stoneSize"
                                    value={type.stoneSize}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Size"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stonesCount"
                                    value={type.stonesCount}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="stonesCount"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stoneShape"
                                    value={type.stoneShape}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Shape"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stoneColour"
                                    value={type.stoneColour}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Colour"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stoneWeight"
                                    value={type.stoneWeight}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Weight"
                                />
                                <input
                                    className="Editproducts-text"
                                    type="text"
                                    name="stoneSettingtype"
                                    value={type.stoneSettingtype}
                                    onChange={(e) => handleChange(e, 'stoneType', index)}
                                    placeholder="Setting Type"
                                />
                                <br />
                                <button type="button" className="Editproducts-button2" onClick={() => handleRemoveItem('stoneType', index)}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="Editproducts-button1" onClick={() => handleAddItem('stoneType')}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Making Charges</label>
                        <input
                            className="Editproducts-text"
                            type="number"
                            name="makingCharges"
                            value={formData.makingCharges}
                            onChange={(e) => setFormData({ ...formData, makingCharges: e.target.value })}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">GST</label>
                        <input
                            className="Editproducts-text"
                            type="number"
                            name="gst"
                            value={formData.gst}
                            onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Offer</label>
                        <input
                            className="Editproducts-text"
                            type="number"
                            name="offer"
                            value={formData.offer}
                            onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                        />
                    </div>

                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Product Pictures (Images)</label>
                        <input
                            className="Editproducts-text"
                            type="file"
                            name="productPictures"
                            onChange={handleProductPicturesChange}
                            accept="image/*"
                            multiple
                        />
                    </div>
                    <div className="Editproducts-container">
                        <label className="Editproducts-title">Video Product (Video)</label>
                        <input
                            className="Editproducts-text"
                            type="file"
                            name="productVideo"
                            onChange={handleproductVideoChange}
                            accept="video/*"
                        />
                    </div>
                    <div className="coloum">
                        {formData.productPictures.map((picture, index) => (
                            <div key={index} className="col-md-6">
                                <img
                                    src={picture.img ? `http://localhost:2000${picture.img}` : URL.createObjectURL(picture)}
                                    alt={`Selected Image ${index + 1}`}
                                    style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        margin: "0.5px",
                                    }}
                                />
                            </div>
                        ))}
                        {formData.productVideo && (
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Selected Video</h5>
                                        <video controls style={{ maxWidth: "100px" }}>
                                            <source src={formData.productVideo instanceof File ? URL.createObjectURL(formData.productVideo) : `http://localhost:2000${formData.productVideo}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className='Editproducts-button' >Update</button>
                </div>
            </form>
            <Dialog
                message={message}
                showDialog={showDialog}
                onClose={() => setShowDialog(false)}
            />
        </div>
    );
};

export default EditProduct;