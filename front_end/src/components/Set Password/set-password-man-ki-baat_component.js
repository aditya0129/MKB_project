// import React from "react";
// import "./set-password-man-ki-baat_component.css";

// export function SetPasswordManKiBaatComponent() {
//   return (
//     <>
//       <div
//         className="container mt-5 w-50"
//         style={{
//           background: "linear-gradient(-135deg,blue,pink)",
//           borderRadius: "30px",
//           boxShadow: "0 0 8px rgb(145, 144, 146)",
//           padding: "20px",
//           color: "#ffffff",
//         }}
//       >
//         <h1
//           className="text-center p-2"
//           style={{ fontFamily: "fantasy", textShadow: "3px 2px 3px blue" }}
//         >
//           Update Your Password
//         </h1>
//         <div className="row">
//           <div className="col">
//             <div className="form-group mb-3">
//               <label
//                 className="d-flex m-auto justify-content-center"
//                 style={{ fontFamily: "fantasy", fontWeight: "" }}
//               >
//                 Set New Password:
//               </label>
//               <input
//                 type="text"
//                 className="form-control w-50 d-flex m-auto justify-content-center"
//                 placeholder="Set Your New Password"
//                 style={{ fontFamily: "fantasy" }}
//               ></input>
//             </div>
//             <div className="form-group">
//               <label
//                 className="d-flex m-auto justify-content-center"
//                 style={{ fontFamily: "fantasy", fontWeight: "" }}
//               >
//                 Re-Enter Password:
//               </label>
//               <input
//                 type="text"
//                 className="form-control w-50 d-flex m-auto justify-content-center"
//                 placeholder="Re-Enter Your Password"
//                 style={{ fontFamily: "fantasy" }}
//               ></input>
//             </div>
//             <div className="mt-3 d-flex m-auto justify-content-center">
//               <button className="otp mb-2">Update</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./set-password-man-ki-baat_component.css";

export function SetPasswordManKiBaatComponent() {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const handleUpdateClick = async () => {
    if (password !== rePassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const userId = localStorage.getItem("user_id"); // Retrieve stored user_id
      if (!userId) {
        setMessage("User ID is missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/update_password",
        {
          user_id: userId,
          password,
        }
      );

      setMessage(response.data.MSG);
      if (response.data.status) {
        alert("Password updated successfully!");
        navigate("/login"); // Navigate to login or any other page
      } else {
        alert(response.data.MSG);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.MSG) {
        setMessage(error.response.data.MSG);
      } else {
        setMessage("An error occurred. Please try again!");
      }
    }
  };

  return (
    <>
      <div
        className="container mt-5 w-50"
        style={{
          background: "linear-gradient(-135deg,blue,pink)",
          borderRadius: "30px",
          boxShadow: "0 0 8px rgb(145, 144, 146)",
          padding: "20px",
          color: "#ffffff",
        }}
      >
        <h1
          className="text-center p-2"
          style={{ fontFamily: "fantasy", textShadow: "3px 2px 3px blue" }}
        >
          Update Your Password
        </h1>
        <div className="row">
          <div className="col">
            <div className="form-group mb-3">
              <label
                className="d-flex m-auto justify-content-center"
                style={{ fontFamily: "fantasy", fontWeight: "" }}
              >
                Set New Password:
              </label>
              <input
                type="password"
                className="form-control w-50 d-flex m-auto justify-content-center"
                placeholder="Set Your New Password"
                style={{ fontFamily: "fantasy" }}
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label
                className="d-flex m-auto justify-content-center"
                style={{ fontFamily: "fantasy", fontWeight: "" }}
              >
                Re-Enter Password:
              </label>
              <input
                type="password"
                className="form-control w-50 d-flex m-auto justify-content-center"
                placeholder="Re-Enter Your Password"
                style={{ fontFamily: "fantasy" }}
                value={rePassword}
                onChange={handleRePasswordChange}
                required
              />
            </div>
            <div className="mt-3 d-flex m-auto justify-content-center">
              <button onClick={handleUpdateClick} className="otp mb-2">
                Update
              </button>
            </div>
            {message && (
              <p className="mt-3 text-center" style={{ color: "#ffffff" }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
