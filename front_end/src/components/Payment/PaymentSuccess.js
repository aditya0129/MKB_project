import React from "react";
import "./PaymentSuccess.css";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export function PaymentSuccess() {
  const seachQuery = useSearchParams()[0];
  const referenceNum = seachQuery.get("reference");
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
          </div>
        </div>
      </div>
    </>
  );
}
