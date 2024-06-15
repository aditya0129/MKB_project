import React from "react";
import "./set-password-man-ki-baat_component.css";

export function SetPasswordManKiBaatComponent() {
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
        <h1 className="text-center p-2" style={{ fontFamily: "fantasy" }}>
          Update Your Password
        </h1>
        <div className="row">
          <div className="col">
            <div className="form-group mb-3">
              <label
                className="d-flex m-auto justify-content-center"
                style={{ fontFamily: "fantasy", fontWeight: "" }}
              >
                Set New Password:
              </label>
              <input
                type="text"
                className="form-control w-50 d-flex m-auto justify-content-center"
                placeholder="Set Your New Password"
                style={{ fontFamily: "fantasy" }}
              ></input>
            </div>
            <div className="form-group">
              <label
                className="d-flex m-auto justify-content-center"
                style={{ fontFamily: "fantasy", fontWeight: "" }}
              >
                Re-Enter Password:
              </label>
              <input
                type="text"
                className="form-control w-50 d-flex m-auto justify-content-center"
                placeholder="Re-Enter Your Password"
                style={{ fontFamily: "fantasy" }}
              ></input>
            </div>
            <div className="mt-3 d-flex m-auto justify-content-center">
              <button className="otp mb-2">Update</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
