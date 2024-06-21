import React from "react";
import "./verify-otp-man-ki-baat_component.css";

export function VerifyOTPManKiBaatComponent() {
  return (
    <>
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
          <div className="col d-flex m-auto justify-content-center">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder=""
                style={{ width: "35px" }}
              ></input>
            </div>
            <div className="form-group ms-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                style={{ width: "35px" }}
              ></input>
            </div>
            <div className="form-group ms-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                style={{ width: "35px" }}
              ></input>
            </div>
            <div className="form-group ms-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                style={{ width: "35px" }}
              ></input>
            </div>
          </div>
          <div className="mt-3">
            <button className="verify">Verify</button>
          </div>
        </div>
      </div>
    </>
  );
}
