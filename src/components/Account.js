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
          {seat.map((booking, index) => {
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
      )}
    </div>
  );
};

export default Account;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Account.css";


// const Account = () => {
//   const [user, setUser] = useState(null);
//   const [seat, setSeat] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No authentication token found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           "http://localhost:5000/api/user/profile",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         // console.log("Profile Data:", response.data);
//         setUser(response.data);
//       } catch (err) {
//         console.error("Profile Error:", err);
//         setError(err.response?.data?.error || "Failed to fetch profile");
//       }
//     };

//     const fetchSeats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No authentication token found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           "http://localhost:5000/api/user/account",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // console.log("Seats Data:", response.data);
//         setSeat(response.data.reservations || []);
//       } catch (err) {
//         console.error("Seats Error:", err);
//         setError(err.response?.data?.error || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//     fetchSeats();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;
//   if (!user) return <p>User data not available.</p>;

//   return (
//     <div className="account-container">
//       <h2>Account Details</h2>
//       <p>
//         <strong>Name:</strong> {user.name || "N/A"}
//       </p>
//       <p>
//         <strong>Email:</strong> {user.email || "N/A"}
//       </p>
//       <p>
//         <strong>Account Created:</strong>{" "}
//         {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
//       </p>

//       <h3>Bookings</h3>
//       {seat.length > 0 ? (
//         <ul>
//           {seat.map((booking, index) => {
//             const movieName = booking?.showtimeTitle || "Not Available";
//             const theaterName = booking?.theaterName || "Not Available";
//             const date = booking?.createdAt
//               ? new Date(booking.createdAt).toLocaleDateString()
//               : "Not Available";
//             const seatNumbers = Array.isArray(booking.seats)
//               ? booking.seats.flat().join(", ")
//               : "Not Available";
//             const totalPrice = booking?.totalPrice || "N/A";

//             return (
//               <li key={index}>
//                 <p><strong>Movie:</strong> {movieName}</p>
//                 <p><strong>Theater:</strong> {theaterName}</p>
//                 <p><strong>Date:</strong> {date}</p>
//                 <p><strong>Seats:</strong> {seatNumbers}</p>
//                 <p><strong>Total Price:</strong> ₹{totalPrice}</p>
//                 {/* {qrCode && <img src={qrCode} alt="QR Code" width="150" />} */}
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <p>No bookings found</p>
//       )}
//     </div>
//   );
// };

// export default Account;













// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Account.css";

// const Account = () => {
//   const [user, setUser] = useState(null);
//   const [seat, setSeat] = useState([]);
//   const [qrCodes, setQrCodes] = useState({}); // Store QR codes separately
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No authentication token found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           "http://localhost:5000/api/user/profile",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setUser(response.data);
//       } catch (err) {
//         console.error("Profile Error:", err);
//         setError(err.response?.data?.error || "Failed to fetch profile");
//       }
//     };

//     const fetchSeats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No authentication token found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           "http://localhost:5000/api/user/account",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const reservations = response.data.reservations || [];
//         setSeat(reservations);

//         // Fetch QR codes for each reservation
//         reservations.forEach((booking) => {
//           fetchQrCode(booking._id); // Call function to fetch QR code
//         });
//       } catch (err) {
//         console.error("Seats Error:", err);
//         setError(err.response?.data?.error || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//     fetchSeats();
//   }, []);

//   // Function to fetch QR code for a specific ticket ID
//   const fetchQrCode = async (ticketId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/tickets/qr/${ticketId}`
//       );

//       setQrCodes((prevQrCodes) => ({
//         ...prevQrCodes,
//         [ticketId]: response.data.qrCode, // Store QR code against the ticket ID
//       }));
//     } catch (error) {
//       console.error(`Error fetching QR code for ticket ${ticketId}:`, error);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;
//   if (!user) return <p>User data not available.</p>;

//   return (
//     <div className="account-container">
//       <h2>Account Details</h2>
//       <p><strong>Name:</strong> {user.name || "N/A"}</p>
//       <p><strong>Email:</strong> {user.email || "N/A"}</p>
//       <p><strong>Account Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>

//       <h3>Bookings</h3>
//       {seat.length > 0 ? (
//         <ul>
//           {seat.map((booking, index) => {
//             const movieName = booking?.showtimeTitle || "Not Available";
//             const theaterName = booking?.theaterName || "Not Available";
//             const date = booking?.createdAt
//               ? new Date(booking.createdAt).toLocaleDateString()
//               : "Not Available";
//             const seatNumbers = Array.isArray(booking.seats)
//               ? booking.seats.flat().join(", ")
//               : "Not Available";
//             const totalPrice = booking?.totalPrice || "N/A";
//             const qrCode = qrCodes[booking._id]; // Get QR code for this booking

//             return (
//               <li key={index}>
//                 <p><strong>Movie:</strong> {movieName}</p>
//                 <p><strong>Theater:</strong> {theaterName}</p>
//                 <p><strong>Date:</strong> {date}</p>
//                 <p><strong>Seats:</strong> {seatNumbers}</p>
//                 <p><strong>Total Price:</strong> ₹{totalPrice}</p>
//                 {qrCode ? <img src={qrCode} alt="QR Code" width="150" /> : <p>Loading QR...</p>}
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <p>No bookings found</p>
//       )}
//     </div>
//   );
// };

// export default Account;
