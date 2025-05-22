import React, { useEffect } from "react";
import "./PaymentSuccess.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faHouseUser } from "@fortawesome/free-solid-svg-icons";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const seachQuery = useSearchParams()[0];
  const referenceNum = seachQuery.get("reference");

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 120, // Offset (in px) from the original trigger point
    });
  }, []);

  function handleHomeClick() {
    navigate("/");
  }
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row">
          <div className="col-md-12">
            <div
              className="d-flex m-auto justify-content-center mb-4"
              data-aos="zoom-in"
            >
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="fs-1 text-success"
              />
            </div>
            <h1
              className="text-success text-uppercase"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              Payment Successful
            </h1>
            <p
              className="fw-semibold text-center"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Reference No. {referenceNum}
            </p>
            <div
              className="d-flex m-auto justify-content-center fs-2 text-success"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <FontAwesomeIcon
                icon={faHouseUser}
                className="mt-5"
                onClick={handleHomeClick}
                style={{
                  cursor: "pointer",
                  border: "3px solid #198754",
                  padding: "10px",
                  borderRadius: "50px",
                }}
              />
            </div>
            <span
              className="d-flex justify-content-center fw-semibold mt-2"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              Back To Home
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
