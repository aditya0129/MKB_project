// import React, { useState, useEffect } from "react";
// import "./wallet-man-ki-baat_component.css";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

// export function WalletManKiBaatComponent({ amount }) {
//   const [wallet, setWallet] = useState([]);

//   useEffect(() => {
//     async function fetchWallet() {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("Token:", token);
//         const response = await axios.get(`http://localhost:3001/wallet`, {
//           headers: {
//             "x-auth-token": token,
//           },
//         });
//         console.log("Response:", response);
//         if (response.data.status) {
//           setWallet([response.data.data]);
//         } else {
//           console.error("Failed to fetch wallet data:", response.data.msg);
//         }
//       } catch (error) {
//         console.error("Error fetching wallet data:", error);
//       }
//     }

//     fetchWallet();
//   }, []);

//   const redirectToRazorPay = () => {
//     window.location.href =
//       "https://razorpay.com/payment-link/plink_OiMAfSuTfm8XKS/test";
//   };

//   return (
//     <>
//       <div className="container m-auto d-flex justify-content-center">
//         <div className="row">
//           <div className="col mt-5">
//             <div className="bg-dark text-white p-4 rounded-4">
//               <h4>
//                 Cash Balance{" "}
//                 <span className="fs-6 ms-5">
//                   Account{" "}
//                   <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
//                 </span>
//               </h4>
//               {wallet.map((balance, index) => (
//                 <h1 className="mt-3">₹ {balance.walletBalance}/-</h1>
//               ))}
//               <button
//                 className="p-3 fs-5 rounded-pill bg-dark text-white mt-4"
//                 onClick={redirectToRazorPay}
//               >
//                 Add Cash
//               </button>
//               <button className="p-3 fs-5 rounded-pill bg-dark text-white mt-4 ms-5">
//                 Cash Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import "./wallet-man-ki-baat_component.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export function WalletManKiBaatComponent({ amount }) {
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

  const checkoutHandler = async (amount) => {
    try {
      const {
        data: { key },
      } = await axios.get("http://localhost:3001/getkey");

      const {
        data: { order },
      } = await axios.post("http://localhost:3001/checkout", {
        amount,
      });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "M.K.B",
        description: "RazorPay Payment",
        image: "http://localhost:3001/images/1723453472893-20627014_1920110458255767_1308681765579609352_o.jpg",
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
          color: "#121212",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during the payment process:", error);
    }
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
                <h1 className="mt-3" key={index}>
                  ₹ {balance.walletBalance}/-
                </h1>
              ))}
              <button
                className="p-3 fs-5 rounded-pill bg-dark text-white mt-4"
                onClick={() => checkoutHandler(amount)}
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
