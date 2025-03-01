import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Showtimes from "./components/Showtimes";

import SeatMap from "./components/SeatMap.js";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import Account from "./components/Account";
import CheckEmail from "./components/CheckEmail.js";



import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/showtimes/:movieTitle" element={<Showtimes />} />
          <Route
            path="/seats/:movieTitle/:theater/:time"
            element={<SeatMap />}
          />
          <Route path="/account" element={<Account />} />
          <Route path="/check-email" element={<CheckEmail />} />
          {/* <Route
            path="/seat-selection/:showtimeId"
            element={<SeatSelection />}
          />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/dashboard" element={<UserDashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
