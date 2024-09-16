import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import axiosInstance from '../helpers/axios';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;


CanvasJS.addColorSet("customPieColors", [
  "#f67112",
  "#2e36a9",
  "#2b914c",
  "#cac733",
  "#be0f1c",
  "#cd46e1"

]);

CanvasJS.addColorSet("customStockColors", [
  "#01cdf4",
  "#000080",
  "#99095f"
]);

class Graph extends Component {
  state = {
    categories: []
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const categoryResponse = await axiosInstance.get("/getCategory");
      const categories = categoryResponse.data.categories;

      const categoryData = await Promise.all(categories.map(async (cat) => {
        try {
          const productResponse = await axiosInstance.get(`/getProductByCategory/${cat.name}`);

          const productCount = productResponse.data.products.length;


          return {
            y: productCount !== undefined ? productCount : 0,
            label: cat.name
          };
        } catch (error) {
          console.error(`Error fetching product count for category ${cat.name}:`, error);
          return {
            y: 0,
            label: cat.name
          };
        }
      }));

      this.setState({ categories: categoryData });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };




  render() {
    const { categories } = this.state;

    if (categories.length === 0) {
      return <div>Loading...</div>;
    }

    const pieOptions = {
      exportEnabled: true,
      animationEnabled: true,
      colorSet: "customPieColors",
      title: {
        text: "Categories",
        fontFamily: "Domine, serif",
        margin: 20
      },
      data: [{
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y} products",
        showInLegend: true,
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y} products",
        dataPoints: categories
      }]
    };

    const stockOptions = {
      animationEnabled: true,
      colorSet: "customStockColors",
      title: {
        text: "Sales",
        fontFamily: "Domine, serif",
        margin: 20
      },
      axisX: {
        valueFormatString: "MMMM"
      },
      axisY: {
        prefix: "",
        labelFormatter: this.addSymbols
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: this.toggleDataSeries,
        verticalAlign: "top"
      },
      data: [{
        type: "column",
        name: "Actual Sales",
        showInLegend: true,
        xValueFormatString: "MMMM YYYY",
        yValueFormatString: "",
        dataPoints: [
          { x: new Date(2024, 0), y: 27500 },
          { x: new Date(2024, 1), y: 29000 },
          { x: new Date(2024, 2), y: 22000 },
          { x: new Date(2024, 3), y: 26500 },
          { x: new Date(2024, 4), y: 33000 },
          { x: new Date(2024, 5), y: 37000 },
          { x: new Date(2024, 6), y: 32000 },
          { x: new Date(2024, 7), y: 27500 },
          { x: new Date(2024, 8), y: 29500 },
          { x: new Date(2024, 9), y: 43000 },
          { x: new Date(2024, 10), y: 55000, indexLabel: "High Renewals" },
          { x: new Date(2024, 11), y: 39500 }
        ]
      }, {
        type: "line",
        name: "Expected Sales",
        showInLegend: true,
        yValueFormatString: "",
        dataPoints: [
          { x: new Date(2024, 0), y: 38000 },
          { x: new Date(2024, 1), y: 39000 },
          { x: new Date(2024, 2), y: 35000 },
          { x: new Date(2024, 3), y: 37000 },
          { x: new Date(2024, 4), y: 42000 },
          { x: new Date(2024, 5), y: 48000 },
          { x: new Date(2024, 6), y: 41000 },
          { x: new Date(2024, 7), y: 38000 },
          { x: new Date(2024, 8), y: 42000 },
          { x: new Date(2024, 9), y: 45000 },
          { x: new Date(2024, 10), y: 48000 },
          { x: new Date(2024, 11), y: 47000 }
        ]
      }, {
        type: "area",
        name: "Profit",
        markerBorderColor: "white",
        markerBorderThickness: 2,
        showInLegend: true,
        yValueFormatString: "",
        dataPoints: [
          { x: new Date(2024, 0), y: 11500 },
          { x: new Date(2024, 1), y: 10500 },
          { x: new Date(2024, 2), y: 9000 },
          { x: new Date(2024, 3), y: 13500 },
          { x: new Date(2024, 4), y: 13890 },
          { x: new Date(2024, 5), y: 18500 },
          { x: new Date(2024, 6), y: 16000 },
          { x: new Date(2024, 7), y: 14500 },
          { x: new Date(2024, 8), y: 15880 },
          { x: new Date(2024, 9), y: 24000 },
          { x: new Date(2024, 10), y: 31000 },
          { x: new Date(2024, 11), y: 19000 }
        ]
      }]
    };

    return (
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "70px" }}>
        <div style={{ width: "49%" }}>
          <CanvasJSChart options={pieOptions} />
        </div>

        <div style={{ width: "49%", color: "black" }}>
          <CanvasJSChart options={stockOptions} onRef={ref => this.chart = ref} />
        </div>
      </div>
    );
  }
}


export default Graph;