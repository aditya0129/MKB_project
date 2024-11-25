import React, { useEffect, useState } from "react";
import "./advisor-search-man-ki-baat_component.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPhone,
  faComment,
  faVideo,
  faMinus,
  faPlus,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";

const AdvisorSearchManKiBaatComponent = () => {
  const [advisors, setAdvisors] = useState([]);
  const [user, setUser] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const advisorName = queryParams.get("name");

  useEffect(() => {
    if (advisorName) {
      fetchAdvisors(advisorName);
    }
  }, [advisorName]);

  const fetchAdvisors = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:3001/Advisor_All_Data?name=${encodeURIComponent(
          name
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setAdvisors(json.Data || []);
    } catch (error) {
      console.error("Error fetching advisors:", error);
      setAdvisors([]);
    }
  };

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

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  });

  const handleClose = () => setShow(false);
  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logout Successfully...");
    removeCookie("token");
    navigate("/register-case");
    handleClose();
  };

  const handleUserProfileClick = () => {
    navigate("/user-profile");
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/advisor-search?name=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    } else {
      alert("Please Enter A Search Term.");
    }
  };

  return (
    <>
      {/* *******************************HEADER*************************** */}
      <div id="header">
        <div className="container">
          <div className="row">
            <div className="col-md-6 form-group mt-2 d-flex">
              <h1 style={{ fontFamily: "French Script MT" }}>MKB</h1>
              <input
                type="search"
                className="form-control ms-5"
                placeholder="Type here to search"
                style={{ width: "200px", height: "50px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn btn-outline-info bi bi-search ms-2"
                style={{ height: "50px" }}
                onClick={handleSearch}
              >
                {" "}
                Search
              </button>
            </div>
            <div className="col-md-6">
              <FontAwesomeIcon
                className="float-end mt-4"
                icon={faPowerOff}
                onClick={handleShow}
                style={{
                  color: "white",
                  cursor: "pointer",
                }}
              />
              {user.map((u, index) => (
                <img
                  key={index}
                  className="float-end mt-2 me-3"
                  src={`http://localhost:3001/${u.image}`}
                  alt=""
                  onClick={handleUserProfileClick}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "100px",
                    cursor: "pointer",
                    // boxShadow: "0 0 8px rgb(145, 144, 146)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ******************************USER-PROFILE******************************* */}
      <div className="container-fluid bg-primary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "150px" }}
        >
          <h3
            className="display-2 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
          >
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>{" "}
            Searched-Advisor{" "}
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
            <p className="m-0">Searched-Advisor</p>
          </div>
        </div>
      </div>

      {/* ******************************SEARCHED-ADVISOR-DATA************************** */}
      <div
        className="container-fluid mt-5 advisor"
        style={{ background: "white" }}
      >
        <h3
          className="text-center mb-4"
          style={{
            color: advisors.length === 0 ? "red" : "green",
          }}
        >
          Advisors Matching: "{advisorName}"
        </h3>
        {advisors.length > 0 && (
          <div
            className="bi bi-emoji-smile-fill text-center fs-1"
            style={{ color: "green" }}
          ></div>
        )}
        <div className="row">
          {advisors.length > 0 ? (
            advisors.map((details, index) => (
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
                        background:
                          "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                        border: "none",
                        borderRadius: "7px",
                        width: "100px",
                        height: "45px",
                        color: "white",
                      }}
                    >
                      <FontAwesomeIcon className="me-2" icon={faPhone} />
                      Call
                    </button>
                    <button
                      className="btn btn-primary mt-2"
                      type="button"
                      style={{
                        background:
                          "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                        border: "none",
                        borderRadius: "7px",
                        width: "150px",
                        height: "45px",
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
          ) : (
            <h4 className="text-center" style={{ color: "red" }}>
              <div className="bi bi-emoji-frown-fill fs-1 mb-2"></div>
              No Advisors Found.
              <h4 className="mb-5">
                Please Try Again With A Different Keyword.
              </h4>
            </h4>
          )}
        </div>
      </div>

      {/* *************************CONFIRM-LOGOUT******************************** */}
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

      {/* ****************************************FOOTER*************************** */}
      <div
        className="container-fluid text-white"
        style={{
          background: "linear-gradient(135deg, blue,red)",
        }}
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
};

export default AdvisorSearchManKiBaatComponent;
