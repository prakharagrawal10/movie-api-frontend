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



  const currentDate = new Date();
  const activeTransactions = seat.filter(
    (booking) => !booking.isUsed && new Date(booking.showtimeDate) > currentDate
  );
  const bookingHistory = seat.filter(
    (booking) => booking.isUsed || new Date(booking.showtimeDate) <= currentDate
  );

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

      <h3>Active Transactions</h3>
      {activeTransactions.length > 0 ? (
        <ul>
          {activeTransactions.map((booking, index) => (
            <li key={index}>
              <p><strong>Movie:</strong> {booking.movieTitle || "Not Available"}</p>
              <p><strong>Theater:</strong> {booking.theater || "Not Available"}</p>
              <p><strong>Date:</strong> {new Date(booking.showtimeDate).toLocaleDateString()}</p>
              <p><strong>Seats:</strong> {Array.isArray(booking.seats) ? booking.seats.flat().join(", ") : "Not Available"}</p>
              <p><strong>Total Price:</strong> ₹{booking.price || "N/A"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active transactions</p>
      )}

      <h3>Booking History</h3>
      {bookingHistory.length > 0 ? (
        <ul>
          {bookingHistory.map((booking, index) => (
            <li key={index}>
              <p><strong>Movie:</strong> {booking.movieTitle || "Not Available"}</p>
              <p><strong>Theater:</strong> {booking.theater || "Not Available"}</p>
              <p><strong>Date:</strong> {new Date(booking.showtimeDate).toLocaleDateString()}</p>
              <p><strong>Seats:</strong> {Array.isArray(booking.seats) ? booking.seats.flat().join(", ") : "Not Available"}</p>
              <p><strong>Total Price:</strong> ₹{booking.price || "N/A"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No past bookings</p>
      )}
    </div>
  );
};

export default Account;
