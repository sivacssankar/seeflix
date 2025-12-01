import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Search from "./search";
import axios from "axios";
import { Link } from "react-router-dom";

function Homepage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/homepage", {
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  // ✅ function to add movie to history
const handleAddHistory = (movieId) => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userid");

    if (!token || !userid) {
      alert("Please login first!");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/gg",
        { uid:userid, mid: movieId },
        { headers: { Authorization: "Token " + token } }
      )
      // .then((res) => alert(res.data.message || "Added to history!"))
      // .catch((err) => {
      //   console.error("Error adding to history:", err);
      //   alert("Failed to add to history!");
      // });



      
  };

  return (
    <>
      <Navbar />
      <Search />

      <div className="container mt-4">
        <h3>🎬 Movies</h3>

        <div className="d-flex flex-wrap">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="card m-2 shadow-sm"
                style={{ width: "180px" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "220px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f5f5f5",
                  }}
                >
                  {movie.thumb ? (
                    <img
                      src={`http://127.0.0.1:8000${movie.thumb}`}
                      alt={movie.title}
                      className="img-fluid"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <div className="card-body p-2 text-center">
                  <h6 className="card-title text-truncate">{movie.title}</h6>

                  {/* ✅ Add to history on click */}
                  <Link
                    to={`/movie/${movie.id}`}
                    onClick={() => handleAddHistory(movie.id)}
                    className="btn btn-sm btn-primary mt-2 w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No movies available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Homepage;
