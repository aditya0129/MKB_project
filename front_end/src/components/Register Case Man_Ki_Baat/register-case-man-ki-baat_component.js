import React from "react";
import "./register-case-man-ki-baat_component.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function RegisterCaseManKiBaatComponent() {
  const navigate = useNavigate();

  const LoginClick = () => {
    navigate("/login");
  };

  const AdvisorLoginClick = () => {
    navigate("/advisor-login");
  };

  return (
    <div id="filled">
      <div className="box2">
        <form autocomplete="off">
          <FontAwesomeIcon className="icon mb-2" icon={faUserTie} />
          <h2 style={{ fontFamily: "Arial" }}>You want to Register as:</h2>
          <input
            type="submit"
            value="User"
            className="inline-input"
            style={{ fontFamily: "Arial" }}
            onClick={LoginClick}
          />
          <input
            type="submit"
            value="Advisor"
            className="inline-input"
            style={{ fontFamily: "Arial" }}
            onClick={AdvisorLoginClick}
          />
        </form>
      </div>
    </div>
  );
}
