import React, { useState, useEffect } from "react";
import GridLayout from "../../components/GridLayout";
import CSS from "./Orders.module.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl, getAuthHeaders } from '../../apiUrl';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    axios
      .get(`${backendUrl}/api/getorder`, { headers: getAuthHeaders() })
      .then((res) => setOrders(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch((err) => console.error(err));
  };

  const handleDeleteOrder = (orderId) => {
    axios
      .delete(`${backendUrl}/api/deleteorder/${orderId}`, { headers: getAuthHeaders() })
      .then(() => {
        fetchData();
        toast.success("Order deleted Successfully");
      })
      .catch(() => toast.error("Error in deleting Order"));
  };

  return (
    <GridLayout>
      <h1 className={CSS["addproduct-title"]}>Orders Details</h1>
      <table className={CSS["table"]}>
        <thead>
          <tr>
            <th className={CSS["table-head-row"]}>Name</th>
            <th className={CSS["table-head-row"]}>Email</th>
            <th className={CSS["table-head-row"]}>Number</th>
            <th className={CSS["table-head-row"]}>Address</th>
            <th className={CSS["table-head-row"]}>Product Name</th>
            <th className={CSS["table-head-row"]}>Quantity</th>
            <th className={CSS["table-head-row"]}>Price</th>
            <th className={`${CSS["table-head-row"]} ${CSS["table-head-btn"]}`}>Delete Order</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(orders) ? orders : []).map((order) => (
            <tr key={order._id}>
              <td className={CSS["table-data"]}>{order.firstname} {order.lastname}</td>
              <td className={CSS["table-data"]}>{order.email}</td>
              <td className={CSS["table-data"]}>{order.number}</td>
              <td className={CSS["table-data"]}>{order.address} {order.city} {order.country}</td>
              <td className={CSS["table-data"]}>{order.productname}</td>
              <td className={CSS["table-data"]}>{order.quantity}</td>
              <td className={CSS["table-data"]}>{order.price}</td>
              <td className={CSS["table-data"]}>
                <button className={CSS["table-data-delete-btn"]} type="button" onClick={() => handleDeleteOrder(order._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </GridLayout>
  );
};

export default OrderDetails;
