import "./Card.css"
import { BiCategory } from "react-icons/bi";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axiosInstance from "../helpers/axios";
import { useNavigate } from "react-router-dom";

const Card = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getAllOrders");
      setOrdersData(response.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    try {
      const response = await axiosInstance.get("/getCategory");
      setCategoryData(response.data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    try {
      const response = await axiosInstance.get("/getAllUsers");
      setUsersData(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateTotalIncome = (ordersData) => {
    const totalIncome = ordersData.reduce((acc, order) => {
      return acc + parseFloat(order.totalAmount);
    }, 0);
    return totalIncome;
  };
  const totalIncome = (calculateTotalIncome(ordersData)).toFixed(2);



  return (
    <div className="Card-Dashboard">
      <div
        className="Cards"
        style={{ backgroundColor: "#f4c29b", cursor: 'pointer' }}
        onClick={() => navigate('/orders')}
      >
        <h2 style={{ marginTop: "20px", fontWeight: "600" }}>Total Orders</h2>
        <div className="Cards1" style={{ color: "black", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "30px", marginLeft: "40px" }}>{ordersData.length}</p>
          <MdOutlineBookmarkBorder style={{ width: "40px", height: "40px", marginRight: "40px" }} />
        </div>
      </div>
      <div className="Cards" 
      style={{ backgroundColor: "#A4CDF9", cursor: 'pointer' }}
      onClick={() => navigate('/getCategories')}
      >
        <h2 style={{ marginTop: "20px", fontWeight: "600" }}>Total Categories</h2>
        <div className="Cards1" style={{ color: "black" }}>
          <p style={{ fontSize: "30px", marginLeft: "40px" }}>{categoryData.length}</p>
          <BiCategory style={{ width: "40px", height: "40px", marginRight: "40px" }} />
        </div>
      </div>
      <div className="Cards" style={{ backgroundColor: "#a3d1c5" }}>
        <h2 style={{ marginTop: "20px", fontWeight: "600" }}>Total Income</h2>
        <div className="Cards1" style={{ color: "black" }}>
          <p style={{ fontSize: "30px", marginLeft: "40px" }}>{totalIncome}</p>
          <FaRupeeSign style={{ width: "30px", height: "30px", marginRight: "40px", marginTop: "5px" }} />
        </div>
      </div>
      <div className="Cards" 
      style={{ backgroundColor: "#eabdcf", cursor:'pointer' }}
      onClick={() => navigate('/customers')}>
        <h2 style={{ marginTop: "20px", fontWeight: "600" }}>Total Customers</h2>
        <div className="Cards1" style={{ color: "black" }}>
          <p style={{ fontSize: "30px", marginLeft: "40px" }}>{usersData.length}</p>
          <FaUsers style={{ width: "40px", height: "40px", marginRight: "40px" }} />
        </div>
      </div>
    </div>
  )
}
export default Card