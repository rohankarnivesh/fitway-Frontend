import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./User.scss";
import UserComponent from "./UserComponent";
import Navbar from "../Navbar/Navbar";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
  });
  const [isNewUser, setIsNewUser] = useState(location.state && location.state.isNewUser);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/api/logout", { method: "POST" });
      navigate("/");
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    return isNaN(bmi) ? "" : bmi;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const authToken = location.state.token;

    if (!authToken) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/fitnessform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
          workoutType: "YourWorkoutTypeHere", // Provide the actual workoutType value
        }),
      });

      if (response.ok) {
        alert("Successfully submitted");
        // Update the state to reflect that the user has submitted the form
        setIsNewUser(false);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error("API Error: " + error);
    }
  };

  return (
    <div>
      {!isNewUser && (
        <>
          <Navbar hasFitnessData={true} />
          <div>
            <UserComponent />
          </div>
        </>
      )}

      {/* Conditionally render the form based on whether the user is newly registered */}
      {isNewUser && (
        <div className="form">
          <h1>Tell us more about yourself</h1>
          <form onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <label className="input-label">
                Height:
                <input
                  type="number"
                  min="0"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </label>
              <label>
                Weight:
                <input
                  type="number"
                  min="0"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </label>
              <label>
                BMI:
                <input
                  type="text"
                  value={calculateBMI(formData.height, formData.weight)}
                  disabled
                />
              </label>
              <button type="submit" disabled={!formData.weight || !formData.height || !formData.age}>Submit</button>

            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default User;
