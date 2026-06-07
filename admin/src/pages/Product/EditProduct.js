import React, { useState, useEffect } from "react";
import GridLayout from "../../components/GridLayout";
import CSS from "./EditProduct.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { backendUrl, getAuthHeaders } from '../../apiUrl';

const EditProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    axios
      .get(`${backendUrl}/api/getproduct`)
      .then((res) => {
        const data = res.data.success ? res.data.data : res.data;
        const sorted = Array.isArray(data) ? data.sort((a, b) => a.productName.localeCompare(b.productName)) : [];
        setProducts(sorted);
      })
      .catch((err) => console.error(err));
  };

  const handleEditProduct = (productId) => {
    const productToUpdate = products.find((product) => product._id === productId);
    localStorage.setItem('edit', JSON.stringify({ productToUpdate }));
    navigate('/edit');
  };

  const handleDeleteProduct = (productId) => {
    axios
      .delete(`${backendUrl}/api/deleteproduct/${productId}`, { headers: getAuthHeaders() })
      .then(() => {
        fetchData();
        toast.success("Product deleted Successfully");
      })
      .catch(() => toast.error("Error in deleting product"));
  };

  return (
    <GridLayout>
      <h1 className={CSS["addproduct-title"]}>Edit your Product</h1>
      <table className={CSS["table"]}>
        <thead>
          <tr>
            <th className={CSS["table-head-row"]}>Category Name</th>
            <th className={CSS["table-head-row"]}>Product Name</th>
            <th className={CSS["table-head-row"]}>New Price</th>
            <th className={CSS["table-head-row"]}>Old Price</th>
            <th className={CSS["table-head-row"]}>Quantity</th>
            <th className={CSS["table-head-row"]}>Image</th>
            <th className={`${CSS["table-head-row"]} ${CSS["table-head-btn"]}`}>Edit Product</th>
            <th className={`${CSS["table-head-row"]} ${CSS["table-head-btn"]}`}>Delete Product</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className={CSS["table-data"]}>{product.categoryName}</td>
              <td className={CSS["table-data"]}>{product.productName}</td>
              <td className={CSS["table-data"]}>{product.newPrice}</td>
              <td className={CSS["table-data"]}>{product.oldPrice}</td>
              <td className={CSS["table-data"]}>{product.quantity}</td>
              <td className={CSS["table-data"]}>
                <img src={product.productImage} alt={product.productName} width={"80px"} height={"80px"} />
              </td>
              <td className={CSS["table-data"]}>
                <button className={CSS["table-data-edit-btn"]} type="button" onClick={() => handleEditProduct(product._id)}>
                  Edit
                </button>
              </td>
              <td className={CSS["table-data"]}>
                <button className={CSS["table-data-delete-btn"]} type="button" onClick={() => handleDeleteProduct(product._id)}>
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

export default EditProduct;
