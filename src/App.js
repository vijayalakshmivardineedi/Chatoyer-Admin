import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/Forgotpassword";
import Token from "./Auth/token";
import AddCategory from "./Categories/AddCategories";
import GetCategories from "./Categories/GetCategories";
import EditCategory from "./Categories/EditCategories";
import Sidebar from "./Sidebar/Sidebar";
import DetailedProduct from "./Products/DetailedProduct"
import EditProduct from "./Products/EditProduct"
import CreateProduct from "./Products/AddProduct";
import Getcoupons from "./Coupons/Getcoupons";
import Customers from "./Customers/Customers";
import Dashboard from "./Dashboard/Dashboard";
import GetProducts from "./Products/GetProduct";
import AddCoupon from "./Coupons/AddCoupons";
import EditCoupon from "./Coupons/EditCoupons";
import Orders from "./Orders/Orders";
import TodayPrices from "./Today/Today";
import "./App.css"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/Forgotpassword" element={<ForgotPassword />} />
        <Route path="/*" element={<>
          <Sidebar>
            <Routes>
              <Route path="/addCategory" element={<AddCategory />} />
              <Route path="/getCategories" element={<GetCategories />} />
              <Route path="/editCategory/:categoryId" element={<EditCategory />} />

              <Route path="/getProducts/:category" element={<GetProducts />} />
              <Route path="/detailedProduct/:productId" element={<DetailedProduct />} />
              <Route path="/addProduct" element={<CreateProduct />} />
              <Route path="/editProduct/:productId" element={<EditProduct />} />


              <Route path="/todayPrices" element={<TodayPrices />} />
              <Route path="/getCoupons" element={<Getcoupons />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/getCoupons" element={<Getcoupons />} />
              <Route path="/addCoupon" element={<AddCoupon />} />
              <Route path="/editCoupon/:couponId" element={<EditCoupon />} />

              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Sidebar>
        </>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

