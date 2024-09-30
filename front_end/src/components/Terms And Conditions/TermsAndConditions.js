import React from "react";
import { useNavigate } from "react-router-dom";
import "./TermsAndConditions.css"; // Optional: Add styles for this component

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms & Conditions</h1>
        <hr
          style={{
            border: "none",
            borderRadius: "20px",
            height: "5px",
            width: "50%",
            backgroundColor: "blue",
            margin: "auto",
          }}
        ></hr>
        <p>Last updated: [Date]</p>

        <h3>1. Introduction</h3>
        <p>
          Welcome to [Your Website/App Name]. By accessing or using our
          services, you agree to be bound by these terms and conditions. Please
          read these terms carefully before using our services.
        </p>

        <h3>2. Intellectual Property</h3>
        <p>
          The content, design, and features of our website/app are protected by
          copyright laws. You agree not to copy, reproduce, or distribute any
          content without our permission.
        </p>

        <h3>3. User Responsibilities</h3>
        <p>
          Users are responsible for the accuracy of the information provided.
          You agree not to misuse our platform for illegal activities or
          violations of these terms.
        </p>

        <h3>4. Termination</h3>
        <p>
          We reserve the right to terminate access to our services at any time,
          with or without cause, for violations of these terms.
        </p>

        <h3>5. Limitation of Liability</h3>
        <p>
          [Your Website/App Name] is not responsible for any damages or losses
          incurred through the use of our services.
        </p>

        <h3>6. Governing Law</h3>
        <p>
          These terms will be governed and construed in accordance with the laws
          of [Your Country], without regard to its conflict of law provisions.
        </p>

        <h3>7. Changes to These Terms</h3>
        <p>
          We reserve the right to update these terms and conditions at any time.
          Please check this page regularly for updates.
        </p>

        <h3>8. Contact Us</h3>
        <p>
          If you have any questions about these terms, please contact us at:
          support@[YourWebsite].com.
        </p>

        <button onClick={handleBackClick} className="back-button">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
