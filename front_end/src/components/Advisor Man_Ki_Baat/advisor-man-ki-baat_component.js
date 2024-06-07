import React from "react";
import "./advisor-man-ki-baat_component.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faStar,
  faPhone,
  faComment,
  faVideo,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebookF,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export function AdvisorManKiBaatComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/login");
    }
  });

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
              <button className="btn btn-outline-primary ms-2" style={{height:"50px"}}>Search</button>
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
                  }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 advisor">
        <div className="row">
          <div className="col-md-4 mt-5">
            <img
              src="boy-img.jpg"
              alt=""
              style={{ height: "200px", width: "200px", borderRadius: "150px" }}
            />
          </div>
          <div className="col-md-4 mt-5">
            <h1>Jeremy Rose</h1>
            <p>
              8,6{" "}
              <FontAwesomeIcon
                className="ms-2"
                icon={faStar}
                style={{ color: "blue" }}
              />
              <FontAwesomeIcon
                className="ms-2"
                icon={faStar}
                style={{ color: "blue" }}
              />
              <FontAwesomeIcon
                className="ms-2"
                icon={faStar}
                style={{ color: "blue" }}
              />
              <FontAwesomeIcon
                className="ms-2"
                icon={faStar}
                style={{ color: "blue" }}
              />
              <FontAwesomeIcon
                className="ms-2"
                icon={faStar}
                style={{ color: "darkgray" }}
              />
            </p>
            <button
              className=""
              type="button"
              style={{
                background: "linear-gradient(135deg,cyan,blue)",
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
              }}
            >
              <FontAwesomeIcon className="me-2" icon={faPhone} />
              Call
            </button>
            <button
              className="ms-2"
              type="button"
              style={{
                background: "linear-gradient(135deg,cyan,blue)",
                border: "none",
                borderRadius: "7px",
                width: "140px",
                height: "40px",
                color: "white",
              }}
            >
              <FontAwesomeIcon className="me-2" icon={faPhone} />
              Waiting Call
            </button>
            <p className="mt-3">
              <FontAwesomeIcon icon={faComment} /> No. of chats
            </p>
            <p className="mt-3">
              <FontAwesomeIcon icon={faVideo} /> No. of video-calls
            </p>
            <p className="mt-3">
              <FontAwesomeIcon icon={faMinus} /> review{" "}
              <FontAwesomeIcon className="ms-4" icon={faPlus} /> review
            </p>
          </div>
          <div className="col-md-4 mt-5">
            <h4>Year of Experience:</h4>
            <p>3 Years</p>
            <h4>Experties:</h4>
            <p>HTML, CSS, JavaScript, Node.js, React.js</p>
            <h4>Income:</h4>
            <p>Rs. 50,000/- month</p>
            {/* <a className="me-4" href="www.we.whatsapp.com"><FontAwesomeIcon icon={faWhatsapp} /></a>
                    <a className="me-4" href="www.facebook.com"><FontAwesomeIcon icon={faFacebookF} /></a>
                    <a className="me-4" href="www.linkedin.com"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                    <a className="" href="www.instagram.com"><FontAwesomeIcon icon={faInstagram} /></a> */}
          </div>
        </div>
      </div>
    </>
  );
}
