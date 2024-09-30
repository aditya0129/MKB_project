import React, { useState, useEffect } from "react";
import "./home-man-ki-baat_component.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faStar,
  faPhone,
  faPowerOff,
  faComment,
  faVideo,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export function HomeManKiBaatComponenet() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [expertise, setExpertise] = useState([]);
  const [user, setUser] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showInitialData, setShowInitialData] = useState(true); // State to control visibility of initial data
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  });

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
                  <a
                    className="dropdown-item text-center border border-1"
                    href="advisor"
                  >
                    All Advisor
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Stress")}
                  >
                    Stress
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Anxiety")}
                  >
                    Anxiety
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Elicit")}
                  >
                    Elicit
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Job")}
                  >
                    Job
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Law")}
                  >
                    Law
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Marriage")}
                  >
                    Marriage
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Social issues")}
                  >
                    Social Issues
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Kisan")}
                  >
                    Kisan
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Property")}
                  >
                    Property
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Education")}
                  >
                    Education
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Carrer")}
                  >
                    Carrer
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Medical")}
                  >
                    Medical
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Love")}
                  >
                    Love
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Affair")}
                  >
                    Affair
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Breakup")}
                  >
                    Break Up
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={() => handleCategorySelect("Ex")}
                  >
                    Ex
                  </a>
                  <a
                    className="dropdown-item text-center border border-1"
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
          style={{ minHeight: "100px" }}
        >
          <h3
            className="display-2 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
          >
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>{" "}
            Home{" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>
          </h3>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="bi bi-person-circle">
            {" "}
            Confirm Logout
          </Modal.Title>
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

      <div
        className="container-fluid mt-5 advisor"
        style={{ background: "white" }}
      >
        <div className="row">
          {showInitialData
            ? expertise.map((details, index) => (
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
                            boxShadow: "0 0 8px rgb(145, 144, 146)",
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
                          background: "linear-gradient(135deg,blue,cyan)",
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
                            boxShadow: "0 0 8px rgb(145, 144, 146)",
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
                          background: "linear-gradient(135deg,blue,cyan)",
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
