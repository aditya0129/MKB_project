import React from "react";
import "./PaymentSuccess.css";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faHouseUser } from "@fortawesome/free-solid-svg-icons";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const seachQuery = useSearchParams()[0];
  const referenceNum = seachQuery.get("reference");

  function handleHomeClick() {
    navigate("/");
  }
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex m-auto justify-content-center mb-4">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="fs-1 text-success"
              />
            </div>
            <h1 className="text-success text-uppercase">Payment Successful</h1>
            <p className="fw-semibold text-center">
              Reference No. {referenceNum}
            </p>
            <div className="d-flex m-auto justify-content-center fs-2 text-success">
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
            <span className="d-flex justify-content-center fw-semibold mt-2">
              Back To Home
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
