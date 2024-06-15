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
} from "@fortawesome/free-solid-svg-icons";

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
        const response = await axios.get(`http://localhost:3001/user/profile`, {
          headers: {
            "x-auth-token": token,
          },
        });
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
    alert("Logout Successfully..");
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

      <div
        className="container mt-5"
        style={{
          background: "#ffffff",
          borderTopRightRadius: "30px",
          borderBottomLeftRadius: "30px",
          boxShadow: "0 0 8px rgb(145, 144, 146)",
        }}
      >
        <div className="row">
          <div className="col-md-5 mt-5 mb-5">
            <img
              src="boy-img.jpg"
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
          </div>

          {advisors.map((advisor) => (
            <div
              className="col-md-3 mt-5 mb-5"
              style={{ borderLeft: "5px dotted grey", paddingLeft: "15px" }}
              key={advisor._id}
            >
              <div className="d-flex ">
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
                  <p>{advisor.name}</p>
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
                  <FontAwesomeIcon icon={faStar} style={{ color: "#fbfbfb" }} />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Rating:</h5>
                  <p>
                    {advisor.rating}{" "}
                    {[...Array(5)].map((star, i) => (
                      <FontAwesomeIcon
                        key={i}
                        className="ms-2"
                        icon={faStar}
                        style={{
                          color: i < advisor.rating ? "blue" : "darkgray",
                        }}
                      />
                    ))}
                  </p>
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
                  <p>{advisor.email}</p>
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
                  <p>{advisor.Phone_number}</p>
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
                  <p>{advisor.expertise}</p>
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
                  <h5>Description:</h5>
                  <p>{advisor.profile_description}</p>
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
                  <h5>Schedule:</h5>
                  <p>{advisor.availability_schedule}</p>
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
                    icon={faCreditCard}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Payment:</h5>
                  <p>{advisor.payment_info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
