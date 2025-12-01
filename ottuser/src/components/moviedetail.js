import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [msg,setMessage]=useState("");
  const userid1=localStorage.getItem("userid");
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("No token found in localStorage");
      return;
    }

    // Fetch movie details

    axios
      .get(`http://127.0.0.1:8000/detail/${id}`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }, [id]);

const watchlater=()=>{
  const token=localStorage.getItem("token")

//  axios.get(`http://127.0.0.1:8000/watchlist${mid}${uid}`,{headers:{Authorization:`Token ${token}`},})


   axios
      .post(
        "http://127.0.0.1:8000/watchlist",
        {
          uid: userid1,
          mid: movie.id,

        },{ headers: { Authorization: `Token ${token}` } }
      )
      .then((response) => {
        setMessage("Added to Watch Later ✅");
      })
      .catch((error) => {
        console.error("Error adding to watch later:", error);
        setMessage("Failed to add. Try again ❌");
      });

    }


  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        {movie ? (
          <div>
            {/* Video Player */}
            {movie.video ? (
              <div className="mb-4 text-center">
                <video
                  controls
                  className="w-100 rounded shadow"
                  style={{ maxHeight: "500px" }}
                >
                  <source
                    src={`http://127.0.0.1:8000${movie.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p className="text-center text-muted">No video available</p>
            )}

            {/* Movie Info */}
            <div className="text-center mb-4">
              <h2 className="fw-bold">{movie.title}</h2>
              <p className="text-muted">{movie.desc}</p>
            </div>

            {/* Thumbnail */}
            {movie.thumb && (
              <div className="text-center">
                <img
                  src={`http://127.0.0.1:8000${movie.thumb}`}
                  alt={movie.title}
                  className="rounded shadow"
                  style={{ maxWidth: "400px" }}
                />
              </div>
            )}
   {/* watch list button */}
              <div>          
<button className="btn btn-primary px-4 py-2 fw-semibold" onClick={watchlater}>watch later</button>
                </div>
          </div>
        ) : (
          <p className="text-center text-muted">Loading movie details...</p>
        )}
      </div>
    </div>
  );
}

export default Details;
