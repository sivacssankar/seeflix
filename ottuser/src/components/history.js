import Navbar from "./navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function History() {
  const [movies, setMovies] = useState([]); // ✅ should be an array, not string

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in localStorage");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/history/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        console.log("History response:", response.data);
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎬 My History</h2>
        <div className="row">
          {movies.length > 0 ? (
            movies.map((item) => (
              <div className="col-md-4 mb-3" key={item.id}>
                <div
                  className="card h-100 text-center border-0"
                  style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  }}
                >
                  {item.movie?.thumb ? (
                    <img
                      src={`http://127.0.0.1:8000${item.movie.thumb}`} // ✅ correct interpolation
                      className="card-img-top"
                      alt={item.movie?.title || "No title"}
                      style={{
                        height: "450px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <span>No image</span>
                  )}

                  <div className="card-body">
                    <h5 className="card-title">
                      {item.movie?.title || "Untitled"}
                    </h5>
                    {item.movie && (
                      <Link
                        to={`/movie/${item.movie.id}`}
                        className="btn btn-outline-primary mt-2"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted mt-5">
              No movies in history yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
