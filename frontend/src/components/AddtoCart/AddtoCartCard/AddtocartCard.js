import React, { useState, useEffect } from 'react'
import CSS from './AddtocartCard.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { backedUrl } from "../../../apiUrl";

const AddtocartCard = () => {

    const userToken = localStorage.getItem('token');

    const [quantity, setQuantity] = useState(1);
    const [clickedItem, setClickedItem] = useState({});
    const navigate = useNavigate()
    useEffect(() => {
        const storedItemDetails = sessionStorage.getItem('clickedItem');
        const parsedItemDetails = storedItemDetails ? JSON.parse(storedItemDetails) : null;
        setClickedItem(parsedItemDetails);
    }, []);

    const handleBuyClick = () => {
        let ifUser = localStorage.getItem("token");
        if (!ifUser) {
            alert("Please Login to Perform this action!");
            return
        }
        const itemDetails = {
            _id:clickedItem._id,
            productName: clickedItem.title,
            newPrice: clickedItem.newPrice,
            description: clickedItem.description,
            quantity: quantity,
            productImage: `${clickedItem.img}`,
        };
        console.log("itemDetails", itemDetails)
        sessionStorage.setItem("buyItem", JSON.stringify(itemDetails));
        navigate("/address", { state: { cartObject: itemDetails } })
    };

    const handleAddtoCart = async () => {
        let ifUser = localStorage.getItem("token");
        if (!ifUser) {
            alert("Please Login to Perform this action!");
            return
        }
        let { data } = await axios.post(`${backedUrl}/api/addtocart/${clickedItem._id}`, {quantity:quantity}, { headers: { "Authorization": `Bearer ${userToken}` } })
        if (data.success) {
            window.location.reload()
            toast.success("Added to Cart Sucessfully")
        }

    };

    return (
        <div className={`${CSS['container']} container`}>
            <div className={CSS['grid-container']}>
                <div className={CSS['img-container']}>
                    <img className={CSS['img']} src={clickedItem.img} alt='rabbit' />
                </div>
                <div className={CSS['data-container']}>
                    <h2 className={CSS['addtocart-title']}>{clickedItem.title}</h2>
                    <h4 className={CSS['addtocart-new-price']}>Rs. {clickedItem.newPrice} <del className={CSS['addtocart-old-price']}>Rs. {clickedItem.oldPrice}</del></h4>
                    <p className={CSS['addtocart-details']}>{clickedItem.description}</p>
                    <p className={CSS['addtocart-reviews']}>Available quantity: {clickedItem.quantity}</p>
                    <div className={CSS['addtocart-quantity']}>
                        Qty: <input min={1} max={20} type='number' id='quantity' name='quantity' className={CSS['addtocart-qty-input']} placeholder='0' value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                    <button type='button' onClick={handleBuyClick} className={CSS['addtocart-link-btn']}>Buy now</button>
                    <button type='button' onClick={handleAddtoCart} className={CSS['addtocart-link-btn']}>Add to Cart</button>
                </div>
                <ToastContainer />
            </div>
        </div>
    )
}

export default AddtocartCard