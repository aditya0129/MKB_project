import React, { useState, useEffect } from "react";
import "./advisor-profile-man-ki-baat_component.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faStar,
  faPhone,
  faPowerOff,
  faUserTie,
  faBrain,
  faFilePrescription,
  faCalendarDays,
  faCreditCard,
  faCity,
  faBuildingWheat,
  faLanguage,
  faTransgender,
  faVideo,
  faPhoneVolume,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { faStackExchange } from "@fortawesome/free-brands-svg-icons";

export function AdvisorProfileManKiBaatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [advisors, setAdvisors] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    async function fetchAdvisor() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(
          `http://localhost:3001/get_Advisor/profile`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log("Response:", response);
        setAdvisors(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchAdvisor();
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
              <h1 style={{ fontFamily: "French Script MT" }}>MKB</h1>
              <input
                type="search"
                className="form-control ms-5"
                placeholder="Search"
                style={{ width: "200px", height: "50px" }}
              />
              <button
                className="btn btn-primary ms-2"
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
                    // color: "black",
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
                    // color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  Message
                </li>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "white" }} />
                <li
                  className="ms-4"
                  onClick={handleContactsClick}
                  style={{
                    display: "inline-block",
                    // color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  My Contacts
                </li>
                {advisors.map((advisor, index) => (
                  <img
                    key={index}
                    className="ms-4 mt-2"
                    src={`http://localhost:3001/${advisor.Image}`}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100px",
                      // boxShadow: "0 0 8px rgb(145, 144, 146)",
                    }}
                  />
                ))}
                <FontAwesomeIcon
                  className="ms-4"
                  icon={faPowerOff}
                  onClick={SignoutClick}
                  style={{ color: "white", cursor: "pointer" }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-primary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "100px" }}
        >
          <h3
            className="display-3 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
          >
            {" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10046;
            </span>{" "}
            Advisor-Profile{" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10046;
            </span>
          </h3>
        </div>
      </div>

      <div
        className="container mt-5 mb-5"
        style={{
          background: "#ffffff",
          borderTopRightRadius: "30px",
          borderBottomLeftRadius: "30px",
          boxShadow: "0 0 8px rgb(145, 144, 146)",
          borderTop: "8px solid blue",
          borderBottom: "8px solid cyan",
        }}
      >
        <div className="row">
          <div className="col-md-5 mt-5 mb-5">
            {advisors.map((advisor, index) => (
              <img
                key={index}
                className="p-1"
                src={`http://localhost:3001/${advisor.Image}`}
                alt=""
                style={{
                  height: "350px",
                  width: "350px",
                  borderRadius: "50px",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                  display: "flex",
                  justifyContent: "center",
                  margin: "auto",
                }}
              />
            ))}
            <div className="mt-4 d-flex m-auto justify-content-center">
              <button
                className=""
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "90px",
                  height: "40px",
                  color: "white",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faMessage} />
                Msg
              </button>
              <button
                className="ms-4"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "90px",
                  height: "40px",
                  color: "white",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faPhoneVolume} />
                Call
              </button>
              <button
                className="ms-4"
                type="button"
                style={{
                  background: "linear-gradient(135deg,cyan,blue)",
                  border: "none",
                  borderRadius: "7px",
                  width: "90px",
                  height: "40px",
                  color: "white",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faVideo} />
                Call
              </button>
            </div>
          </div>

          {advisors.map((advisor) => (
            <div className="col-md-3 mt-5 mb-5" key={advisor._id}>
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
                  <h5>Name:</h5>
                  <p>{advisor.Name}</p>
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
                    icon={faTransgender}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Gender:</h5>
                  <p>{advisor.Gender} </p>
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
                  <FontAwesomeIcon icon={faCity} style={{ color: "#fbfbfb" }} />
                </div>
                <div className="pl-3 ms-3">
                  <h5>City:</h5>
                  <p>{advisor.City}</p>
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
                    icon={faBuildingWheat}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>State:</h5>
                  <p>{advisor.State}</p>
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
                    icon={faBrain}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Expertise:</h5>
                  <p>{advisor.Expertise}</p>
                </div>
              </div>
            </div>
          ))}

          {advisors.map((advisor) => (
            <div className="col-md-4 mt-5" key={`desc-${advisor._id}`}>
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
                    icon={faFilePrescription}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Experience:</h5>
                  <p>{advisor.Experience}</p>
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
                  <h5>Email:</h5>
                  <p>{advisor.Email}</p>
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
                    icon={faPhone}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Phone:</h5>
                  <p>{advisor.Number}</p>
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
                    icon={faCalendarDays}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Age:</h5>
                  <p>{advisor.Age}</p>
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
                    icon={faLanguage}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Language:</h5>
                  <p>{advisor.Language}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center">
            <h4>ABOUT</h4>
            <hr className="w-25 d-flex justify-content-center m-auto mb-3"></hr>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia, molestiae quas vel sint commodi repudiandae consequuntur
              voluptatum laborum numquam blanditiis harum quisquam eius sed odit
              fugiat iusto fuga praesentium optio, eaque rerum! Provident
              similique accusantium nemo autem.
            </p>
          </div>
          <div>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <h4>PERSONALITY</h4>
                  <p>
                    Analytical{" "}
                    <progress
                      min="1"
                      max="100"
                      value="30"
                      className="ms-2"
                    ></progress>
                  </p>
                  <p>
                    Problem Solving{" "}
                    <progress
                      min="1"
                      max="100"
                      value="50"
                      className="ms-2"
                    ></progress>
                  </p>
                  <p>
                    Public Speaking{" "}
                    <progress
                      min="1"
                      max="100"
                      value="70"
                      className="ms-2"
                    ></progress>
                  </p>
                  <p>
                    Adaptable{" "}
                    <progress
                      min="1"
                      max="100"
                      value="100"
                      className="ms-2"
                    ></progress>
                  </p>
                </div>
                <div className="col-md-4 mt-5">
                  <div className="mt-5">
                    <button
                      className=""
                      type="button"
                      style={{
                        background: "linear-gradient(135deg,cyan,blue)",
                        border: "none",
                        borderRadius: "7px",
                        width: "90px",
                        height: "40px",
                        color: "white",
                      }}
                    >
                      <FontAwesomeIcon className="me-2" icon={faMessage} />
                      Msg
                    </button>
                    <button
                      className="ms-4"
                      type="button"
                      style={{
                        background: "linear-gradient(135deg,cyan,blue)",
                        border: "none",
                        borderRadius: "7px",
                        width: "90px",
                        height: "40px",
                        color: "white",
                      }}
                    >
                      <FontAwesomeIcon className="me-2" icon={faPhoneVolume} />
                      Call
                    </button>
                    <button
                      className="ms-4"
                      type="button"
                      style={{
                        background: "linear-gradient(135deg,cyan,blue)",
                        border: "none",
                        borderRadius: "7px",
                        width: "90px",
                        height: "40px",
                        color: "white",
                      }}
                    >
                      <FontAwesomeIcon className="me-2" icon={faVideo} />
                      Call
                    </button>
                  </div>
                </div>
                <div className="col-md-4">
                  <h4>SKILLS</h4>
                  <p>Communication</p>
                  <meter
                    min="1"
                    max="100"
                    value="100"
                    low="0"
                    high="0"
                    className="w-75 mb-3"
                  ></meter>
                  <p>Problem Solving</p>
                  <meter
                    min="1"
                    max="100"
                    value="100"
                    low="40"
                    high="80"
                    className="w-75 mb-3"
                  ></meter>
                  <p>Leadership Experience</p>
                  <meter
                    min="1"
                    max="100"
                    value="100"
                    low="60"
                    high="80"
                    className="w-75 mb-3"
                  ></meter>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h4>GOAL</h4>
              <hr className="w-25 d-flex justify-content-center m-auto mb-3"></hr>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum laborum numquam blanditiis harum
                quisquam eius sed odit fugiat iusto fuga praesentium optio,
                eaque rerum! Provident similique accusantium nemo autem.
              </p>
              <div className="mb-4">
                <button className="btn btn-outline-success p-1 w-25 mt-3">
                  Review
                </button>
                <div className="fw-semibold fs-6 mt-3">
                  <FontAwesomeIcon icon={faStackExchange} /> History
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="container-fluid text-white"
        style={{ background: "linear-gradient(135deg, blue,red)" }}
      >
        <div class="container text-center">
          <div class="row d-flex align-items-center justify-content-center">
            <div class="col-lg-8 col-md-6">
              <div class="" style={{ height: "105px" }}>
                <span
                  style={{ fontSize: "30px", textShadow: "3px 2px 3px red" }}
                >
                  &#9884;
                </span>
                <p>
                  &copy;{" "}
                  <a
                    class="text-white border-bottom"
                    style={{ textDecoration: "none" }}
                  >
                    Blink Random Technologies
                  </a>
                  . All Rights Reserved. Designed by{" "}
                  <a
                    class="text-white border-bottom"
                    style={{ textDecoration: "none" }}
                  >
                    Saurabh Karn & Aditya Prajapati{" "}
                    <span style={{ color: "#5cb874" }}>
                      (Blink Random Technologies)
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
