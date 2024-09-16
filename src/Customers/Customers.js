import React, { useEffect, useState } from "react";
import "./Customer.css";
import axiosInstance from "../helpers/axios";

const Customers = () => {
  const [formData, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getAllUsers");
      setData(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="Customer-Container">
      <div className="Customer-header">
        <h1 className="Customer-header-text">Customer</h1>
      </div>
      <div className="Customer-Details">
        <table className="table table-striped">
          <thead>
            <tr className="Customertable-header">
              <th>CUSTOMER ID</th>
              <th>CUSTOMER NAME</th>
              <th>EMAIL</th>
              <th>PHONE NUMBER</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((customer, index) => {
              const { _id } = customer;
              return (
                <tr className="Customertable-body" key={_id}>
                  <td className="Customertable-body">{customer._id}</td>
                  <td className="Customertable-body">{customer.fullName}</td>
                  <td className="Customertable-body">{customer.email}</td>
                  <td className="Customertable-body">{customer.contactNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
