import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CSS from "./Address.module.css";
import Loader from "../Loader/Loader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backedUrl } from "../../apiUrl";
import { useLocation, useNavigate } from "react-router-dom";

import Modal from 'react-modal'

const DELIVERY_FEE = 150;

const EnterDetailsBuy = () => {

  const userToken = localStorage.getItem('token');

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // The buyer can land here either via "Buy Now" (a single `cartObject`) or via
  // cart checkout (a `cartItems` array). Normalize both shapes into one list, and
  // tolerate a missing/empty state instead of crashing on direct navigation/refresh.
  const items = useMemo(() => {
    const state = location.state;
    if (!state) return [];
    if (Array.isArray(state.cartItems)) return state.cartItems.filter(Boolean);
    if (state.cartObject) return [state.cartObject];
    return [];
  }, [location.state]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.newPrice) || 0), 0),
    [items]
  );
  const total = items.length ? subtotal + DELIVERY_FEE : 0;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleRemoveItem = async (productId) => {
    await axios.delete(`${backedUrl}/api/removeFromCart/${productId}`, { headers: { "Authorization": `Bearer ${userToken}` } });
  };

  const handlePlaceOrder = async () => {
    if (!items.length || isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      // The order schema only supports one product per order, so a multi-item cart
      // becomes one order per listing — each routed to its own seller and priced
      // server-side from the actual product record (never trust client-supplied price).
      for (const item of items) {
        await axios.post(`${backedUrl}/api/postorder`, {
          firstname,
          lastname,
          email,
          number,
          city,
          country,
          address,
          productId: item._id,
          quantity: item.quantity,
        }, { headers: { "Authorization": `Bearer ${userToken}` } });
      }

      toast.success("Your order has been successfully placed! Our team will communicate with you on WhatsApp. Thank you!");
      resetFormFields();
      setIsModalOpen(false);
      await Promise.all(items.map((item) => handleRemoveItem(item._id).catch(() => {})));
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while placing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const resetFormFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setNumber(0);
    setCity("");
    setCountry("");
    setAddress("");
    sessionStorage.removeItem('buyItem');
  };

  useEffect(() => {
    const loading = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    loading();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header />

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Select Payment Method"
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px',
                borderRadius: 10,
              },
            }}
          >
            {!showInput && (
              <>
                <h4 style={{ textAlign: 'center' }}>Select Payment Method</h4>
                <button onClick={() => setShowInput(true)} style={{
                  background: 'var(--primary-color)',
                  color: 'var(--white-color)',
                  border: 'none',
                  padding: '6px 12px',
                  width: '100%',
                  borderRadius: 8,
                  margin: '8px 0',
                  fontWeight: 600
                }}>Pay with Easypaisa</button>

                <button onClick={() => setShowInput(true)} style={{
                  background: 'var(--primary-color)',
                  color: 'var(--white-color)',
                  border: 'none',
                  padding: '6px 12px',
                  width: '100%',
                  borderRadius: 8,
                  margin: '8px 0',
                  fontWeight: 600
                }}>Pay with Jazzcash</button>

                <button onClick={() => setIsModalOpen(false)} style={{
                  background: 'var(--card-color)',
                  color: 'var(--text-color)',
                  border: 'none',
                  padding: '6px 12px',
                  width: '100%',
                  borderRadius: 8,
                  margin: '8px 0',
                  fontWeight: 600
                }}>Cancel</button>
              </>)}
            {showInput && (
              <>
                <div>
                  <h4 style={{ textAlign: 'center' }}>Enter Number</h4>
                  <input type="tel"
                    placeholder="Enter Phone Number"
                    style={{
                      background: 'var(--card-color)',
                      color: 'var(--text-color)',
                      border: 'none',
                      padding: '8px 18px',
                      width: '280px',
                      borderRadius: 8,
                      margin: '8px 0'
                    }}
                    required />
                </div>
                <button onClick={handlePlaceOrder} disabled={isPlacingOrder} style={{
                  background: 'var(--primary-color)',
                  color: 'var(--white-color)',
                  border: 'none',
                  padding: '6px 12px',
                  width: '100%',
                  borderRadius: 8,
                  margin: '8px 0',
                  fontWeight: 600,
                  opacity: isPlacingOrder ? 0.6 : 1,
                }}>{isPlacingOrder ? "Placing Order..." : "Place Order"}</button>
                <button onClick={() => setIsModalOpen(false)} style={{
                  background: 'var(--card-color)',
                  color: 'var(--text-color)',
                  border: 'none',
                  padding: '6px 12px',
                  width: '100%',
                  borderRadius: 8,
                  margin: '8px 0',
                  fontWeight: 600
                }}>Cancel</button>
              </>

            )}
          </Modal>

          <div className={`${CSS["container-fluid"]} container-fluid`}>
            <div className="container">
              <h1 className={CSS["contact-title"]}>Address Details</h1>
              {items.length === 0 ? (
                <div className={CSS["contactus-img"]}>
                  <h2>No items selected for checkout.</h2>
                  <p>Please choose a product to buy and try again.</p>
                  <button className={CSS["send-btn"]} type="button" onClick={() => navigate('/')}>
                    Back to Shop
                  </button>
                </div>
              ) : (
              <div className={CSS["contactus-container"]}>
                <div className={CSS["contactus-details"]}>
                  <form onSubmit={handleSubmitOrder}>
                    <div className={CSS["contactus-subject-container"]}>
                      <label className={CSS["contactus-label"]} htmlFor="_email"  >
                        Email<span className={CSS["contactus-star"]}>*</span>
                      </label>
                      <input className={CSS["contactus-subject"]} type="email" id="_email" name="_email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder={"Email"} required />
                    </div>
                    <div className={CSS["contactus-name_email-container"]}>
                      <div className={CSS["contactus-name-container"]}>
                        <label className={CSS["contactus-label"]} htmlFor="_firstName">First Name
                          <span className={CSS["contactus-star"]}>*</span>
                        </label>
                        <input className={CSS["contactus-name"]} type="text" id="_firstName" name="_firstName" onChange={(e) => setFirstName(e.target.value)} value={firstname} placeholder={"First Name"} required />
                      </div>
                      <div className={CSS["contactus-name-container"]}>
                        <label className={CSS["contactus-label"]} htmlFor="_lastName">Last Name
                          <span className={CSS["contactus-star"]}>*</span>
                        </label>
                        <input className={CSS["contactus-email"]} type="text" id="_lastName" name="_lastName" onChange={(e) => setLastName(e.target.value)} value={lastname} placeholder={"Last Name"} required />
                      </div>
                    </div>
                    <div className={CSS["contactus-subject-container"]}>
                      <label className={CSS["contactus-label"]} htmlFor="_number">
                        Number<span className={CSS["contactus-star"]}>*</span>
                      </label>
                      <input className={CSS["contactus-subject"]} min={0} type="number" id="_number" name="_number" onChange={(e) => setNumber(e.target.value)} value={number} placeholder={"Number"} required />
                    </div>
                    <div className={CSS["contactus-name_email-container"]}>
                      <div className={CSS["contactus-name-container"]}>
                        <label className={CSS["contactus-label"]} htmlFor="_city">City
                          <span className={CSS["contactus-star"]}>*</span>
                        </label>
                        <input className={CSS["contactus-name"]} type="text" id="_city" name="_city" onChange={(e) => setCity(e.target.value)} value={city} placeholder={"City"} required />
                      </div>
                      <div className={CSS["contactus-name-container"]}>
                        <label className={CSS["contactus-label"]} htmlFor="_country">Country
                        </label>
                        <input className={CSS["contactus-email"]} type="text" id="_country" name="_country" onChange={(e) => setCountry(e.target.value)} value={country} placeholder={"Country"} />
                      </div>
                    </div>
                    <div className={CSS["contactus-message-container"]}>
                      <label className={CSS["contactus-label"]} htmlFor="_address"  >
                        Address<span className={CSS["contactus-star"]}>*</span>
                      </label>
                      <textarea rows={3} className={CSS["contactus-message"]} id="_address" name="_address" onChange={(e) => setAddress(e.target.value)} value={address} placeholder={"Address"} required
                      ></textarea>
                    </div>
                    <button className={CSS["send-btn"]} type="submit">
                      Place Order
                    </button>
                  </form>
                </div>
                <div className={CSS["contactus-img"]}>
                  {items.map((item) => (
                    <div key={item._id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--card-color)' }}>
                      <h1>Name: {item.productName}</h1>
                      <p>Description: {item.description}</p>
                      <p style={{ background: '#3bb77e1a', padding: '10px 20px', fontWeight: 600, fontSize: 18, borderRadius: 50 }}>Quantity: {item.quantity}</p>
                      <h2>Item Total: Rs. {(Number(item.quantity) || 0) * (Number(item.newPrice) || 0)}</h2>
                    </div>
                  ))}
                  <p>Delivery charges should be applied and added in total amount. Rs.{DELIVERY_FEE}</p>
                  <h2>Total Price: Rs. {total}</h2>
                </div>
              </div>
              )}
            </div>
          </div>
          <ToastContainer />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default EnterDetailsBuy;
