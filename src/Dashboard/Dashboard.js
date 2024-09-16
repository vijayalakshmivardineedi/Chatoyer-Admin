import React from "react";
import Card from './Card'; 
import Graph from './Graph';
import "./Dashboard.css";
const Dashboard = () => {
  return (
    
    <div className="Dashboard-Container">
      <div className="Dashboard-header">
        <h1 className="Dashboard-header-text">Dashboard</h1>
      </div>
      <div className="card-container">
        <Card title="Number Of Orders" content="" />
      </div>
      <div className="Graph-Container">
        <br></br>
        <Graph title="website views" style={{marginTop:"50px"}}/>
      </div>
    </div>
  );
};
export default Dashboard;
