import React, { useState } from 'react'
import email_icon from '../../images/email.png'
import error_icon from '../../images/error.png'
import CSS from './ForgetPassword.module.css'

const ForgetPassword = () => {
    const [email, setEmail] = useState("");

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const handleSignUp = () => {

        if (!isEmailValid(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        setEmail("");
    };
    return (
        <div className={CSS['containera']}>
            <div className={CSS['header']}>
                <img className={CSS['Error_Icon']} src={error_icon} alt='' />
                <div className={CSS['Forget_Text']}>Forget Password</div>
                <div className={CSS['para_text']}>Enter your email and we'll send you a link to reset your password.</div>
            </div>
            <div className={CSS['forget-inputs']}>
                <div className={CSS['forget-input']}>
                    <img src={email_icon} alt='' />
                    <input type='email' placeholder='Email' />
                </div>
            </div>
            <div className={CSS['submit-container']}>
                <button className={CSS['submit_Forget']} onClick={handleSignUp}> Submit</button>
            </div>
        </div>
    )
}

export default ForgetPassword