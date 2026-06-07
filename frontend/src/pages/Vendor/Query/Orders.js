import React, { useState, useEffect } from "react";
import GridLayout from '../../../components/GridLayout/GridLayout'
import CSS from "./Orders.module.css";
import axios from 'axios';
import { backedUrl } from '../../../apiUrl';

const Orders = () => {

  const userToken = localStorage.getItem('token');

  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${backedUrl}/api/getorder`, { headers: { "Authorization": `Bearer ${userToken}` } })
      .then((res) => {
        setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
      });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Defensive: never trust `orders` to be an array, even if the API response shape changes.
  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((order) => {
    const fullName = `${order.firstname} ${order.lastname}`.toLowerCase();
    return fullName.includes(searchValue.toLowerCase());
  });

  const totalRevenue = safeOrders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);

  return (
    <GridLayout>
      <h1 className={CSS["addproduct-title"]}>Orders List</h1>
      <div className={CSS["stats-row"]}>
        <div className={CSS["stat-card"]}>
          <span className={CSS["stat-label"]}>Your Orders</span>
          <span className={CSS["stat-value"]}>{safeOrders.length}</span>
        </div>
        <div className={CSS["stat-card"]}>
          <span className={CSS["stat-label"]}>Your Revenue</span>
          <span className={CSS["stat-value"]}>Rs. {totalRevenue.toLocaleString()}</span>
        </div>
      </div>
      <input
        className={CSS['input-search']}
        type="text"
        placeholder="Search by name"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <table className={CSS["table"]}>
        <thead>
          <tr>
            <th className={CSS["table-head-row"]}>Order Number</th>
            <th className={CSS["table-head-row"]}>Name</th>
            <th className={CSS["table-head-row"]}>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td className={CSS["table-data"]}>{order._id}</td>
              <td className={CSS["table-data"]}>{order.firstname} {order.lastname}</td>
              <td className={CSS["table-data"]}>{order.number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GridLayout>
  );
};

export default Orders;
