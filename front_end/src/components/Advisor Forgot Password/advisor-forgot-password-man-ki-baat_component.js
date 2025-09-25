import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./advisor-forgot-password-man-ki-baat_component.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

export function AdvisorForgetPasswordMankiBaatComponent() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 120, // Offset (in px) from the original trigger point
    });
  }, []);

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
    if (!Email) {
      setMessage("Please mention your E-mail address!");
      return;
    }
    try {
      const response = await axios.post(
        "/backend/advisor_send_otp",
        {
          Email,
        }
      );
      setMessage(response.data.msg);
      if (response.data.status && response.data.advisor_id) {
        console.log("Advisor ID from response:", response.data.advisor_id);
        localStorage.setItem("advisor_id", response.data.advisor_id);
        if (response.data.msg.includes("Please try after some time!")) {
          setOtpSent(true);
        } else {
          setOtpSent(true);
          alert(
            "Verification OTP Has Been Sent To Your E-mail Address, Please Check!"
          );
          navigate("/advisor-verify-otp");
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
        data-aos="zoom-in"
      >
        Please Enter Your E-mail Address
      </h1>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label
              className="d-flex m-auto justify-content-center"
              style={{ fontFamily: "fantasy" }}
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              E-mail:
            </label>
            <input
              type="email"
              className="form-control w-50 d-flex m-auto justify-content-center"
              placeholder="Enter Your E-mail"
              value={Email}
              onChange={handleChange}
              style={{ fontFamily: "fantasy" }}
              required
              data-aos="zoom-in"
              data-aos-delay="200"
            ></input>
          </div>
          <div
            className="mt-3 d-flex m-auto justify-content-center"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
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
