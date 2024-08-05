import React from "react";
import "./wallet-man-ki-baat_component.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export function WalletManKiBaatComponent() {
  return (
    <>
      <div className="container m-auto d-flex justify-content-center">
        <div className="row">
          <div className="col mt-5">
            <div className="bg-dark text-white p-4 rounded-4">
              <h4>
                Cash Balance{" "}
                <span className="fs-6 ms-5">
                  Account{" "}
                  <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                </span>
              </h4>
              <h1 className="mt-3">0 INR</h1>
              <button className="p-3 fs-5 rounded-pill bg-dark text-white mt-4">
                Add Cash
              </button>
              <button className="p-3 fs-5 rounded-pill bg-dark text-white mt-4 ms-5">
                Cash Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
