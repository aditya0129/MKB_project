import React from "react";
import "./contacts-man-ki-baat_component.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faPowerOff,
  faMapMarkerAlt,
  faUserTie,
  faCircleUp,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

export function ContactsManKiBaat() {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState([]);
  const [show, setShow] = useState(false);
  // State to control the visibility of the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    async function fetchUserContact() {
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
        setContact(response.data.data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchUserContact();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/advisor-search?name=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    } else {
      alert("Please Enter A Search Term.");
    }
  };

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  });

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 120, // Offset (in px) from the original trigger point
      once: true, // Ensure animations happen only once
    });
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    alert("Logout Successfully...");
    removeCookie("token");
    navigate("/register-case");
    handleClose();
  };

  const handleUserProfileClick = () => {
    navigate("/user-profile");
  };

  function handleAdvisorClick() {
    navigate("/advisor");
  }

  const [ShowModals, SetShowModals] = useState(false); // Controls modal visibility
  const [AdvisorDatas, SetAdvisorDatas] = useState([]); // Holds advisor data
  const [SelectedAdvisorId, SetSelectedAdvisorId] = useState(""); // Selected advisorId
  const [SearchTerm, SetSearchTerm] = useState("");
  const [FilteredAdvisorData, SetFilteredAdvisorData] = useState([]);
  const [roomId, setRoomId] = useState(""); // Holds the roomId

  // Function to fetch advisors and store their data
  const FetchAdvisors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/Advisor_All_Data"
      );
      const advisors = response.data.Data;

      if (advisors.length > 0) {
        // Store advisor data with id and name
        const advisorList = advisors.map((advisor) => ({
          id: advisor.advisorId,
          name: advisor.Name, // Assuming Name field exists
          image: advisor.Image,
        }));
        SetAdvisorDatas(advisorList);
      } else {
        alert("No Advisors Found.");
      }
    } catch (error) {
      console.error("Error fetching advisors:", error);
      alert("Error Fetching Advisors.");
    }
  };

  // Function to open the modal and fetch advisors
  const HandleOpenModal = () => {
    SetShowModals(true);
    FetchAdvisors(); // Fetch advisors when the modal is opened
  };

  // Function to close the modal
  const HandleCloseModal = () => {
    SetShowModals(false);
  };

  // Function to send notifications
  const sendLink = async () => {
    try {
      if (!SelectedAdvisorId) {
        alert("Please Select An Advisor Before Sending A Notification.");
        return;
      }

      if (!roomId) {
        alert("Room ID Is Missing. Please Try Again.");
        return;
      }

      const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage

      if (!token) {
        alert("Please Login To Send A Notification.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/sendLink/${SelectedAdvisorId}`,
        { roomId }, // Send roomId in the request body
        {
          headers: {
            "x-auth-token": token, // Send token in request headers for authentication
          },
        }
      );

      if (response.status === 200) {
        alert("Notification Sent Successfully.");
        SetSearchTerm(""); // Clear search term after success
        SetSelectedAdvisorId(""); // Clear selected advisor after success
        window.location.reload(); // Reload the page if necessary
      } else {
        alert("Failed To Send Notification.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error Sending Notification.");
    }
  };

  useEffect(() => {
    // Filter advisors based on search term
    const filtered = AdvisorDatas.filter((advisor) =>
      advisor.name.toLowerCase().includes(SearchTerm.toLowerCase())
    );
    SetFilteredAdvisorData(filtered);
  }, [SearchTerm, AdvisorDatas]);

  const [link] = useState("http://127.0.0.1:3030/");
  const [ShowModal, SetShowModal] = useState(false);

  const HandleModalOpen = () => {
    SetShowModal(true);
  };

  const HandleModalClose = () => {
    SetShowModal(false);
  };

  // Function to handle viewing notifications
  const handleViewNotifications = () => {
    setIsDialogOpen(true);
  };

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

  // Convert Advisors for react-select
  const AdvisorOptions = FilteredAdvisorData.map((advisor) => ({
    value: advisor.id,
    label: advisor.name,
    image: `http://localhost:3001/${advisor.image}`,
  }));

  // Custom Dropdown Option (Show Image + Name)
  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        padding: 10,
        backgroundColor: "black",
        color: "white",
      }}
    >
      <img
        src={data.image}
        alt={data.label}
        style={{ width: 70, height: 70, borderRadius: "50%", marginRight: 10 }}
      />
      {data.label}
    </div>
  );

  // Custom Selected Value (Show Image + Name)
  const CustomSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={data.image}
        alt={data.label}
        style={{ width: 70, height: 70, borderRadius: "50%", marginRight: 10 }}
      />
      {data.label}
    </div>
  );

  return (
    <>
      {/* ************************************HEADER******************************** */}
      <div id="header">
        <div className="container">
          <div className="row">
            <div className="col-md-6 form-group mt-2 d-flex">
              <h1 style={{ fontFamily: "French Script MT" }}>MKB</h1>
              <div className="search-container ms-5">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button" onClick={handleSearch}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
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
                </div>
                <li
                  onClick={handleViewNotifications}
                  className="open-dialog-button ms-3"
                  style={{
                    display: "inline-block",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  Notification
                  {/* <FontAwesomeIcon
                    icon={faBell}
                    className="ms-2"
                    style={{ color: "white" }}
                  /> */}
                  <FontAwesomeIcon
                    icon={faBell}
                    className="ms-2 bell-icon"
                    style={{ color: "yellow" }}
                  />
                </li>
                <li
                  className="ms-3"
                  style={{
                    display: "inline-block",
                    // color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  My Contacts
                </li>
                {/* {contact.map((detail, index) => (
                  <img
                    key={index}
                    className="ms-3 mt-2"
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
                /> */}
                <div className="profile-container">
                  {contact.map((detail, index) => (
                    <div key={index} className="profile-wrapper">
                      <div className="neon-ring"></div>
                      <img
                        src={`http://localhost:3001/${detail.image}`}
                        onClick={handleUserProfileClick}
                        alt="Profile"
                        className="profile-img"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  ))}

                  <FontAwesomeIcon
                    className="logout-btn"
                    icon={faPowerOff}
                    onClick={handleShow}
                  />
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* **********************************MY CONTACTS***************************** */}
      {/* <div className="container-fluid bg-primary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "150px" }}
        >
          <h3
            className="display-2 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
            data-aos="zoom-in"
          >
            {" "}
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>{" "}
            My Contacts{" "}
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
            <p className="m-0">My Contacts</p>
          </div>
        </div>
      </div> */}

      <div className="header-container mb-5">
        <div className="header-card" data-aos="zoom-in">
          <h3 className="header-title">
            <span className="header-icon">&#9884;</span> My Contacts{" "}
            <span className="header-icon">&#9884;</span>
          </h3>
          <div className="breadcrumb">
            <a href="/" className="breadcrumb-link">
              Home
            </a>
            <span className="breadcrumb-separator"> / </span>
            <span className="breadcrumb-current">My Contacts</span>
          </div>
        </div>
      </div>

      {/* *****************************CONFIRM-LOGOUT************************ */}
      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-power"> Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Really Sure You Want To Exit?</Modal.Body>
        <Modal.Footer>
          <Button
            className="bi bi-emoji-frown-fill"
            variant="outline-danger"
            onClick={handleClose}
          >
            {" "}
            No
          </Button>
          <Button
            className="bi bi-emoji-smile-fill"
            variant="outline-success"
            onClick={handleLogout}
          >
            {" "}
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ******************************GENERATE-VIDEO-LINK********************** */}
      <Modal show={ShowModal} onHide={HandleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-link-45deg"> Room Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your Room Link is:{" "}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bi bi-x-lg"
            variant="outline-danger"
            onClick={HandleModalClose}
          >
            {" "}
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* *******************************SEND ROOM ID NOTIFICATION*********************** */}
      <Modal
        show={ShowModals}
        onHide={HandleCloseModal}
        dialogClassName="modal-dialog modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-link-45deg">
            {" "}
            Select Advisor & Paste Room ID{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Room ID Input */}
          <Form.Group className="mb-3" controlId="roomIdInput">
            <Form.Label>Paste Room ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Paste Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="text-white custom-placeholder"
              style={{ backgroundColor: "black" }}
            />
          </Form.Group>

          {/* Search for Advisor */}
          <Form.Group className="mb-3" controlId="advisorSearch">
            <Form.Label>Search Advisor</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type to search..."
              value={SearchTerm}
              onChange={(e) => SetSearchTerm(e.target.value)}
              className="text-white custom-placeholder"
              style={{ backgroundColor: "black" }}
            />
          </Form.Group>

          {/* Advisor Selection with React-Select */}
          <Form.Group controlId="advisorSelectDropdown">
            <Form.Label>Select Advisor</Form.Label>
            <Select
              options={AdvisorOptions}
              value={AdvisorOptions.find(
                (opt) => opt.value === SelectedAdvisorId
              )}
              onChange={(selectedOption) =>
                SetSelectedAdvisorId(selectedOption.value)
              }
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "black",
                  color: "white",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "black",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? "#444" : "black",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }),
              }}
              components={{
                SingleValue: CustomSingleValue,
                Option: CustomOption,
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bi bi-x-lg"
            variant="outline-danger"
            onClick={HandleCloseModal}
          >
            {" "}
            Close
          </Button>
          <Button
            className="bi bi-bell-fill"
            variant="outline-success"
            onClick={sendLink}
          >
            {" "}
            Send Notification
          </Button>
        </Modal.Footer>
      </Modal>

      {/* *******************************SCROLL-TO-TOP************************ */}
      {isVisible && (
        <div
          className={`scroll-to-top ${isClicked ? "animate-click" : ""}`} // Apply animation class on click
          onClick={scrollToTop}
        >
          <FontAwesomeIcon className="arrow-icon fs-2" icon={faCircleUp} />
        </div>
      )}

      {/* ****************************USER-CONTACT-DETAIL******************** */}
      <div className="container">
        <div className="row">
          {contact.map((contactdetail, index) => (
            <div
              className="col-md-6 mt-5 mb-5"
              key={index}
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <img
                className="p-1 mb-5"
                src={`http://localhost:3001/${contactdetail.image}`}
                alt=""
                style={{
                  height: "350px",
                  width: "350px",
                  borderTopRightRadius: "50px",
                  borderBottomLeftRadius: "50px",
                  boxShadow: "0 0 8px rgb(145, 144, 146)",
                }}
              />
            </div>
          ))}
          {contact.map((contactdetail, index) => (
            <div
              className="col-md-6 mt-5 mb-5"
              key={index}
              data-aos="zoom-in"
              data-aos-delay="200"
              style={{
                background: "linear-gradient(135deg, #f3f3f3, #e6e6e6)",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <p>
                For any queries or further information, please feel free to
                contact us through the following channels:
              </p>
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
                  <h5>Name</h5>
                  <p>{contactdetail.name}</p>
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
                    icon={faMapMarkerAlt}
                    style={{ color: "#fbfbfb" }}
                  />
                </div>
                <div className="pl-3 ms-3">
                  <h5>Address</h5>
                  <p>{contactdetail.place}</p>
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
                  <h5>Email</h5>
                  <p>{contactdetail.email}</p>
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
                  <h5>Phone</h5>
                  <p>{contactdetail.number}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ***************************NOTIFICATION-BOX************************ */}
      <div className="notification-page">
        {/* Dialog for notification */}
        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <div className="dialog-header">
                <h3 className="bi bi-bell"> Notification</h3>
                {/* Close button */}
                <button
                  className="close-button"
                  onClick={() => setIsDialogOpen(false)}
                >
                  &times;
                </button>
              </div>

              {/* Displaying advisor information */}
              {contact.map((u, index) => (
                <div key={index} className="user-info">
                  <img
                    className="mb-3 m-auto"
                    src={`http://localhost:3001/${u.advisorDetails.Image}`}
                    alt={u.advisorDetails.Name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                  />
                  <p>
                    <strong>Name:-</strong> {u.advisorDetails.Name}
                  </p>
                  <p>
                    <strong>Gender:-</strong> {u.advisorDetails.Gender}
                  </p>
                  <p>
                    <strong>Expertise:-</strong> {u.advisorDetails.Expertise}
                  </p>
                  <p>
                    <strong>Experience:-</strong> {u.advisorDetails.Experience}
                  </p>
                </div>
              ))}

              {/* User Notifications */}
              {contact.map((u, index) => (
                <p key={index} className="bi bi-chat-quote-fill">
                  {" "}
                  {u.notification}
                </p>
              ))}

              <div className="dialog-actions">
                {contact.some(
                  (u) => u.notification === "I Am Available Now..."
                ) && (
                  <>
                    <button
                      className="reject-button bi bi-link"
                      onClick={HandleModalOpen}
                    >
                      {" "}
                      Get Link
                    </button>
                    <button
                      className="accept-button bi bi-send-check-fill"
                      onClick={HandleOpenModal}
                    >
                      {" "}
                      Send Link
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ********************************FOOTER************************************ */}
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
