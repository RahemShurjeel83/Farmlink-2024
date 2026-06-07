import React, { useState } from 'react'
import GridLayout from '../../components/GridLayout'
import CSS from './AddProduct.module.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl, getAuthHeaders } from '../../apiUrl';

const AddProduct = () => {
  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState();
  const [newPrice, setNewPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [Image, setImage] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("newPrice", newPrice);
    formData.append("oldPrice", oldPrice);
    formData.append("quantity", quantity);
    formData.append("productImage", productImage);
    try {
      await axios.post(`${backendUrl}/api/postproduct`, formData, {
        headers: { ...getAuthHeaders() },
      });
      toast.success("Product Added Successfully");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Product can't be added";
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired — please log out and log in again");
      } else {
        toast.error(typeof msg === "string" ? msg : "Product can't be added");
      }
    }
    setCategoryName('');
    setProductName('');
    setDescription('');
    setNewPrice('');
    setOldPrice('');
    setQuantity('');
    setProductImage(undefined);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <GridLayout>
      <h1 className={CSS['addproduct-title']}>Add your Product</h1>
      <form encType='multipart/form-data' className={CSS['from-container']} onSubmit={handleAddProduct}>
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
            <label htmlFor='product-img'>Select Image</label>
            <input required className='' type='file' name='productImage' id='product-img' onChange={handleImageChange} />
          </div>
          <button type='submit' className={CSS['product-button']}>Add Product</button>
          <div style={{ textAlign: "center" }}>
            {Image && <img className={CSS['category-img']} src={Image} alt='Preview' width={'300px'} height={'300px'} />}
          </div>
        </div>
        <div className={CSS['product-img-div']}></div>
        <ToastContainer />
      </form>
    </GridLayout>
  );
};

export default AddProduct;
