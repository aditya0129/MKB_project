import React, { useEffect } from "react";
import "./invalid-man-ki-baat_component.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadTear } from "@fortawesome/free-solid-svg-icons";

export function InvalidManKiBaatComponent() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 120, // Offset (in px) from the original trigger point
    });
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <FontAwesomeIcon
              icon={faFaceSadTear}
              className="m-auto d-flex mt-5 text-danger"
              style={{
                fontSize: "130px",
                boxShadow: "0 0 10px rgb(145, 144, 146)",
                borderRadius: "65px",
              }}
              data-aos="zoom-in"
            />
            <div
              className="text-white mt-5"
              style={{
                background: "linear-gradient(-135deg,blue,pink)",
                width: "450px",
                padding: "20px",
                borderRadius: "20px",
                margin: "auto",
                textAlign: "center",
                boxShadow: "0 0 8px rgb(145, 144, 146)",
              }}
            >
              <h1
                style={{ fontFamily: "fantasy" }}
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                Invalid Email / Password
              </h1>
              <div className="" data-aos="zoom-in" data-aos-delay="200">
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
