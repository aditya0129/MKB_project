import React from "react";
import "./man-ki-baat_component.css";
import axios from "axios";
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
  const [user, setUser] = useState([]);
  const [expertise, setExpertise] = useState([]);
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
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(
          `http://localhost:3001/get_user/profile`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log("Response:", response);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchAdvisorExpertise() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(
          `http://localhost:3001/User_Home/Advisor_detail`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log("Response:", response);
        setExpertise(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchAdvisorExpertise();
  }, []);

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  });
  function SignoutClick() {
    alert("Logout Successfully...");
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
                {user.map((u, index)=>(
                  <img
                  key={index}
                  className="ms-4 mt-2"
                  src={`http://localhost:3001/${u.image}`}
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
          <h3 className="display-2 font-weight-bold text-white">
          <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>&#10049;</span> User-Profile{" "}
          <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>&#10049;</span>
          </h3>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-4 mt-5">
            {user.map((u, index)=>(
              <img
              className="p-1"
              src={`http://localhost:3001/${u.image}`}
              alt=""
              style={{
                height: "350px",
                width: "350px",
                borderRadius: "50px",
                boxShadow: "0 0 8px rgb(145, 144, 146)",
              }}
            />
            ))}
          </div>
          <div className="col-md-4 mt-5">
            {user.map((u, index) => (
              <div key={index}>
                <h3>
                  {u.name}{" "}
                  <FontAwesomeIcon
                    className="ms-2"
                    icon={faLocationDot}
                    style={{ color: "green", fontSize: "25px" }}
                  />{" "}
                  <span style={{ fontSize: "1.2rem", color: "grey" }}>
                    {u.place}
                  </span>
                </h3>
                <p style={{ color: "blue" }}>Product Designer</p>
                <p style={{ color: "grey", fontSize: "1.1rem" }}>{u.category}</p>
              </div>
            ))}
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
          <div className="col-md-6 mt-5 mb-5">
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
            {user.map((u, index) => (
              <div key={index}>
                <p>
                  Phone{" "}
                  <span className="" style={{ color: "blue", marginLeft: "55px" }}>
                    {u.number}
                  </span>
                </p>
                <p>
                  Address{" "}
                  <span style={{ marginLeft: "40px" }}>{u.place}</span>
                </p>
                <p style={{ marginLeft: "110px", marginTop: "-15px" }}>
                  {u.place}
                </p>
                <p>
                  Email{" "}
                  <span style={{ color: "blue", marginLeft: "63px" }}>
                    {u.email}
                  </span>
                </p>
                <p>
                  Size{" "}
                  <span style={{ color: "blue", marginLeft: "77px" }}>
                    {u.email}
                  </span>
                </p>
                <hr style={{ marginTop: "56px" }}></hr>
                <p>
                  Birthday <span className="ms-5">{u.birthdate}</span>
                </p>
                <p>
                  Gender <span style={{ marginLeft: "55px" }}>{u.gender}</span>
                </p>
              </div>
            ))}
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
              <div class="" style={{ height: "75px" }}>
                <p class="mt-4">
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
