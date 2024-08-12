import React, { useState, useEffect } from "react";
import "./wallet-man-ki-baat_component.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export function WalletManKiBaatComponent() {
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(`http://localhost:3001/wallet`, {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log("Response:", response);
        if (response.data.status) {
          setWallet([response.data.data]);
        } else {
          console.error("Failed to fetch wallet data:", response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWallet();
  }, []);

  const redirectToRazorPay = () => {
    window.location.href =
      "https://razorpay.com/payment-link/plink_OiMAfSuTfm8XKS/test";
  };

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
              {wallet.map((balance, index) => (
                <h1 className="mt-3">₹ {balance.walletBalance}/-</h1>
              ))}
              <button
                className="p-3 fs-5 rounded-pill bg-dark text-white mt-4"
                onClick={redirectToRazorPay}
              >
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
