import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./verify-otp-man-ki-baat_component.css";

export function VerifyOTPManKiBaatComponent() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 4) {
      setMessage("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      console.log("User ID from localStorage:", userId);
      if (!userId) {
        setMessage("User ID is missing. Please request a new OTP.");
        return;
      }

      const response = await axios.post("http://localhost:3001/verify_otp", {
        user_id: userId,
        otp: otpValue,
      });

      setMessage(response.data.MSG);
      if (response.data.status) {
        alert("OTP Verified Successfully!");
        navigate("/set-password");
      } else {
        alert(response.data.MSG);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.MSG) {
        setMessage(error.response.data.MSG);
      } else {
        setMessage("An error occurred. Please try again!");
      }
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        background: "linear-gradient(-135deg,blue,pink)",
        borderRadius: "30px",
        boxShadow: "0 0 8px rgb(145, 144, 146)",
        padding: "20px",
        color: "#ffffff",
        width: "200px",
        textAlign: "center",
      }}
    >
      <h3 style={{ fontFamily: "fantasy", textShadow: "3px 2px 3px blue" }}>
        Verify OTP
      </h3>
      <div className="row">
        <div className="col d-flex">
          {otp.map((data, index) => (
            <div className="form-group m-auto" key={index}>
              <input
                type="text"
                className="form-control"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                maxLength="1"
                style={{
                  width: "35px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button className="verify" onClick={handleVerify}>
            Verify
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
