import React, { useState, useEffect } from "react";
import GridLayout from "../../components/GridLayout";
import CSS from "./Orders.module.css";
import axios from 'axios';
import { backendUrl, getAuthHeaders } from '../../apiUrl';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    axios
      .get(`${backendUrl}/api/getorder`, { headers: getAuthHeaders() })
      .then((res) => setOrders(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch((err) => console.error(err));
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter((order) => {
    const fullName = `${order.firstname} ${order.lastname}`.toLowerCase();
    return fullName.includes(searchValue.toLowerCase());
  });

  return (
    <GridLayout>
      <h1 className={CSS["addproduct-title"]}>Orders List</h1>
      <input
        className={CSS['input-search']}
        type="text"
        placeholder="Search by name"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
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
