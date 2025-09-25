import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./advisor-verify-otp-man-ki-baat_component.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

export function AdvisorVerifyOTPManKiBaatComponent() {
  const [Otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 120, // Offset (in px) from the original trigger point
    });
  }, []);

  const handleChange = (element, index) => {
    let newOtp = [...Otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = Otp.join("");
    if (otpValue.length < 4) {
      setMessage("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      const advisorId = localStorage.getItem("advisor_id");
      console.log("Advisor ID from localStorage:", advisorId);
      if (!advisorId) {
        setMessage("Advisor ID is missing. Please request a new OTP.");
        return;
      }

      const response = await axios.post(
        "/backend/advisor_verify_otp",
        {
          advisor_id: advisorId,
          Otp: otpValue,
        }
      );

      setMessage(response.data.MSG);
      if (response.data.status) {
        alert("OTP Verified Successfully!");
        navigate("/advisor-set-password");
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
      <h3
        style={{ fontFamily: "fantasy", textShadow: "3px 2px 3px blue" }}
        data-aos="zoom-in"
      >
        Verify OTP
      </h3>
      <div className="row">
        <div className="col d-flex">
          {Otp.map((data, index) => (
            <div
              className="form-group m-auto"
              key={index}
              data-aos="zoom-in"
              data-aos-delay="100"
            >
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
        <div className="mt-3" data-aos="zoom-in" data-aos-delay="200">
          <button className="verify" onClick={handleVerify}>
            Verify
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
