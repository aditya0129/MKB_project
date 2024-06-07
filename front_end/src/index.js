import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ManKiBaatComponent } from './components/Man_Ki_Baat/man-ki-baat_component';
import { AdvisorManKiBaatComponent } from './components/Advisor Man_Ki_Baat/advisor-man-ki-baat_component';
import { LoginManKiBaatComponent } from './components/Login Man_Ki_Baat/login-man-ki-baat_component';
import { SignupManKiBaatComponent } from './components/Signup Man_Ki_Baat/signup-man-ki-baat_component';
import { InvalidManKiBaatComponent } from './components/Invalid Man_Ki_Baat/invalid-man-ki-baat_component';
import VideoChatManKiBaatComponent from './components/Video Chat Man_Ki_Baat/video-chat-man-ki-baat_component';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ManKiBaatComponent />} />
      <Route path="advisor" element={<AdvisorManKiBaatComponent />} />
      <Route path="login" element={<LoginManKiBaatComponent />} />
      <Route path="signup" element={<SignupManKiBaatComponent />} />
      <Route path="invalid" element={<InvalidManKiBaatComponent />} />
      <Route path="video-chat" element={<VideoChatManKiBaatComponent />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
