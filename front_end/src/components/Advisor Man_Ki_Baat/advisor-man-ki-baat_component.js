import React, { useState, useEffect } from "react";
import "./advisor-man-ki-baat_component.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
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
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";

export function AdvisorManKiBaatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showInitialData, setShowInitialData] = useState(true); // State to control visibility of initial data
  const [show, setShow] = useState(false);
  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3001/get_user/profile`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchUser();
  }, []);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false); // Close dropdown after selection
    setShowInitialData(false); // Hide initial data
  };

  // Filter advisors based on selected category
  const filteredAdvisors = selectedCategory
    ? advisors.filter(
        (advisor) =>
          advisor.Expertise &&
          advisor.Expertise.toLowerCase().includes(
            selectedCategory.toLowerCase()
          )
      )
    : advisors;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    alert("Logout Successfully...");
    removeCookie("token");
    navigate("/register-case");
    handleClose();
  };

  const handleContactsClick = () => {
    navigate("/contacts");
  };

  const handleUserProfileClick = () => {
    navigate("/user-profile");
  };

  function handleAdvisorClick() {
    navigate("/advisor");
  }

  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // Track if button is clicked

  // Show or hide the button based on scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page when the button is clicked
  const scrollToTop = () => {
    setIsClicked(true); // Trigger the click animation
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });

    // Remove the click animation class after some time (e.g., 1s)
    setTimeout(() => {
      setIsClicked(false);
    }, 1000); // Matches the duration of the animation
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

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
                  style={{ cursor: "pointer", background: "black" }}
                >
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={handleAdvisorClick}
                  >
                    All Advisor
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Stress")}
                  >
                    Stress
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Anxiety")}
                  >
                    Anxiety
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Elicit")}
                  >
                    Elicit
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Job")}
                  >
                    Job
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Law")}
                  >
                    Law
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Marriage")}
                  >
                    Marriage
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Social issues")}
                  >
                    Social Issues
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Kisan")}
                  >
                    Kisan
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Property")}
                  >
                    Property
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Education")}
                  >
                    Education
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Carrer")}
                  >
                    Carrer
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Medical")}
                  >
                    Medical
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Love")}
                  >
                    Love
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Affair")}
                  >
                    Affair
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Breakup")}
                  >
                    Break Up
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Ex")}
                  >
                    Ex
                  </li>
                  <li
                    className="dropdown-item text-center border border-1 text-white"
                    onClick={() => handleCategorySelect("Hyper thinking")}
                  >
                    Hyper Thinking
                  </li>
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
                {user.map((detail, index) => (
                  <img
                    key={index}
                    className="ms-4 mt-2"
                    src={`http://localhost:3001/${detail.image}`}
                    onClick={handleUserProfileClick}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100px",
                      cursor: "pointer",
                      // boxShadow: "0 0 8px rgb(145, 144, 146)",
                    }}
                  />
                ))}
                <FontAwesomeIcon
                  className="ms-4"
                  icon={faPowerOff}
                  onClick={handleShow}
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
          style={{ minHeight: "150px" }}
        >
          <h3
            className="display-2 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
          >
            {" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>{" "}
            Advisor{" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>
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

      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="bi bi-power"> Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Really Sure You Want To Exit?</Modal.Body>
        <Modal.Footer>
          <Button
            className="bi bi-x-lg"
            variant="outline-danger"
            onClick={handleClose}
          >
            {" "}
            No
          </Button>
          <Button
            className="bi bi-check-lg"
            variant="outline-success"
            onClick={handleLogout}
          >
            {" "}
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {isVisible && (
        <div
          className={`scroll-to-top ${isClicked ? "animate-click" : ""}`} // Apply animation class on click
          onClick={scrollToTop}
        >
          <FontAwesomeIcon className="arrow-icon fs-2" icon={faCircleUp} />
        </div>
      )}

      <div
        className="container-fluid mt-5 advisor"
        style={{ background: "white" }}
      >
        <div className="row">
          {showInitialData
            ? advisors.map((details, index) => (
                <div className="col-md-4 mt-3 mb-5" key={index}>
                  <div
                    className="card"
                    style={{
                      borderTop: "8px solid blue",
                      borderBottom: "8px solid cyan",
                    }}
                  >
                    <div className="card-body">
                      <div className="text-center">
                        <img
                          src={`http://localhost:3001/${details.Image}`}
                          alt=""
                          style={{
                            height: "110px",
                            width: "110px",
                            borderRadius: "100px",
                            // boxShadow: "0 0 8px rgb(145, 144, 146)",
                          }}
                        />
                      </div>
                      <h5
                        className="mt-3"
                        style={{ fontWeight: "bold", fontFamily: "Arial" }}
                      >
                        {details.Name}
                      </h5>
                      <p>
                        {details.Rating}{" "}
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
                        />
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
                        />
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
                        />
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
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
                          background: "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                          border: "none",
                          borderRadius: "7px",
                          width: "100px",
                          height: "45px",
                          color: "white",
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon className="me-2" icon={faPhone} />
                        Call
                      </button>
                      <button
                        className="btn btn-primary mt-2"
                        type="button"
                        style={{
                          background: "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                          border: "none",
                          borderRadius: "7px",
                          width: "150px",
                          height: "45px",
                          color: "white",
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                      style={{
                        borderTopLeftRadius: "30px",
                        borderBottomRightRadius: "30px",
                        padding: "20px",
                      }}
                    >
                      <h6 style={{ fontWeight: "bold" }}>
                        Year of Experience :-
                      </h6>
                      <p>{details.Experience}</p>
                      <h6 style={{ fontWeight: "bold" }}>Expertise :-</h6>
                      <p>{details.Expertise}</p>
                      <h6 style={{ fontWeight: "bold" }}>Language :-</h6>
                      <p>{details.Language}</p>
                    </div>
                  </div>
                </div>
              ))
            : filteredAdvisors.map((details, index) => (
                <div className="col-md-4 mt-3 mb-5" key={index}>
                  <div
                    className="card"
                    style={{
                      borderTop: "8px solid blue",
                      borderBottom: "8px solid cyan",
                    }}
                  >
                    <div className="card-body">
                      <div className="text-center">
                        <img
                          src={`http://localhost:3001/${details.Image}`}
                          alt=""
                          style={{
                            height: "110px",
                            width: "110px",
                            borderRadius: "100px",
                            // boxShadow: "0 0 8px rgb(145, 144, 146)",
                          }}
                        />
                      </div>
                      <h5
                        className="mt-3"
                        style={{ fontWeight: "bold", fontFamily: "Arial" }}
                      >
                        {details.Name}
                      </h5>
                      <p>
                        {details.Rating}{" "}
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
                        />
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
                        />
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
                        />
                        <FontAwesomeIcon
                          className="ms-2"
                          icon={faStar}
                          style={{ color: "goldenrod" }}
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
                          background: "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                          border: "none",
                          borderRadius: "7px",
                          width: "100px",
                          height: "45px",
                          color: "white",
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                      >
                        <FontAwesomeIcon className="me-2" icon={faPhone} />
                        Call
                      </button>
                      <button
                        className="btn btn-primary mt-2"
                        type="button"
                        style={{
                          background: "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                          border: "none",
                          borderRadius: "7px",
                          width: "150px",
                          height: "45px",
                          color: "white",
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                      style={{
                        borderTopLeftRadius: "30px",
                        borderBottomRightRadius: "30px",
                        padding: "20px",
                      }}
                    >
                      <h6 style={{ fontWeight: "bold" }}>
                        Year of Experience :-
                      </h6>
                      <p>{details.Experience}</p>
                      <h6 style={{ fontWeight: "bold" }}>Expertise :-</h6>
                      <p>{details.Expertise}</p>
                      <h6 style={{ fontWeight: "bold" }}>Language :-</h6>
                      <p>{details.Language}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div
        className="container-fluid text-white"
        style={{ background: "linear-gradient(135deg, blue,red)" }}
      >
        <div className="container text-center">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-lg-8 col-md-6">
              <div className="" style={{ height: "105px" }}>
                <span
                  style={{ fontSize: "30px", textShadow: "3px 2px 3px red" }}
                >
                  &#9884;
                </span>
                <p>
                  &copy;{" "}
                  <a
                    href="https://blinkrandomtechnologies.com"
                    className="text-white border-bottom"
                    style={{ textDecoration: "none" }}
                  >
                    Blink Random Technologies
                  </a>
                  . All Rights Reserved. Designed by{" "}
                  <a
                    href="https://blinkrandomtechnologies.com"
                    className="text-white border-bottom"
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
