import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieList.css';

const API_URL = process.env.REACT_APP_API_URL;

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/movie/get-all`);
                setMovies(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="movie-list-container">
            <h2>Movie List</h2>
            <div className="movie-grid">
                {movies.map(movie => (
                    <div key={movie._id} className="movie-card">
                        <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                        <div className="movie-details">
                            <h3 className="movie-title">{movie.title}</h3>
                            <p className="movie-info"><strong>Genre:</strong> {movie.genre.join(', ')}</p>
                            <p className="movie-info"><strong>Duration:</strong> {movie.duration} min</p>
                            <p className="movie-info"><strong>Release:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                            
                            {/* New Fields */}
                            <p className="movie-info"><strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}/10</p>
                            <p className="movie-info"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                            <p className="movie-info"><strong>Director:</strong> {movie.director}</p>

                            <button className="view-theatres-btn" onClick={() => navigate(`/showtimes/${encodeURIComponent(movie.title)}`)}>
                                View Theatres
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;
