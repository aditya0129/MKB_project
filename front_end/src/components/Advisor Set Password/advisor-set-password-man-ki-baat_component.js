import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./advisor-set-password-man-ki-baat_component.css";

export function AdvisorSetPasswordManKiBaatComponent() {
  const [Password, setPassword] = useState("");
  const [passwords, setPasswords] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [useErrors, setUseErrors] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const handleUpdateClick = async () => {
    // Check if the input fields are empty
    if (!Password || !rePassword) {
      setMessage("Please fill the input field for update.");
      return;
    }

    // Check if the passwords match
    if (Password !== rePassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // Retrieve user_id from localStorage
      const advisorId = localStorage.getItem("advisor_id");
      if (!advisorId) {
        setMessage("Advisor ID is missing. Please log in again.");
        return;
      }

      // Send a POST request to update the password
      const response = await axios.post(
        `http://localhost:3001/AdvisorUpdatePassword/${advisorId}`, // Pass user_id in the URL params
        {
          newPassword: Password, // Send new password
          reEnterPassword: rePassword, // Send re-entered password
        }
      );

      // Handle the backend response
      setMessage(response.data.msg); // Set the message from the backend response
      if (response.data.status) {
        alert("Password Updated Successfully!");
        navigate("/login"); // Redirect to login page after successful password update
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data && error.response.data.msg) {
        setMessage(error.response.data.msg);
      } else {
        setMessage("An error occurred. Please try again!");
      }
    }
  };

  // Regular expression for password validation
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;

  // Password validation function using onKeyUp
  const handlePasswordKeyUp = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check if the password is empty
    if (newPassword === "") {
      setUseErrors(""); // Clear the message if the input is cleared
    }
    // Check if the password matches the regex pattern
    else if (!passwordRegex.test(newPassword)) {
      setUseErrors(
        "Password 8 to 15 Chars With Uppercase Letter, Special Character & Number"
      );
    } else {
      setUseErrors(""); // Clear the message if the password is valid
    }
  };

  // Regular expression for password validation
  const PasswordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;

  // Password validation function using onKeyUp
  const HandlePasswordKeyUp = (e) => {
    const newPassword = e.target.value;
    setPasswords(newPassword);

    // Check if the password is empty
    if (newPassword === "") {
      setErrors(""); // Clear the message if the input is cleared
    }
    // Check if the password matches the regex pattern
    else if (!PasswordRegex.test(newPassword)) {
      setErrors(
        "Password 8 to 15 Chars With Uppercase Letter, Special Character & Number"
      );
    } else {
      setErrors(""); // Clear the message if the password is valid
    }
  };

  return (
    <div
      className="container mt-5 w-50"
      style={{
        background: "linear-gradient(-135deg,blue,pink)",
        borderRadius: "30px",
        boxShadow: "0 0 8px rgb(145, 144, 146)",
        padding: "20px",
        color: "#ffffff",
      }}
    >
      <h1
        className="text-center p-2"
        style={{ fontFamily: "fantasy", textShadow: "3px 2px 3px blue" }}
      >
        Update Your Password
      </h1>
      <div className="row">
        <div className="col">
          <div className="form-group mb-3">
            <label
              className="d-flex m-auto justify-content-center"
              style={{ fontFamily: "fantasy" }}
            >
              Set New Password:
            </label>
            <input
              type="password"
              className="form-control w-50 d-flex m-auto justify-content-center"
              placeholder="Set Your New Password"
              style={{ fontFamily: "fantasy" }}
              value={Password}
              onChange={handlePasswordChange}
              onKeyUp={handlePasswordKeyUp}
              required
            />
            {useErrors && (
              <div className="text-white text-center">{useErrors}</div>
            )}
          </div>
          <div className="form-group">
            <label
              className="d-flex m-auto justify-content-center"
              style={{ fontFamily: "fantasy" }}
            >
              Re-Enter Password:
            </label>
            <input
              type="password"
              className="form-control w-50 d-flex m-auto justify-content-center"
              placeholder="Re-Enter Your Password"
              style={{ fontFamily: "fantasy" }}
              value={rePassword}
              onChange={handleRePasswordChange}
              onKeyUp={HandlePasswordKeyUp}
              required
            />
            {errors && <div className="text-white text-center">{errors}</div>}
          </div>
          <div className="mt-3 d-flex m-auto justify-content-center">
            <button onClick={handleUpdateClick} className="otp mb-2">
              Update
            </button>
          </div>
          {message && (
            <p className="mt-3 text-center" style={{ color: "#ffffff" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
