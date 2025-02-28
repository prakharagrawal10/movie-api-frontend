import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/movie/get-all`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching movies: ' + error.message);
        }
    };

    useEffect(() => {
        const getMovies = async () => {
            try {
                const data = await fetchMovies();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Movie List</h2>
            <ul>
                {movies.map(movie => (
                    <li key={movie._id}>
                        <h3>{movie.title}</h3>
                        <p>Genre: {movie.genre.join(', ')}</p>
                        <p>Duration: {movie.duration} minutes</p>
                        <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                        <button onClick={() => navigate(`/showtimes/${encodeURIComponent(movie.title)}`)}>
                            View Theatres
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieList;
