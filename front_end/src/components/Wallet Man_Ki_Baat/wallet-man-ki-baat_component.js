import React, { useState, useEffect } from "react";
import "./wallet-man-ki-baat_component.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCoins } from "@fortawesome/free-solid-svg-icons";

export function WalletManKiBaatComponent() {
  const [user, setUser] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(
          `http://localhost:3001/get_user/profile`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log("Response:", response);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/wallet`, {
          headers: {
            "x-auth-token": token,
          },
        });
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

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in. Please log in to proceed.");
      return;
    }

    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    try {
      // Fetch the Razorpay key from the backend
      const {
        data: { key },
      } = await axios.get("http://localhost:3001/getkey", {
        headers: {
          "x-auth-token": token, // Add the token to headers
        },
      });

      // Create an order on the backend
      const {
        data: { order },
      } = await axios.post(
        "http://localhost:3001/checkout",
        { amount }, // Include the amount in the request body
        {
          headers: {
            "x-auth-token": token, // Add the token to headers
          },
        }
      );

      // Configure Razorpay payment options
      const options = {
        key,
        amount: order.amount, // Amount in paise
        currency: "INR",
        name: "M.K.B",
        description: "RazorPay Payment",
        image:
          "http://localhost:3001/images/1723453472893-20627014_1920110458255767_1308681765579609352_o.jpg",
        order_id: order.id,
        callback_url: "http://localhost:3001/paymentverification",
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc", // Plain color
        },
      };

      // Open Razorpay checkout
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during the payment process:", error);
    }
  };

  return (
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
              <h1 className="mt-3" key={index}>
                ₹ {balance.walletBalance}/-
              </h1>
            ))}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              className="form-control mt-3 fw-semibold rounded-3"
            />
            <button
              className="p-2 fs-5 rounded-4 bg-dark text-white mt-4 w-100"
              onClick={checkoutHandler}
            >
              <FontAwesomeIcon icon={faCoins} className="me-2 fs-5" />
              Add Amount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
