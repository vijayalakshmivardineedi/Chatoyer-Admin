import React, { useState, useEffect } from "react";
import "./Orders.css";
import { MdDownload } from "react-icons/md";
import axiosInstance from "../helpers/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Orders = () => {
  const [formData, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getAllOrders");
      setData(response.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const itemColumns = [
    { header: "Item", dataKey: "item" },
    { header: "Product Code", dataKey: "productCode" },
    { header: "Product By", dataKey: "productBy" },
    { header: "Dimensions", dataKey: "dimensions" },
    { header: "Gold Type", dataKey: "goldType" },
    { header: "Gold Kt", dataKey: "goldKt" },
    { header: "Diamond Details", dataKey: "diamondDetails" },
    { header: "Stone Details", dataKey: "stoneType" },
  ];

  const generateInvoice = (order) => {
    const doc = new jsPDF();

    const title = "Invoice";
    doc.setFontSize(18);
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - titleWidth) / 2;
    doc.text(title, xPosition, 10);

    doc.setFontSize(12);
    const utcDate = order.orderStatus && order.orderStatus[0] ? order.orderStatus[0].date : 'N/A';
    const localDate = new Date(utcDate).toLocaleString();
    doc.text(`Date: ${localDate}`, 10, 20);

    doc.text(`Order ID: ${order._id || 'N/A'}`, 10, 30);

    doc.text(`Customer: ${order.address.name}`, 10, 40);

    const tableData = order.items.map((item, index) => {
      const { productCode, productBy, height, width } = item.productId || {};

      return {
        item: index + 1,
        productCode: productCode || '-',
        productBy: productBy || '-',
        dimensions: `${height ? height + 'h' : '-'} * ${width ? width + 'w' : '-'}`,
        goldType: item.goldType ? `${item.goldType} \n ${item.goldTypePrice || '-'}` : '-',
        goldKt: item.goldKt ? `${item.goldKt} \n ${item.goldKtPrice || '-'}` : '-',
        diamondDetails: item.diamondType ? `${item.diamondType} \n ${item.diamondTypePrice || '-'}` : '-',
        stoneType: item.stoneType ? `${item.stoneType} \n ${item.stonePrice || '-'}` : '-',
      };
    });

    doc.autoTable({
      startY: 60,
      head: [itemColumns.map(col => col.header)],
      body: tableData.map(row => itemColumns.map(col => row[col.dataKey])),
      theme: 'striped',
      margin: { top: 10 },
      styles: {
        cellPadding: 3,
        valign: 'top',
        overflow: 'linebreak',
        halign: 'left'
      },
      columnStyles: {
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' }
      }
    });

    const paymentStartY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total: ${order.totalAmount || '0'} Rs/-`, 10, paymentStartY);
    doc.text(`Payment Status: ${order.paymentStatus || 'N/A'}`, 10, paymentStartY + 10);
    doc.text(`Payment Method: ${order.paymentMethod || 'N/A'}`, 10, paymentStartY + 20);
    doc.text(`Order Status: ${order.orderStatus && order.orderStatus[0] ? order.orderStatus[0].type : 'N/A'}`, 10, paymentStartY + 30);

    doc.save(`invoice_${order._id || 'unknown'}.pdf`);
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
    <div className="Orders-Container">
      <div className="Orders-header">
        <h1 className="Orders-header-text">Orders</h1>
      </div>
      <div>
        <table className="table table-striped">
          <thead className="table-header">
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Total Amount</th>
              <th>Order</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((order, index) => (
              <tr className="table-body" key={order._id}>
                <td>{order._id}</td>
                <td>{order.address.name}</td>
                <td>{order.address.contactNumber}</td>
                <td>{`${order.address.plotNo}, ${order.address.streetName}, ${order.address.district}`}</td>
                <td>{order.paymentMethod}</td>
                <td>{convertToIndianFormat(order.totalAmount)}/-</td>
                <td>{order.orderStatus[0]?.type || 'N/A'}</td>
                <td>
                  <div className="tooltip-container" style={{ marginLeft: "10%" }}>
                    <button className="Ordersinvoice-download" onClick={() => generateInvoice(order)}>
                      <MdDownload />
                    </button>
                    <span className="tooltip-text">Download Invoice</span>
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
