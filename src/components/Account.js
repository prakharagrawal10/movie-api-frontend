import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Account.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [seat, setSeat] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
      } catch (err) {
        console.error("Profile Error:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
      }
    };

    const fetchSeats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/account`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSeat(response.data.reservations || []);
      } catch (err) {
        console.error("Seats Error:", err);
        setError(err.response?.data?.error || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchSeats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>User data not available.</p>;

  return (
    <div className="account-container">
      <h2>Account Details</h2>
      <p>
        <strong>Name:</strong> {user.name || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {user.email || "N/A"}
      </p>
      <p>
        <strong>Account Created:</strong>{" "}
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
      </p>

      <h3>Bookings</h3>
      {seat.length > 0 ? (
        <ul>
          {seat.filter(booking => !booking.isUsed).map((booking, index) => {

            const movieName = booking?.movieTitle || "Not Available";
            const theaterName = booking?.theater|| "Not Available";
            const date = booking?.createdAt
              ? new Date(booking.createdAt).toLocaleDateString()
              : "Not Available";
            const seatNumbers = Array.isArray(booking.seats)
              ? booking.seats.flat().join(", ")
              : "Not Available";
            const totalPrice = booking?.price || "N/A";

            return (
              <li key={index}>
                <p><strong>Movie:</strong> {movieName}</p>
                <p><strong>Theater:</strong> {theaterName}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Seats:</strong> {seatNumbers}</p>
                <p><strong>Total Price:</strong> ₹{totalPrice}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No bookings found</p>
      )
      
      
      
      }

<h3>Past Bookings</h3>
{seat.filter(booking => booking.isUsed).length > 0 ? (
  <ul>
    {seat.filter(booking => booking.isUsed).map((booking, index) => {
      const movieName = booking?.movieTitle || "Not Available";
      const theaterName = booking?.theater || "Not Available";
      const date = booking?.createdAt
        ? new Date(booking.createdAt).toLocaleDateString()
        : "Not Available";
      const seatNumbers = Array.isArray(booking.seats)
        ? booking.seats.flat().join(", ")
        : "Not Available";
      const totalPrice = booking?.price || "N/A";

      return (
        <li key={index}>
          <p><strong>Movie:</strong> {movieName}</p>
          <p><strong>Theater:</strong> {theaterName}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Seats:</strong> {seatNumbers}</p>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
        </li>
      );
    })}
  </ul>
) : (
  <p>No past bookings found</p>
)}

    </div>
  );
};

export default Account;
