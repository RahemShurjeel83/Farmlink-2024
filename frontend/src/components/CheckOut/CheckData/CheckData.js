import React, { useEffect, useState } from 'react'
import CSS from './CheckData.module.css'
import { Link, useNavigate } from 'react-router-dom'
import CheckOutCard from './CheckOutCard/CheckOutCard';
import axios from "axios";
import { backedUrl } from "../../../apiUrl";

const CheckData = () => {

    const userToken = localStorage.getItem('token');

    const [CartObject, setCartItems] = useState([])
    useEffect(() => {
        getCartItems()
    }, [])
    const navigate = useNavigate()
    const getCartItems = async () => {
        try {
            let ifUser = localStorage.getItem("token");
            let { data } = await axios.get(`${backedUrl}/api/getCartItems`, { headers: { "Authorization": `Bearer ${userToken}` } });
            setCartItems(data.data.cartItems);

        } catch (error) {
            console.log("err", error)
        }
    };

    const handleRemoveItem = async (productId) => {
        // const updatedCartItems = CartObject.filter(item => item.productImage !== productImage);
        // setCartItems(updatedCartItems);
        let ifUser = localStorage.getItem("token");
        await axios.delete(`${backedUrl}/api/removeFromCart/${productId}`, { headers: { "Authorization": `Bearer ${userToken}` } })
        window.location.reload()
    }
    return (
        <div className={`${CSS['container-fluid']} container-fluid`}>
            <div className='container'>
                <Link className={CSS['back-link']} to={'/addtocart'}>
                    <i className={`${CSS['back-icon']} fa-solid fa-backward`}></i>
                    <span className={CSS['back']} >Back</span>
                </Link>
                <h2 className={CSS['my-cart']} >My Cart</h2>
                {CartObject.map((item) => (
                    <CheckOutCard key={item.productImage} CartItem={item} onRemove={() => handleRemoveItem(item._id)} />
                ))}

                <div className={CSS['containter-checkbox']}>
                    <input className={CSS['checkbox1']} type='checkbox' name='term1' />
                    <p className={CSS['checkbox-details1']}>Buying as a Gift? Tick here to include gift wrapping.</p>
                </div>
                <div className={CSS['containter-checkbox']}>
                    <input className={CSS['checkbox2']} type='checkbox' name='term2' />
                    <p className={CSS['checkbox-details2']}>Do you want to subscribe to our newletter for limited offers and promotion?</p>
                </div>
                <div className={CSS['containter-checkbox']}>
                    <input className={CSS['checkbox3']} type='checkbox' name='term3' />
                    <p className={CSS['checkbox-details3']}>Agree to the Term and Condition?</p>
                </div>
                <div>

                    <button onClick={() => navigate(`/address`, { state: { cartItems: CartObject } })} className={CSS['payment-btn']}>Proceed to Details</button>

                    <Link to={'/'}>
                        <button className={CSS['back-shop-btn']}>Back to Shop</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CheckData






