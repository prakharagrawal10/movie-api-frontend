# Movie Reservation System Frontend

Link = https://movie-api-frontend.vercel.app/

This is the frontend for the Movie Reservation System, built using React. The application allows users to browse movies, select showtimes, choose seats, and complete bookings.

## Project Structure

```
frontend
├── public
│   ├── index.html          # Main HTML file for the React application
│   └── favicon.ico         # Favicon for the application
├── src
│   ├── components          # Contains React components for the application
│   │   ├── MovieList.js    # Component to display a list of movies
│   │   ├── MovieDetail.js   # Component to show details of a selected movie
│   │   ├── SeatSelection.js  # Component for selecting seats
│   │   ├── BookingForm.js    # Component for handling the booking process
│   │   └── UserDashboard.js   # Component to display user's bookings
│   ├── App.js               # Main App component that sets up routing
│   ├── index.js             # Entry point of the React application
│   ├── api                  # Contains API interaction functions
│   │   ├── movieApi.js      # Functions for movie-related API calls
│   │   ├── userApi.js       # Functions for user authentication
│   │   └── showtimeApi.js    # Functions for showtime-related API calls
│   └── styles               # Contains CSS styles for the application
│       └── App.css          # Main CSS file for styling the application
├── package.json             # npm configuration file
└── README.md                # Documentation for the project
```

## Features

- User Authentication: Sign up and log in to manage bookings.
- Movie Listing: Browse and search for available movies.
- Movie Details: View detailed information about each movie, including showtimes.
- Seat Selection: Choose seats based on availability for a selected showtime.
- Booking: Complete the booking process and receive confirmation.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Technologies Used

- React: JavaScript library for building user interfaces.
- Axios: Promise-based HTTP client for making API requests.
- React Router: Declarative routing for React applications.
- CSS: Styling for the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.