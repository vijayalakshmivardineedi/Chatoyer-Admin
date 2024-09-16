import React, { useState } from 'react';
import axiosInstance from '../helpers/axios';
import "./Today.css";
import Dialog from '../DialogBox/dialogbox';

const TodayPrices = () => {
  const [message, setMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [goldPrices, setGoldPrices] = useState({
    "14kt": '',
    "18kt": '',
    "22kt": '',
    "24kt": ''
  });
  const [diamondPrices, setDiamondPrices] = useState({
    "SI IJ": '',
    "SI GH": '',
    "VS GH": '',
    "VVS EF": ''
  });

  const handleGoldPriceChange = (event) => {
    const { name, value } = event.target;
    setGoldPrices(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }));
  };

  const handleDiamondPriceChange = (event) => {
    const { name, value } = event.target;
    setDiamondPrices(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }));
  };

  const handleGoldSubmit = async (event) => {
    event.preventDefault();
    const filteredGoldPrices = Object.fromEntries(
      Object.entries(goldPrices).filter(([key, value]) => value !== null && value !== '')
    );
    try {
      const response = await axiosInstance.post('/updateGoldKtPrices', filteredGoldPrices);
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
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

  const handleDiamondSubmit = async (event) => {
    event.preventDefault();
    const filteredDiamondPrices = Object.fromEntries(
      Object.entries(diamondPrices).filter(([key, value]) => value !== null && value !== '')
    );
    try {
      const response = await axiosInstance.post('/updateDiamondPrices', filteredDiamondPrices);
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
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
    <div className="container">
      <div className="header">
        <h1 className="heading1">Update Prices</h1>
      </div>
      <div className="form-container">
        <div className="form-wrapper">
          <form onSubmit={handleGoldSubmit}>
            <h3 className='main-label'>Gold Prices</h3>
            <label className='label'>
              14kt:
              <input
                type="number"
                name="14kt"
                value={goldPrices["14kt"]}
                onChange={handleGoldPriceChange}
              />
            </label>
            <br />
            <label className='label'>
              18kt:
              <input
                type="number"
                name="18kt"
                value={goldPrices["18kt"]}
                onChange={handleGoldPriceChange}
              />
            </label>
            <br />
            <label className='label'>
              22kt:
              <input
                type="number"
                name="22kt"
                value={goldPrices["22kt"]}
                onChange={handleGoldPriceChange}
              />
            </label>
            <br />
            <label className='label'>
              24kt:
              <input
                type="number"
                name="24kt"
                value={goldPrices["24kt"]}
                onChange={handleGoldPriceChange}
              />
            </label>
            <br />
            <br />
            <button className='Today-button'>Update Gold Prices</button>
          </form>
        </div>
        <div className="form-wrapper">
          <form onSubmit={handleDiamondSubmit}>
          <h3 className='main-label'>Diamond Prices</h3>
            <label className='label'>
              SI IJ:
              <input
                type="number"
                name="SI IJ"
                value={diamondPrices["SI IJ"]}
                onChange={handleDiamondPriceChange}
              />
            </label>
            <br />
            <label className='label'>
              SI GH:
              <input
                type="number"
                name="SI GH"
                value={diamondPrices["SI GH"]}
                onChange={handleDiamondPriceChange}
              />
            </label>
            <br />
            <label className='label'>
              VS GH:
              <input
                type="number"
                name="VS GH"
                value={diamondPrices["VS GH"]}
                onChange={handleDiamondPriceChange}
              />
            </label>
            <br />
            <label className='label'>
              VVS EF:
              <input
                type="number"
                name="VVS EF"
                value={diamondPrices["VVS EF"]}
                onChange={handleDiamondPriceChange}
              />
            </label>
            <br />
            <br />
            <button className='Today-button'>Update Diamond Prices</button>
          </form>
        </div>
        <Dialog
          message={message}
          showDialog={showDialog}
          onClose={() => setShowDialog(false)}
        />
      </div>
    </div>
  );
};

export default TodayPrices;
