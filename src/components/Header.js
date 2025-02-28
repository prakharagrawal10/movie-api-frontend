import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Ensure styling

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from storage
        alert("Logged out successfully!");
        navigate("/"); // Redirect to home
        window.location.reload(); // Refresh page
    };

    return (
        <nav className="header">
            {/* Back to Home */}
            <button className="nav-btn" onClick={() => navigate("/")}>🏠 Home</button>

            {/* Right Side - My Account / Logout */}
            <div className="nav-right">
                {token ? (
                    <>
                        <Link to="/account" className="nav-link">My Account</Link>
                        <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
