import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import Navbar from "./navbar";
import axios from "axios";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userid");

    if (!token || !userid) {
      alert("Please login first!");
      return;
    }

    axios
      .put(
        "http://127.0.0.1:8000/changepass",
        {
          id: userid,        // confirm backend expects 'id'
          newpassword: newPassword // confirm backend expects 'newpassword'
        },
        { headers: { Authorization: "Token " + token } }
      )
      .then((res) => {
        alert(res.data.message || "Password changed successfully!");
        // ✅ remove user token and navigate to login
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        navigate("/login"); 
      })
      .catch((err) => {
        console.error("Error changing password:", err);
        alert(err.response?.data?.message || "Failed to change password.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <div className="card shadow-sm p-4">
          <h3 className="text-center mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;