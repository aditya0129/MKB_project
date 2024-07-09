import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./forget-password-man-ki-baat_component.css";

export function ForgetPasswordMankiBaatComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setOtpSent(false);
      setTimer(60);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = async () => {
    if (!email) {
      setMessage("Please mention your E-mail address!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/send_otp", {
        email,
      });
      setMessage(response.data.msg);
      if (response.data.status && response.data.user_id) {
        console.log("User ID from response:", response.data.user_id);
        localStorage.setItem("user_id", response.data.user_id);
        if (response.data.msg.includes("Please try after some time!")) {
          setOtpSent(true);
        } else {
          setOtpSent(true);
          alert(
            "Verification OTP has been sent to your E-mail address, please check!"
          );
          navigate("/verify-otp");
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.MSG) {
        setMessage(error.response.data.MSG);
      } else {
        setMessage("E-mail is not correct. Please try again!");
      }
    }
  };

  return (
    <div
      className="container mt-5 w-50"
      style={{
        background: "linear-gradient(-135deg, blue, pink)",
        borderRadius: "30px",
        boxShadow: "0 0 8px rgb(145, 144, 146)",
        padding: "20px",
        color: "#ffffff",
      }}
    >
      <h1
        className="text-center"
        style={{ fontFamily: "fantasy", textShadow: "3px 2px 3px blue" }}
      >
        Please Enter Your E-mail Address
      </h1>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label
              className="d-flex m-auto justify-content-center"
              style={{ fontFamily: "fantasy" }}
            >
              E-mail:
            </label>
            <input
              type="email"
              className="form-control w-50 d-flex m-auto justify-content-center"
              placeholder="Enter Your E-mail"
              value={email}
              onChange={handleChange}
              style={{ fontFamily: "fantasy" }}
              required
            ></input>
          </div>
          <div className="mt-3 d-flex m-auto justify-content-center">
            <button onClick={handleClick} className="otp" disabled={otpSent}>
              {otpSent ? `Wait ${timer}s` : "Send OTP"}
            </button>
          </div>
          {message && (
            <div className="mt-3 text-center" style={{ fontFamily: "fantasy" }}>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
