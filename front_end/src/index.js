import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ManKiBaatComponent } from "./components/Man_Ki_Baat/man-ki-baat_component";
import { AdvisorManKiBaatComponent } from "./components/Advisor Man_Ki_Baat/advisor-man-ki-baat_component";
import { LoginManKiBaatComponent } from "./components/Login Man_Ki_Baat/login-man-ki-baat_component";
import { SignupManKiBaatComponent } from "./components/Signup Man_Ki_Baat/signup-man-ki-baat_component";
import { InvalidManKiBaatComponent } from "./components/Invalid Man_Ki_Baat/invalid-man-ki-baat_component";
import { ContactsManKiBaat } from "./components/Contacts Man_Ki_Baat/contacts-man-ki-baat_component";
import { AdvisorRegisterManKiBaatComponent } from "./components/Advisor Register Man_Ki_Baat/advisor-register-man-ki-baat_component";
import { AdvisorLoginManKiBaatComponent } from "./components/Advisor Login Man_Ki_Baat/advisor-login-man-ki-baat_component";
import { RegisterCaseManKiBaatComponent } from "./components/Register Case Man_Ki_Baat/register-case-man-ki-baat_component";
import { AdvisorProfileManKiBaatComponent } from "./components/Advisor Profile/advisor-profile-man-ki-baat_component";
import { ForgetPasswordMankiBaatComponent } from "./components/Forgot Password/forgot-password-man-ki-baat_component";
import { VerifyOTPManKiBaatComponent } from "./components/Verify OTP/verify-otp-man-ki-baat_component";
import { SetPasswordManKiBaatComponent } from "./components/Set Password/set-password-man-ki-baat_component";
import { HomeManKiBaatComponenet } from "./components/Home Man_Ki_Baat/home-man-ki-baat_component";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeManKiBaatComponenet />} />
        <Route path="/user-profile" element={<ManKiBaatComponent />} />
        <Route path="advisor" element={<AdvisorManKiBaatComponent />} />
        <Route path="login" element={<LoginManKiBaatComponent />} />
        <Route path="signup" element={<SignupManKiBaatComponent />} />
        <Route path="invalid" element={<InvalidManKiBaatComponent />} />
        <Route path="contacts" element={<ContactsManKiBaat />} />
        <Route
          path="advisor-register"
          element={<AdvisorRegisterManKiBaatComponent />}
        />
        <Route
          path="advisor-login"
          element={<AdvisorLoginManKiBaatComponent />}
        />
        <Route
          path="register-case"
          element={<RegisterCaseManKiBaatComponent />}
        />
        <Route
          path="advisor-profile"
          element={<AdvisorProfileManKiBaatComponent />}
        />
        <Route
          path="forget-password"
          element={<ForgetPasswordMankiBaatComponent />}
        />
        <Route path="verify-otp" element={<VerifyOTPManKiBaatComponent />} />
        <Route
          path="set-password"
          element={<SetPasswordManKiBaatComponent />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
