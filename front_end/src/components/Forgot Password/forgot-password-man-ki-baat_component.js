import React from "react";
import "./forget-password-man-ki-baat_component.css";

export function ForgetPasswordMankiBaatComponent() {
  return (
    <>
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
        <h1 className="text-center" style={{ fontFamily: "fantasy" }}>
          Please Enter Your E-mail Address
        </h1>
        <div className="row">
          <div className="col-md-6"></div>
          <div className="form-group">
            <label
              className="d-flex m-auto justify-content-center"
              style={{ fontFamily: "fantasy", fontWeight: "" }}
            >
              E-mail:
            </label>
            <input
              type="text"
              className="form-control w-50 d-flex m-auto justify-content-center"
              placeholder="Enter Your E-mail"
              style={{ fontFamily: "fantasy" }}
            ></input>
          </div>
          <div className="mt-3 d-flex m-auto justify-content-center">
            <button className="otp">Send OTP</button>
          </div>
        </div>
      </div>
    </>
  );
}
