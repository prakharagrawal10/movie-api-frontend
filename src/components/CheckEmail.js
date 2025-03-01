import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Keep styling consistent

const CheckEmail = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <h2>Verify Your Email</h2>
            <p>We've sent a verification link to your email. Please check your inbox and click the link to activate your account.</p>
            <p>If you didn't receive an email, check your spam folder or try signing up again.</p>
            <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
    );
};

export default CheckEmail;
