import React from "react";
import "./invalid-man-ki-baat_component.css";
import { Link } from "react-router-dom";

export function InvalidManKiBaatComponent() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div
              className="text-white mt-5"
              style={{
                background: "linear-gradient(-135deg,blue,pink)",
                width: "350px",
                padding: "20px",
                borderRadius: "30px",
                margin: "auto",
                textAlign: "center",
                boxShadow: "0 0 8px rgb(145, 144, 146)",
              }}
            >
              <h3 style={{ fontFamily: "fantasy" }}>
                Invalid Email / Password
              </h3>
              <div className="">
                <Link
                  to="/register-case"
                  className="text-white"
                  style={{ fontFamily: "fantasy" }}
                >
                  Try again
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
