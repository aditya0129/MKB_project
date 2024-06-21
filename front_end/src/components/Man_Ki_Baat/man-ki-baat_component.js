import React from "react";
import "./man-ki-baat_component.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faStar,
  faMessage,
  faEye,
  faUser,
  faPhoneVolume,
  faVideo,
  faWallet,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-brands-svg-icons";

export function ManKiBaatComponent({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStress, setShowStress] = useState(false);
  const [showAnxiety, setShowAnxiety] = useState(false);
  const [showEmotion, setShowEmotion] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleStressButtonClick = () => {
    setShowStress(true);
    setShowAnxiety(false);
    setShowEmotion(false);
  };

  const handleAnxietyButtonClick = () => {
    setShowAnxiety(true);
    setShowStress(false);
    setShowEmotion(false);
  };

  const handleEmotionButtonClick = () => {
    setShowEmotion(true);
    setShowStress(false);
    setShowAnxiety(false);
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

  function handleAdvisorClick() {
    navigate("/advisor");
  }

  const redirectToVideoChat = () => {
    window.location.href = "http://localhost:3030";
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    filterData(value);
  };

  const filterData = (query) => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  function handleContactsClick() {
    navigate("/contacts");
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
                  style={{ cursor: "pointer" }}
                >
                  <a className="dropdown-item" onClick={handleAdvisorClick}>
                    All Advisor
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={handleStressButtonClick}
                  >
                    Stress
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={handleAnxietyButtonClick}
                  >
                    Anxiety
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={handleEmotionButtonClick}
                  >
                    Emotion
                  </a>
                  <a className="dropdown-item" href="">
                    Elicit
                  </a>
                  <a className="dropdown-item" href="">
                    Motivation
                  </a>
                  <a className="dropdown-item" href="">
                    Law
                  </a>
                  <a className="dropdown-item" href="">
                    Love
                  </a>
                  <a className="dropdown-item" href="">
                    Break Up
                  </a>
                  <a className="dropdown-item" href="">
                    Ex
                  </a>
                  <a className="dropdown-item" href="">
                    Depressed
                  </a>
                  <a className="dropdown-item" href="">
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
                  onClick={handleContactsClick}
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

      <div className="container">
        <div className="row">
          <div className="col-md-4 mt-5">
            <img
              src="boy-img.jpg"
              alt=""
              style={{
                height: "350px",
                width: "350px",
                borderRadius: "50px",
                boxShadow: "0 0 8px rgb(145, 144, 146)",
              }}
            />
          </div>
          <div className="col-md-4 mt-5">
            <h3>
              Jeremy Rose{" "}
              <FontAwesomeIcon
                className="ms-2"
                icon={faLocationDot}
                style={{ color: "darkgray", fontSize: "20px" }}
              />{" "}
              <span style={{ fontSize: "1rem", color: "darkgray" }}>
                New York City
              </span>
            </h3>
            <p style={{ color: "blue" }}>Product Designer</p>
            <p style={{ color: "darkgray" }}>DEPRESSION</p>
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
              className="mt-3"
              type="button"
              style={{
                background: "linear-gradient(135deg,cyan,blue)",
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
                boxShadow: "0 0 3px rgb(81, 80, 82)",
              }}
            >
              <FontAwesomeIcon className="me-2" icon={faMessage} />
              Msg
            </button>
            <button
              className="ms-2 mt-3"
              type="button"
              style={{
                background: "linear-gradient(135deg,cyan,blue)",
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
                boxShadow: "0 0 3px rgb(81, 80, 82)",
              }}
            >
              <FontAwesomeIcon className="me-2" icon={faPhoneVolume} />
              Call
            </button>
            <button
              className="ms-2 mt-3"
              type="button"
              style={{
                background: "linear-gradient(135deg,cyan,blue)",
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
                boxShadow: "0 0 3px rgb(81, 80, 82)",
              }}
              onClick={redirectToVideoChat}
            >
              <FontAwesomeIcon className="me-2" icon={faVideo} />
              Call
            </button>
            <p className="mt-4">
              <FontAwesomeIcon icon={faWallet} /> My Wallet
            </p>
            <p className="mt-3" style={{ color: "darkgray" }}>
              <FontAwesomeIcon icon={faEye} /> Timeline{" "}
              <p
                className="ms-3 mt-3"
                style={{ display: "inline-block", color: "black" }}
              >
                <FontAwesomeIcon icon={faUser} /> About
              </p>
            </p>
          </div>
          {showStress && (
            <div className="col-md-4 mt-5 user">
              <img
                className="mt-4"
                src="boy-img.jpg"
                alt=""
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "100px",
                  display: "flex",
                  margin: "auto",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              />
              <p className="text-center mt-3">Jeremy Rose</p>
              <p className="text-center">People: Stress</p>
              <p className="text-center">Experience: 3 Years</p>
              <p className="text-center">
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
                className="mt-3"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "70px",
                  height: "40px",
                  color: "white",
                  marginLeft: "110px",
                  boxShadow: "0 0 3px rgb(81, 80, 82)",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faMessage} />
                Msg
              </button>
              <button
                className="ms-2 mt-3"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "70px",
                  height: "40px",
                  color: "white",
                  boxShadow: "0 0 3px rgb(81, 80, 82)",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faVideo} />
                Call
              </button>
            </div>
          )}
          {showAnxiety && (
            <div className="col-md-4 mt-5 user">
              <img
                className="mt-4"
                src="boy-img.jpg"
                alt=""
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "100px",
                  display: "flex",
                  margin: "auto",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              />
              <p className="text-center mt-3">Jeremy Rose</p>
              <p className="text-center">People: Anxiety</p>
              <p className="text-center">Experience: 2 Years</p>
              <p className="text-center">
                8,3{" "}
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
                className="mt-3"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "70px",
                  height: "40px",
                  color: "white",
                  marginLeft: "110px",
                  boxShadow: "0 0 3px rgb(81, 80, 82)",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faMessage} />
                Msg
              </button>
              <button
                className="ms-2 mt-3"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "70px",
                  height: "40px",
                  color: "white",
                  boxShadow: "0 0 3px rgb(81, 80, 82)",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faVideo} />
                Call
              </button>
            </div>
          )}
          {showEmotion && (
            <div className="col-md-4 mt-5 user">
              <img
                className="mt-4"
                src="boy-img.jpg"
                alt=""
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "100px",
                  display: "flex",
                  margin: "auto",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              />
              <p className="text-center mt-3">Jeremy Rose</p>
              <p className="text-center">People: Emotion</p>
              <p className="text-center">Experience: 2.5 Years</p>
              <p className="text-center">
                7{" "}
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
                className="mt-3"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "70px",
                  height: "40px",
                  color: "white",
                  marginLeft: "110px",
                  boxShadow: "0 0 3px rgb(81, 80, 82)",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faMessage} />
                Msg
              </button>
              <button
                className="ms-2 mt-3"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "70px",
                  height: "40px",
                  color: "white",
                  boxShadow: "0 0 3px rgb(81, 80, 82)",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faVideo} />
                Call
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5">
            <h3>
              Spotify New York{" "}
              <button type="button" className="btn btn-outline-primary ms-4">
                Primary
              </button>
            </h3>
            <p>170 William Street</p>
            <p style={{ marginTop: "-15px" }}>
              New York, NY 10038.78 212.312.51
            </p>
            <h3>
              Metropolitian Museum{" "}
              <button type="button" className="btn btn-outline-primary ms-4">
                Secondary
              </button>
            </h3>
            <p>S25 Earth Street</p>
            <p style={{ marginTop: "-15px" }}>
              New York, NY 10038.78 212.312.51
            </p>
            <hr></hr>
            <h5>Branding</h5>
            <h5>UI/UX</h5>
            <h5>Web-Design</h5>
            <h5>Packaging</h5>
            <h5>Print & Editorial</h5>
          </div>
          <div className="col-md-6 mt-5">
            <p>
              Phone{" "}
              <span className="ms-5" style={{ color: "blue" }}>
                +1 125 456 7850
              </span>
            </p>
            <p>
              Address{" "}
              <span style={{ marginLeft: "40px" }}>S25 Earth Street</span>
            </p>
            <p style={{ marginLeft: "110px", marginTop: "-15px" }}>
              New York, NY 10038.78 212.312.51
            </p>
            <p>
              Email{" "}
              <span style={{ color: "blue", marginLeft: "65px" }}>
                hello@jeremyrose.com
              </span>
            </p>
            <p>
              Size{" "}
              <span style={{ color: "blue", marginLeft: "80px" }}>
                www.jeremyrose.com
              </span>
            </p>
            <hr style={{ marginTop: "56px" }}></hr>
            <p>
              Birthday <span className="ms-5">June 5,1992</span>
            </p>
            <p>
              Gender <span style={{ marginLeft: "55px" }}>Male</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
