import React from "react";
import "./invalid-man-ki-baat_component.css";
import { Link } from "react-router-dom";

export function InvalidManKiBaatComponent() {
  return (
    <>
      <div id="ground">
        <div className="container">
          <div className="row">
            <div className="col">
              <div
                className="text-danger mt-5"
                style={{
                  background: "#28292d",
                  width: "350px",
                  padding: "20px",
                  borderRadius: "20px",
                  margin: "auto",
                  textAlign: "center",
                  border: "2px solid #1c1c1c"
                }}
              >
                <h3 style={{ fontFamily: "Arial" }}>
                  Invalid Email / Password
                </h3>
                <div className="ms-3">
                  <Link to="/register-case">Try again</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
