import Navbar from "./navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Watchlist() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 3;

  useEffect(() => {
    const storedUser = localStorage.getItem("userid");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      fetchMovies(storedUser, storedToken);
    } else {
      console.error("User or token not found. Please log in.");
    }
  }, []);

  const fetchMovies = (storedUser, storedToken) => {
    axios
      .get(`http://localhost:8000/viewwatchlist/?iv=${storedUser}`, {
        headers: { Authorization: "Token " + storedToken },
      })
      .then((response) => setMovies(response.data))
      .catch((error) => console.error("Error fetching movies:", error));
  };

  const deleteWatchlist = (movieid) => {
    if (!user || !token) return;

    axios
      .delete("http://localhost:8000/delete/", {
        data: { uid: user, mid:movieid },
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
        alert(response.data.message);
        fetchMovies(user, token);
      })
      .catch((error) => {
        console.error("Error deleting movie:", error);
        alert("Failed to remove movie from watchlist");
      });
  };

  // ✅ Pagination Logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎬 My Watchlist</h2>
        <div className="row">
          {currentMovies.length > 0 ? (
            currentMovies.map((movie) => (
              <div className="col-md-4 mb-3" key={movie.id}>
                <div
                  className="card h-100 text-center border-0"
                  style={{ backgroundColor: "transparent", boxShadow: "none" }}
                >
                  {movie.movie.thumb ? (
                    <img
                      src={`http://localhost:8000${movie.movie.thumb}`}
                      className="card-img-top"
                      alt={movie.movie.title}
                      style={{ height: "450px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  ) : (
                    <span>No image</span>
                  )}

                  <div className="card-body text-center">
                    <h5 className="card-title">{movie.movie.title}</h5>
                    <Link className="btn btn-outline-primary" to={`/movie/${movie.movie.id}`}>
                      Watch Now
                    </Link>
                    &nbsp;
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteWatchlist(movie.movie.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No movies found</p>
          )}
        </div>

        {/* ✅ Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-secondary mx-2"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary mx-2"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;