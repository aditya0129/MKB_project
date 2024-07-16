import React, { useState, useEffect } from "react";
import "./advisor-man-ki-baat_component.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";

export function AdvisorManKiBaatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [advisors, setAdvisors] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  }, [cookies, navigate]);

  // Fetch advisors data
  useEffect(() => {
    async function fetchAdvisors() {
      try {
        const response = await axios.get(
          `http://localhost:3001/Advisor_All_Data`
        );
        setAdvisors(response.data.Data);
      } catch (error) {
        console.error("Error fetching advisors data:", error);
      }
    }

    fetchAdvisors();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const SignoutClick = () => {
    alert("Logout Successfully...");
    removeCookie("token");
    navigate("/register-case");
  };

  const handleContactsClick = () => {
    navigate("/contacts");
  };

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
                  className="ms-4 p-1 mt-2"
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
          <h3 className="display-2 font-weight-bold text-white">
            {" "}
            <span style={{ fontSize: "85px" }}>&#10621;</span> Advisor{" "}
            <span style={{ fontSize: "85px" }}>&#10620;</span>
          </h3>
          <div className="d-inline-flex text-white">
            <p className="m-0">
              <a className="text-white" href="/">
                Home
              </a>
            </p>
            <p className="m-0 px-2">/</p>
            <p className="m-0">Advisor</p>
          </div>
        </div>
      </div>

      <div
        className="container-fluid mt-5 advisor"
        style={{ background: "white" }}
      >
        <div className="row">
          {advisors.map((advisor) => (
            <div className="col-md-4 mt-3" key={advisor._id}>
              <div className="card mb-3" style={{}}>
                <div className="card-body">
                  <div className="text-center">
                    <img
                      src="boy-img.jpg"
                      alt=""
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "100px",
                        boxShadow: "0 0 8px rgb(145, 144, 146)",
                      }}
                    />
                  </div>
                  <h5
                    className="mt-3"
                    style={{ fontWeight: "bold", fontFamily: "Arial" }}
                  >
                    {advisor.Name}
                  </h5>
                  <p>
                    {advisor.rating}{" "}
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
                    className="btn btn-primary me-2"
                    type="button"
                    style={{
                      background: "linear-gradient(135deg,blue,cyan)",
                      border: "none",
                      borderRadius: "7px",
                      width: "100px",
                      height: "45px",
                      color: "white",
                      boxShadow: "0 0 3px rgb(81, 80, 82)",
                    }}
                  >
                    <FontAwesomeIcon className="me-2" icon={faPhone} />
                    Call
                  </button>
                  <button
                    className="btn btn-primary mt-2"
                    type="button"
                    style={{
                      background: "linear-gradient(135deg,blue,cyan)",
                      border: "none",
                      borderRadius: "7px",
                      width: "150px",
                      height: "45px",
                      color: "white",
                      boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                    <FontAwesomeIcon className="" icon={faPlus} /> review
                  </p>
                </div>
                <div
                  className="card-footer ms-4"
                  style={{ borderRadius: "30px" }}
                >
                  <h6 style={{ fontWeight: "bold" }}>Year of Experience:</h6>
                  <p>{advisor.Experience}</p>
                  <h6 style={{ fontWeight: "bold" }}>Expertise:</h6>
                  <p>{advisor.Expertise}</p>
                  <h6 style={{ fontWeight: "bold" }}>Language:</h6>
                  <p>{advisor.Language}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
