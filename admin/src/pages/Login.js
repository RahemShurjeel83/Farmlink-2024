import React, { useState, useEffect } from "react";
import RouteMenu from "./RouteMenu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CSS from "./Login.module.css";
import axios from "axios";
import { backendUrl } from "../apiUrl";

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && Date.now() < payload.exp * 1000) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("adminToken");
      }
    } catch {
      localStorage.removeItem("adminToken");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { uname, pass } = event.target.elements;
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
        email: uname.value,
        password: pass.value,
      });
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
      } else {
        toast.error(data.message || "Incorrect credentials");
      }
    } catch {
      toast.error("Incorrect credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) return <RouteMenu onLogout={handleLogout} />;

  return (
    <div className={CSS['app']}>
      <div className={CSS["form"]}>
        <div className={CSS["title"]}>Admin Login</div>
        <form onSubmit={handleSubmit}>
          <div className={CSS["input-container"]}>
            <label>Email </label>
            <input type="email" name="uname" required placeholder="admin email" autoComplete="off" />
          </div>
          <div className={CSS["input-container"]}>
            <label>Password </label>
            <input type="password" name="pass" required placeholder="password" autoComplete="off" />
          </div>
          <div className={CSS["button-container"]}>
            <button type="submit">Login</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
