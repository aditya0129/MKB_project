import React from "react";
import "./contacts-man-ki-baat_component.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faStar,
  faPhone,
  faComment,
  faVideo,
  faMinus,
  faPlus,
  faAnglesRight,
  faPowerOff,
  faMapMarkerAlt,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

export function ContactsManKiBaat() {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  });

  function SignoutClick() {
    alert("Logout Successfully..");
    removeCookie("token");
    navigate("/register-case");
  }

  return (
    <>
      <div id="header">
        <div className="container">
          <div className="row">
            <div className="col-md-6 form-group mt-2 d-flex">
              <h1>MKB</h1>
              <input
                type="search"
                className="form-control ms-5"
                placeholder="Search"
                style={{ width: "200px", height: "50px" }}
              />
              <button
                className="btn btn-outline-primary ms-2"
                style={{ height: "50px" }}
              >
                Search
              </button>
            </div>
            <div className="col-md-6">
              <ul
                className="dropdown"
                style={{ listStyle: "none", margin: "0", padding: "0" }}
              >
                <li
                  className="ms-4 dropdown-toggle"
                  onClick={toggleDropdown}
                  style={{
                    display: "inline-block",
                    color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  Find People
                </li>
                <div
                  className={`dropdown-menu${isOpen ? " show" : ""}`}
                  aria-labelledby="dropdownMenuButton"
                >
                  <a className="dropdown-item" href="advisor">
                    All Advisor
                  </a>
                  <a className="dropdown-item" href="stress">
                    Stress
                  </a>
                  <a className="dropdown-item" href="anxiety">
                    Anxiety
                  </a>
                  <a className="dropdown-item" href="emotion">
                    Emotion
                  </a>
                  <a className="dropdown-item" href="elicit">
                    Elicit
                  </a>
                  <a className="dropdown-item" href="motivation">
                    Motivation
                  </a>
                  <a className="dropdown-item" href="law">
                    Law
                  </a>
                  <a className="dropdown-item" href="love">
                    Love
                  </a>
                  <a className="dropdown-item" href="break-up">
                    Break Up
                  </a>
                  <a className="dropdown-item" href="ex">
                    Ex
                  </a>
                  <a className="dropdown-item" href="depressed">
                    Depressed
                  </a>
                  <a className="dropdown-item" href="over-thinking">
                    Over Thinking
                  </a>
                </div>
                <li
                  className="ms-4"
                  style={{
                    display: "inline-block",
                    color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  Message
                </li>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "blue" }} />
                <li
                  className="ms-4"
                  style={{
                    display: "inline-block",
                    color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  My Contacts
                </li>
                <img
                  className="ms-4"
                  src="boy-img.jpg"
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "100px",
                    boxShadow: "0 0 8px rgb(145, 144, 146)",
                  }}
                />
                <FontAwesomeIcon
                  className="ms-4"
                  icon={faPowerOff}
                  onClick={SignoutClick}
                  style={{ color: "blue", cursor: "pointer" }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-primary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "150px" }}
        >
          <h3 className="display-3 font-weight-bold text-white">My Contacts</h3>
          <div className="d-inline-flex text-white">
            <p className="m-0">
              <a className="text-white" href="/">
                Home
              </a>
            </p>
            <p className="m-0 px-2">/</p>
            <p className="m-0">My Contacts</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mb-5">
            <img
              src="boy-img.jpg"
              alt=""
              style={{
                height: "350px",
                width: "350px",
                borderTopRightRadius: "50px",
                borderBottomLeftRadius: "50px",
                boxShadow: "0 0 8px rgb(145, 144, 146)",
              }}
            />
          </div>
          <div className="col-md-6 mt-5">
            <p>
              For any queries or further information, please feel free to
              contact us through the following channels:
            </p>
            <div className="d-flex">
              <div
                className="bg-primary text-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              >
                <FontAwesomeIcon
                  icon={faUserTie}
                  style={{ color: "#fbfbfb" }}
                />
              </div>
              <div className="pl-3 ms-3">
                <h5>Name</h5>
                <p>Jeremy Rose</p>
              </div>
            </div>
            <div className="d-flex">
              <div
                className="bg-primary text-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              >
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ color: "#fbfbfb" }}
                />
              </div>
              <div className="pl-3 ms-3">
                <h5>Address</h5>
                <p>170 William Street New York, NY 10038.78 212.312.51</p>
              </div>
            </div>
            <div className="d-flex">
              <div
                className="bg-primary text-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ color: "#fbfbfb" }}
                />
              </div>
              <div className="pl-3 ms-3">
                <h5>Email</h5>
                <p>hello@jeremyrose.com</p>
              </div>
            </div>
            <div className="d-flex">
              <div
                className="bg-primary text-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              >
                <FontAwesomeIcon icon={faPhone} style={{ color: "#fbfbfb" }} />
              </div>
              <div className="pl-3 ms-3">
                <h5>Phone</h5>
                <p>+1 125 456 7850</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
