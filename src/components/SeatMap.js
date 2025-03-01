import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SeatMap.css"; // Ensure to style the seat map

const API_URL = process.env.REACT_APP_API_URL;

const SeatMap = () => {
  const { movieTitle, theater, time } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(""); // Profile state
  const [userEmail, setUserEmail] = useState(""); // Profile state
  const [price, setPrice] = useState(0); // Price per seat

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUserName(data.name || "Guest");
        setUserEmail(data.email || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Fetch seat data for the selected showtime
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/showtime/get-one-show/${encodeURIComponent(
            movieTitle
          )}/${encodeURIComponent(theater)}/${encodeURIComponent(time)}`
        );

        if (!response.ok) throw new Error("Failed to fetch seat data");

        const data = await response.json();
        setSeats(data.seats);
        setPrice(data.price);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [movieTitle, theater, time]);

  // Function to send an email confirmation
  const emailSeats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ticket/send-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          movieTitle,
          theater,
          time,
          seats: selectedSeats.map((seat) => seat.split("-").map(Number)),
          price: price * selectedSeats.length,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sending email failed");

      alert("Email sent successfully!");
    } catch (err) {
      console.error("Sending email failed", err);
      alert("Sending email failed");
    }
  };

  // Function to toggle seat selection
  const toggleSeat = (rowIndex, colIndex) => {
    if (seats[rowIndex][colIndex]) return; // Prevent selecting occupied seats

    setSelectedSeats((prev) => {
      const seatKey = `${rowIndex}-${colIndex}`;
      return prev.includes(seatKey)
        ? prev.filter((seat) => seat !== seatKey)
        : [...prev, seatKey];
    });
  };

  // Function to save reserved seats to the database
  const saveSeat = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ticket/save-seats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          time,
          movieTitle: movieTitle,
          theater: theater,
          seats: selectedSeats.map((seat) => seat.split("-").map(Number)),
          price: price * selectedSeats.length,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Saving reservation failed");

      alert("Reservation saved successfully!");
    } catch (err) {
      console.error("Error saving reservation:", err);
      alert("Error saving reservation.");
    }
  };

  // Function to handle booking submission
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to book seats.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/showtime/reserve-seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieTitle,
          theaterName: theater,
          time,
          selectedSeats: selectedSeats.map((seat) => seat.split("-").map(Number)),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      alert("Booking successful!");
      // await saveSeat(); // Save reservation details
      await emailSeats(); // Send email confirmation

      setSeats(data.seats); // Update seat map with latest data
      setSelectedSeats([]); // Clear selection after booking
    } catch (err) {
      console.error("Error during booking:", err);
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="seat-container">
      {userName && <h2>Welcome, {userName}!</h2>} {/* Display username */}
      <h2>Seat Map for {movieTitle}</h2>
      <h3>Theater: {theater}</h3>
      <p>Showtime: {new Date(decodeURIComponent(time)).toLocaleString()}</p>
      <h3>Ticket Price: ₹{price}</h3> {/* Display price per seat */}
      <h3>Total Price: ₹{price * selectedSeats.length}</h3> {/* Display total price */}
      <div className="seat-legend">
        <span className="seat available"></span> = Available
        <span className="seat selected"></span> = Selected
        <span className="seat occupied"></span> = Occupied
      </div>
      <div className="seat-map">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((isOccupied, colIndex) => {
              const seatKey = `${rowIndex}-${colIndex}`;
              const isSelected = selectedSeats.includes(seatKey);
              return (
                <div
                  key={colIndex}
                  className={`seat ${
                    isOccupied ? "occupied" : isSelected ? "selected" : "available"
                  }`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        disabled={selectedSeats.length === 0}
        onClick={handleSubmit}
      >
        Book Now
      </button>
    </div>
  );
};

export default SeatMap;
