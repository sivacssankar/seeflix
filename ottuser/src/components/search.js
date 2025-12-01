import React from "react";
import Navbar from "./navbar";

function Search() {
  return (
    <div>
    
      <div className="container py-5 d-flex justify-content-end">
        <input
          type="text"
          className="form-control d-inline-block me-2" 
          style={{ width: '200px', display: 'inline-block' }}
          placeholder="Search..."
        />
        <button className="btn btn-primary">Search</button>
      </div>
    </div>
  );
}

export default Search;