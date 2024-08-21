import React from "react";
import "./man-ki-baat_component.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
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
  faChevronRight,
  faChevronLeft,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import { Button } from "bootstrap";

export function ManKiBaatComponent({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [advisorData, setAdvisorData] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showInitialData, setShowInitialData] = useState(true); // State to control visibility of initial data
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
        setAdvisors(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchAdvisorExpertise();
  }, []);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(`http://localhost:3001/wallet`, {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log("Response:", response);
        if (response.data.status) {
          setWallet([response.data.data]);
        } else {
          console.error("Failed to fetch wallet data:", response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWallet();
  }, []);

  // Define arrow components before using them in settings
  const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-next"
        onClick={onClick}
        style={{
          right: "20px",
          top: "55%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 1,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "white",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ fontSize: "25px", color: "cyan" }}
        />
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-prev"
        onClick={onClick}
        style={{
          left: "20px",
          top: "55%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 1,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "white",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ fontSize: "25px", color: "blue" }}
        />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  useEffect(() => {
    async function fetchAdvisors() {
      try {
        const response = await axios.get(
          `http://localhost:3001/Advisor_All_Data`
        );
        setAdvisorData(response.data.Data);
      } catch (error) {
        console.error("Error fetching advisors data:", error);
      }
    }

    fetchAdvisors();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false); // Close dropdown after selection
    setShowInitialData(false); // Hide initial data
  };

  // Filter advisors based on selected category
  const filteredAdvisors = selectedCategory
    ? advisorData.filter(
        (advisor) =>
          advisor.Expertise &&
          advisor.Expertise.toLowerCase().includes(
            selectedCategory.toLowerCase()
          )
      )
    : advisorData;

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

  const redirectToMsgChat = () => {
    window.location.href = "http://localhost:3002";
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

  function handleWalletClick() {
    navigate("/wallet");
  }

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
                  style={{ cursor: "pointer" }}
                >
                  <a className="dropdown-item" onClick={handleAdvisorClick}>
                    All Advisor
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Stress")}
                  >
                    Stress
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Anxiety")}
                  >
                    Anxiety
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Elicit")}
                  >
                    Elicit
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Job")}
                  >
                    Job
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Law")}
                  >
                    Law
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Marriage")}
                  >
                    Marriage
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Social issues")}
                  >
                    Social Issues
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Kisan")}
                  >
                    Kisan
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Property")}
                  >
                    Property
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Education")}
                  >
                    Education
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Carrer")}
                  >
                    Carrer
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Medical")}
                  >
                    Medical
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Love")}
                  >
                    Love
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Affair")}
                  >
                    Affair
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Breakup")}
                  >
                    Break Up
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Ex")}
                  >
                    Ex
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => handleCategorySelect("Hyper thinking")}
                  >
                    Hyper Thinking
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
                {user.map((u, index) => (
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
          <h3
            className="display-2 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
          >
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>{" "}
            User-Profile{" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>
          </h3>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-4 mt-5">
            {user.map((u, index) => (
              <img
                key={index}
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
                <h1 style={{ fontFamily: "Brush Script MT" }}>
                  {u.name}{" "}
                  <FontAwesomeIcon
                    className="ms-2"
                    icon={faLocationDot}
                    style={{ color: "green", fontSize: "25px" }}
                  />{" "}
                  <span style={{ fontSize: "1.2rem", color: "grey" }}>
                    {u.place}
                  </span>
                </h1>
                <h5 style={{ color: "blue" }}>{u.profasion}</h5>
                <p style={{ color: "grey", fontSize: "1.1rem" }}>
                  {u.category}
                </p>
              </div>
            ))}
            <p className="fw-bold">
              8.6{" "}
              <meter
                min="1"
                max="100"
                value="100"
                low="0"
                high="0"
                className="w-50"
              ></meter>
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
                boxShadow: "0 0 3px rgb(81, 80, 82)",
              }}
              onClick={redirectToMsgChat}
            >
              <FontAwesomeIcon className="me-2" icon={faMessage} />
              Msg
            </button>
            <button
              className="ms-2"
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
              className="ms-2"
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
            {wallet.map((balance, index) => (
              <p className="mt-4 fw-semibold fs-5">
                <FontAwesomeIcon
                  icon={faWallet}
                  onClick={handleWalletClick}
                  style={{
                    cursor: "pointer",
                    color: "brown",
                  }}
                />{" "}
                ₹ {balance.walletBalance}/-
              </p>
            ))}
            <button className="btn btn-outline-success p-1 w-25">Review</button>
            <span className="fw-semibold fs-6 ms-4">
              <FontAwesomeIcon icon={faStackExchange} /> History
            </span>
            <p className="mt-3" style={{ color: "darkgray" }}>
              <FontAwesomeIcon icon={faEye} /> Timeline{" "}
            </p>
          </div>

          <style>
            {`
          .slick-dots li button:before {
            font-size: 20px; /* Increase dot size */
            color: cyan; /* Dot color */
            opacity: 1; /* Ensure dots are visible */
          }

          .slick-dots li.slick-active button:before {
            color: blue; /* Color of the active dot */
          }

          .slick-dots {
            bottom: -30px; /* Position dots */
          }

          .slick-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1; /* Ensure arrows are on top */
          }

          .slick-prev {
            left: 10px; /* Position of the left arrow */
          }

          .slick-next {
            right: 10px; /* Position of the right arrow */
          }

          .slick-arrow:before {
            content: ''; /* Remove default text */
          }
        `}
          </style>

          <Slider {...settings} style={{ width: "380px", margin: "0 auto" }}>
            {showInitialData
              ? advisors.map((details, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-center align-items-center flex-column mt-5 user"
                  >
                    <img
                      className="mt-4"
                      src={`http://localhost:3001/${details.Image}`}
                      alt=""
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "100px",
                        boxShadow: "0 0 8px rgb(145, 144, 146)",
                      }}
                    />
                    <p className="text-center fw-bold mt-3">{details.Name}</p>
                    <p className="text-center">
                      <span className="fw-bold">People :-</span>{" "}
                      {details.Expertise}
                    </p>
                    <p className="text-center">
                      <span className="fw-bold">Experience :-</span>{" "}
                      {details.Experience}
                    </p>
                    <p className="text-center fw-bold">
                      8.6{" "}
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
                    <div className="d-flex justify-content-center mt-3 mb-3">
                      <button
                        type="button"
                        style={{
                          background: "linear-gradient(135deg,cyan,blue)",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon className="me-2" icon={faMessage} />
                        Msg
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "linear-gradient(135deg,cyan,blue)",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faPhoneVolume}
                        />
                        Msg
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "linear-gradient(135deg,cyan,blue)",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon className="me-2" icon={faVideo} />
                        Call
                      </button>
                    </div>
                  </div>
                ))
              : filteredAdvisors.map((details, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-center align-items-center flex-column mt-5 user"
                  >
                    <img
                      className="mt-4"
                      src={`http://localhost:3001/${details.Image}`}
                      alt=""
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "100px",
                        boxShadow: "0 0 8px rgb(145, 144, 146)",
                      }}
                    />
                    <p className="text-center fw-bold mt-3">{details.Name}</p>
                    <p className="text-center">
                      <span className="fw-bold">People :-</span>{" "}
                      {details.Expertise}
                    </p>
                    <p className="text-center">
                      <span className="fw-bold">Experience :-</span>{" "}
                      {details.Experience}
                    </p>
                    <p className="text-center fw-bold">
                      8.6{" "}
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
                    <div className="d-flex justify-content-center mt-3 mb-3">
                      <button
                        type="button"
                        style={{
                          background: "linear-gradient(135deg,cyan,blue)",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon className="me-2" icon={faMessage} />
                        Msg
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "linear-gradient(135deg,cyan,blue)",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faPhoneVolume}
                        />
                        Call
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "linear-gradient(135deg,cyan,blue)",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon className="me-2" icon={faVideo} />
                        Call
                      </button>
                    </div>
                  </div>
                ))}
          </Slider>
        </div>
      </div>

      <div
        className="container mt-5"
        style={{
          borderTop: "8px solid blue",
          borderBottom: "8px solid cyan",
          borderRadius: "30px",
        }}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="text-center p-2">
              <h3>DESCRIPTION</h3>
              <hr className="w-25 d-flex m-auto mb-4"></hr>
              <p style={{ textAlign: "justify" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum laborum numquam blanditiis harum
                quisquam eius sed odit fugiat iusto fuga praesentium optio,
                eaque rerum! Provident similique accusantium nemo autem.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mb-5">
            <h3>
              Category{" "}
              <button type="button" className="btn btn-outline-warning ms-4">
                Primary
              </button>
            </h3>
            {user.map((u, index) => (
              <div>
                <p className="text-primary">{u.category}</p>
                <p className="fw-bold">
                  5{" "}
                  <meter
                    min="1"
                    max="100"
                    value="100"
                    low="40"
                    high="80"
                    className="w-50"
                  ></meter>
                </p>
                <hr className="w-75"></hr>
                <h3>
                  Sub-Category{" "}
                  <button type="button" className="btn btn-outline-danger ms-4">
                    Secondary
                  </button>
                </h3>
                <p className="text-primary">{u.sub_category}</p>
                <p className="fw-bold">
                  3.5{" "}
                  <meter
                    min="1"
                    max="100"
                    value="100"
                    low="60"
                    high="80"
                    className="w-50"
                  ></meter>
                </p>
              </div>
            ))}
          </div>
          <div className="col-md-6 mt-5">
            {user.map((u, index) => (
              <div key={index}>
                <span
                  className="mb-3 fw-bold"
                  style={{ display: "inline-block", color: "black" }}
                >
                  <FontAwesomeIcon icon={faUserTie} />{" "}
                  <span className="ms-1">About :-</span>
                </span>
                <p>
                  Phone{" "}
                  <span
                    className=""
                    style={{ color: "blue", marginLeft: "55px" }}
                  >
                    {u.number}
                  </span>
                </p>
                <p>
                  Address <span style={{ marginLeft: "40px" }}>{u.place}</span>
                </p>
                <p>
                  Email{" "}
                  <span style={{ color: "blue", marginLeft: "63px" }}>
                    {u.email}
                  </span>
                </p>
                <p>
                  Age{" "}
                  <span style={{ color: "blue", marginLeft: "77px" }}>
                    {u.age}
                  </span>
                </p>
                <hr className="w-75"></hr>
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
