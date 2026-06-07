import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashBoard from './DashBoard/DashBoard'
import AddCategory from './Category/AddCategory'
import EditCategory from './Category/EditCategory'
import AddProduct from './Product/AddProduct'
import EditProduct from './Product/EditProduct'
import Orders from './Query/Orders'
import UserQuery from './Query/UserQuery'
import Edit from './Product/Edit/Edit'
import OrderDetails from '../pages//Query/OrderDetails'

const RouteMenu = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<DashBoard />} />
        <Route path='/addcategory' element={<AddCategory />} />
        <Route path='/editcategory' element={<EditCategory />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/editproduct' element={<EditProduct />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/ordersdetails' element={<OrderDetails />} />
        <Route path='/userquery' element={<UserQuery />} />
        <Route path='/edit' element={<Edit />} />
      </Routes>
    </Router>
  )
}

export default RouteMenu