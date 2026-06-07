import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailImage from '../../images/email.png';
import personImage from '../../images/person.png';
import passwordImage from '../../images/password.png';
import CSS from './Login.module.css';
import ForgetPassword from '../ForgetPassword/ForgetPassword';
import LoginBackground from './LoginBackground';
import axios from "axios";
import { backedUrl } from "../../apiUrl"

const Login = ({ toggleLoginPopup }) => {

  const navigate = useNavigate();
  const [action, setAction] = useState('Login');
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showforgetPopup, setShowLoginPopup] = useState(false);
  const [Logindis, setLogindis] = useState(true);
  const [role, setRole] = useState('Buyer');

  const toggleforgetPopup = () => {
    setShowLoginPopup(!showforgetPopup);
  };


  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const isNameValid = (name) => {
    const emailRegex = /^[a-zA-Z\s]+$/;
    return emailRegex.test(name);
  };
  const isPasswordValid = (password) => {
    const emailRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    return emailRegex.test(password);
  };

  const handleSignUp = async (e) => {
    try {
      setAction("Sign Up")
      if (!name || !emailInput || !password) {
        // alert("Fill all fields")
        return
      }
      e.preventDefault();
      if (!isNameValid(name) && action !== "Login") {
        alert("Please enter correct name.");
        return false;
      }

      if (!isEmailValid(emailInput) && action !== "Login") {
        alert("Please enter a valid email address.");
        return false;
      }
      // if (!isPasswordValid(password) && action !== "Login") {
      //   alert("Please enter strong password which includes special characters.");
      //   return false;
      // }
      let ourdata = { username: name, email: emailInput, password }

      const apiURL = role === 'Buyer' ? `${backedUrl}/api/register` : `${backedUrl}/api/vendor/register`;

      let { data } = await axios.post(apiURL, ourdata)
      if (data.success) {
        setName("");
        setEmailInput("");
        setPassword("")
        localStorage.setItem('token', data.token)
        setAction('')
        alert("Account created successfully")
        toggleLoginPopup()
      }

    } catch (error) {
      alert(error.response?.data?.message || "Sign up failed. Please try again.")
    }
  };

  const handleLogin = async (e) => {
    try {
      setAction("Login")
      e.preventDefault();
      if (!isEmailValid(emailInput) && action !== "Sign Up") {
        alert("Please enter a valid email address.");
        return false;
      }
      // if (!isPasswordValid(password) && action !== "Sign Up") {
      //   alert("Please enter your correct password.");
      //   return false;
      // }
      let ourdata = { username: name, email: emailInput, password }

      const apiURL = role === 'Buyer' ? `${backedUrl}/api/login` : `${backedUrl}/api/vendor/login`;

      let { data } = await axios.post(apiURL, ourdata);

      if (data.success) {
        setEmailInput("");
        setPassword("")
        localStorage.setItem('token', data.token)
        localStorage.setItem("userRole", role)
        setAction('')
        if(role === 'Vendor') {
          navigate('/vendor-dashboard');
        }
        if(role === 'Buyer') {
          navigate('/')
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your email and password.")
    }

  };

  return (
    <div className={CSS['login-page']}>
    <LoginBackground role={role} />
    <div className={CSS['containera']}>
      <div className={CSS['header']}>
        <div className={CSS['text']}>{Logindis ? "Login" : "Sign Up"}</div>
      </div>
      <div className={CSS['role-container']}>
        <button
          className={`${role === 'Buyer' ? CSS['selected'] : CSS['un-selected']}`}
          onClick={() => setRole('Buyer')}
        >
          Buyer
        </button>
        <button
          className={`${role === 'Vendor' ? CSS['selected'] : CSS['un-selected']}`}
          onClick={() => setRole('Vendor')}
        >
          Vendor
        </button>
      </div>
      <div className={CSS['allinputs']}>
        {Logindis ? null : (
          <div className={CSS['inputs']}>
            <img width={'20px'} height={'20px'} src={personImage} alt='' />
            <input type='text' placeholder='Name' value={name} onChange={(e) => { setName(e.target.value) }} required={true} />
          </div>
        )}
        <div className={CSS['inputs']}>
          <img width={'20px'} height={'15px'} src={emailImage} alt='' />
          <input required type='email' placeholder='Email' value={emailInput} onChange={(e) => { setEmailInput(e.target.value) }} />
        </div>
        <div className={CSS['inputs']}>
          <img width={'20px'} height={'20px'} src={passwordImage} alt='' />
          <input required type='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
        </div>
      </div>
      {action === 'Sign Up' ? null : (
        <div className={CSS['forget-password']}>
          Forget Password?{' '}
          <Link className={CSS['forget-password-link']} >
            <span onClick={toggleforgetPopup}>Click here!</span>
          </Link>
        </div>
      )}

      <div className={CSS['submit-container']}>
        {Logindis ? <button type='submit' className={action === 'Sign Up' ? `${CSS['submit']}` : `${CSS['submit']}`} onClick={handleLogin}>
          Login
        </button> :
          <button type='submit' className={action === 'Login' ? `${CSS['submit']}` : `${CSS['submit']}`} onClick={handleSignUp} >
            Sign Up
          </button>}
      </div>
      <div style={{ margin: "auto" }}>
        {Logindis ? <span style={{ color: 'var(--text-color)' }}>Don't have an account? <a href='#' style={{ color: 'var(--primary-color)' }} onClick={() => setLogindis(false)}>Signup Now</a></span>
          : <span style={{ color: 'var(--text-color)' }}>Already have an acoount. <a href='#' style={{ color: 'var(--primary-color)' }} onClick={() => setLogindis(true)}>Login Now</a></span>}
      </div>
      {showforgetPopup && (
        <div className={CSS.login_popup}>
          <ForgetPassword />
          <div className={CSS.close_popup} onClick={toggleforgetPopup}>
            <span className={CSS.close_popup_btn}>&times;</span>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default Login;
