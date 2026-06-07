import React, { useEffect, useState } from 'react';
import GridLayout from '../../../components/GridLayout';
import CSS from './Edit.module.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { backendUrl, getAuthHeaders } from '../../../apiUrl';

const Edit = () => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('edit')) || {};
    const p = stored.productToUpdate || {};
    setProductId(p._id || null);
    setCategoryName(p.categoryName || '');
    setProductName(p.productName || '');
    setProductImage(p.productImage || null);
    setNewPrice(p.newPrice ?? '');
    setOldPrice(p.oldPrice ?? '');
    setQuantity(p.quantity ?? '');
    setDescription(p.description || '');
  }, []);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error("No product selected to edit.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("newPrice", newPrice);
    formData.append("oldPrice", oldPrice);
    formData.append("quantity", quantity);
    if (productImage instanceof File) formData.append("productImage", productImage);

    try {
      await axios.put(`${backendUrl}/api/editproduct/${productId}`, formData, {
        headers: { ...getAuthHeaders() },
      });
      toast.success("Product updated successfully");
      localStorage.removeItem('edit');
      navigate('/editproduct');
    } catch (err) {
      toast.error(err.response?.data?.message || "Product can't be updated");
    }
  };

  return (
    <GridLayout>
      <h1 className={CSS['addproduct-title']}>Edit Product</h1>
      <form encType='multipart/form-data' className={CSS['from-container']} onSubmit={handleUpdateProduct}>
        <div>
          <div className={CSS['product-name-div']}>
            <label htmlFor='category-name'>Category Name</label>
            <input required type='text' placeholder='Category Name' id='category-name' name='categoryName' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </div>
          <div className={CSS['product-product-name-div']}>
            <label htmlFor='product-name'>Product Name</label>
            <input required type='text' placeholder='Product Name' id='product-name' name='productName' value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className={CSS['product-description-div']}>
            <label htmlFor='description'>Description</label>
            <textarea required placeholder='Description' id='description' name='description' value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
          </div>
          <div className={CSS['product-new-price-div']}>
            <label htmlFor='new-price'>New Price</label>
            <input min={0} required type='number' placeholder='New Price' id='new-price' name='newPrice' value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          </div>
          <div className={CSS['product-old-name-div']}>
            <label htmlFor='old-price'>Old Price</label>
            <input min={0} required type='number' placeholder='Old Price' id='old-price' name='oldPrice' value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
          </div>
          <div className={CSS['product-quantity-div']}>
            <label htmlFor='quantity'>Quantity</label>
            <input min={0} required type='number' placeholder='Quantity' id='quantity' name='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className={CSS['product-selectimg-div']}>
            <label htmlFor='product-img'>Select Image (leave empty to keep current)</label>
            <input type='file' name='productImage' id='product-img' onChange={(e) => setProductImage(e.target.files[0])} />
          </div>
          <button type='submit' className={CSS['product-button']}>Update Product</button>
        </div>
        <div className={CSS['product-img-div']}>
          {productImage && (
            <img
              src={productImage instanceof File ? URL.createObjectURL(productImage) : productImage}
              alt="Preview"
            />
          )}
        </div>
        <ToastContainer />
      </form>
    </GridLayout>
  );
};

export default Edit;
