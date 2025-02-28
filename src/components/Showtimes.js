import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Showtimes.css";

const API_URL = process.env.REACT_APP_API_URL;

const Showtimes = () => {
  const { movieTitle } = useParams();
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/showtime/get-all-shows/${encodeURIComponent(
            movieTitle
          )}`,
          { cache: "no-store" }
        );
        if (!response.ok) throw new Error("Failed to fetch showtimes");
        const data = await response.json();
        setShowtimes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieTitle]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Group showtimes by theater
  const groupedShowtimes = showtimes.reduce((acc, show) => {
    if (!acc[show.theaterName]) {
      acc[show.theaterName] = [];
    }
    acc[show.theaterName].push(show);
    return acc;
  }, {});

  const handleBookNow = (theater, time) => {
    navigate(
      `/seats/${encodeURIComponent(movieTitle)}/${encodeURIComponent(
        theater
      )}/${encodeURIComponent(time)}`
    );
  };

  return (
    <div className="showtimes-container">
      <h2>Showtimes for {movieTitle}</h2>
      {Object.keys(groupedShowtimes).length > 0 ? (
        Object.entries(groupedShowtimes).map(([theater, shows]) => (
          <div key={theater} style={{ marginBottom: "20px" }}>
            <h3>{theater}</h3>
            <ul className="showtimes-list">
              {shows.map((show, index) => (
                <li key={index}>
                  <div className="show-details">
                    <p>Time: {new Date(show.time).toLocaleString()}</p>
                    <p>Price: ₹{show.price}</p>
                    <p>
                      Seats Available:{" "}
                      {show.seats.flat().filter((seat) => !seat).length}
                    </p>
                  </div>
                  <button
                    className="book-button"
                    onClick={() => handleBookNow(theater, show.time)}
                  >
                    Book Now
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No showtimes available for this movie.</p>
      )}
    </div>
  );
};

export default Showtimes;
