import React from "react";
import "./man-ki-baat_component.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import io from "socket.io-client";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
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
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { faStackExchange } from "@fortawesome/free-brands-svg-icons";

export function ManKiBaatComponent({ data, users }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [advisorData, setAdvisorData] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [advisor, setAdvisor] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showInitialData, setShowInitialData] = useState(true); // State to control visibility of initial data
  // State to control the visibility of the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // State to store notification count
  const [formData, setFormData] = useState({
    email: users?.email || "",
    number: users?.number || "",
    place: users?.place || "",
    category: users?.category || "",
    sub_category: users?.sub_category || "",
    profasion: users?.profasion || "",
    description: users?.description || "",
    category_strength: users?.category_strength || "",
    subcategory_strength: users?.subcategory_strength || "",
    image: null,
  });
  const [show, setShow] = useState(false);
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

  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [advisorDatas, setAdvisorDatas] = useState([]); // Holds advisor data
  const [selectedAdvisorId, setSelectedAdvisorId] = useState(""); // Selected advisorId
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdvisorData, setFilteredAdvisorData] = useState([]);

  // Function to fetch advisors and store their data
  const fetchAdvisors = async () => {
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
        }));
        setAdvisorDatas(advisorList);
      } else {
        alert("No Advisors Found.");
      }
    } catch (error) {
      console.error("Error fetching advisors:", error);
      alert("Error Fetching Advisors.");
    }
  };

  // Function to open the modal and fetch advisors
  const handleOpenModal = () => {
    setShowModal(true);
    fetchAdvisors(); // Fetch advisors when the modal is opened
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const sendNotifications = async () => {
    try {
      if (!selectedAdvisorId) {
        alert("Please Select An Advisor Before Sending A Notification.");
        return;
      }

      const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage

      if (!token) {
        alert("Please Login To Send A Notification.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/Notification/${selectedAdvisorId}`,
        {},
        {
          headers: {
            "x-auth-token": token, // Send token in request headers for authentication
          },
        }
      );

      if (response.status === 200) {
        alert("Notification Sent Successfully.");
        setSearchTerm(""); // Clear search term after success
        setSelectedAdvisorId(""); // Clear selected advisor after success
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
    const filtered = advisorDatas.filter((advisor) =>
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdvisorData(filtered);
  }, [searchTerm, advisorDatas]);

  const [link, setLink] = useState("http://127.0.0.1:3030/");
  const [ShowModal, SetShowModal] = useState(false);

  const HandleModalOpen = () => {
    SetShowModal(true);
  };

  const HandleModalClose = () => {
    SetShowModal(false);
  };

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

  useEffect(() => {
    async function fetchAdvisorProfile() {
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
        setAdvisor(response.data.data);
        // Set the notification count to the number of advisors fetched
        setNotificationCount(response.data.data.length);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchAdvisorProfile();
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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    alert("Logout Successfully...");
    removeCookie("token");
    navigate("/register-case");
    handleClose();
  };

  function handleAdvisorClick() {
    navigate("/advisor");
  }

  const redirectToVideoChat = () => {
    window.location.href = "http://127.0.0.1:3030";
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

  // Function to handle viewing notifications
  const handleViewNotifications = () => {
    setIsDialogOpen(true);
    setNotificationCount(0); // Reset the count when viewing notifications
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Check if any fields are filled
  const isFormFilled = () => {
    return Object.values(formData).some((value) => value && value !== ""); // Checks if any field is non-empty
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the form has any values
    if (!isFormFilled()) {
      alert("Please Fill Any Field For Update.");
      return; // Stop form submission
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) form.append(key, formData[key]);
    });

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No Token Found, Please Login First.");
        return;
      }

      // Send patch request with form data and token
      const res = await axios.patch(
        `http://localhost:3001/UpdateProfile`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token, // Ensure backend is expecting this format
          },
        }
      );

      // Handle response based on backend status
      if (res.status === 200) {
        // Success response from the server
        alert("Profile Updated Successfully!");
        // Reload the page after success
        window.location.reload();
      } else {
        // Handle unexpected status codes
        alert("Unexpected Response From Server. Please Try Again.");
      }
    } catch (error) {
      // If the server returns an error response, display the message
      if (error.response && error.response.data && error.response.data.msg) {
        alert("Error Updating Profile: " + error.response.data.msg);
      } else {
        // Handle cases where there's no response or other unexpected errors
        alert("An Unexpected Error Occurred While Updating The Profile.");
      }
    }
  };

  const [email, setEmail] = useState([]);
  const [useError, setUseError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/User_All_Data")
      .then((response) => {
        setEmail(response.data.Data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function VerifyEmail(e) {
    if (!Array.isArray(email)) {
      return;
    }
    for (var user of email) {
      if (user.email === e.target.value) {
        setUseError("User Email Taken - Try Another");
        return;
      }
    }
    setUseError("");
  }

  const [numbers, setNumbers] = useState([]);
  const [useErrors, setUseErrors] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/User_All_Data")
      .then((response) => {
        setNumbers(response.data.Data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function normalizePhoneNumber(inputNumber) {
    const numberStr = String(inputNumber);

    const strippedNumber = numberStr.replace(/[^\d]/g, "");

    if (strippedNumber.startsWith("91")) {
      return strippedNumber;
    }

    return "91" + strippedNumber.slice(-10);
  }

  function VerifyNumber(value) {
    const enteredNumber = normalizePhoneNumber(value);

    if (!Array.isArray(numbers)) {
      return;
    }

    for (const user of numbers) {
      const dbNumber = normalizePhoneNumber(user.number);
      if (dbNumber === enteredNumber) {
        setUseErrors("User Number Taken - Try Another");
        return;
      }
    }
    setUseErrors("");
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
                  className="ms-3 dropdown-toggle"
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
                  <a
                    className="dropdown-item text-center border border-1"
                    onClick={handleAdvisorClick}
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
                {/* <li
                  onClick={handleViewNotifications}
                  className="ms-3"
                  style={{
                    display: "inline-block",
                    // color: "black",
                    padding: "15px 10px",
                    cursor: "pointer",
                  }}
                >
                  Notification
                  <FontAwesomeIcon
                    icon={faBell}
                    style={{ color: "white" }}
                    className="ms-2"
                  />
                </li> */}
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
                  <FontAwesomeIcon
                    icon={faBell}
                    className="ms-2"
                    style={{ color: "white" }}
                  />
                  {/* Display the notification count */}
                  {notificationCount > 0 && (
                    <span
                      className="notification-count"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "12px",
                      }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </li>
                <li
                  className="ms-3"
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
                    className="ms-3 mt-2"
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
            <span style={{ fontSize: "90px", textShadow: "3px 2px 3px red" }}>
              &#10049;
            </span>{" "}
            User-Profile{" "}
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
            <p className="m-0">User-Profile</p>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-person-circle">
            {" "}
            Select Advisor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="advisorSearch">
            <Form.Label>Search Advisor</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-white custom-placeholder"
              style={{ backgroundColor: "black" }}
            />
          </Form.Group>
          <Form.Group controlId="advisorSelectDropdown">
            <Form.Label>Select Advisor</Form.Label>
            <Form.Control
              as="select"
              value={selectedAdvisorId}
              onChange={(e) => setSelectedAdvisorId(e.target.value)}
              className="text-white"
              style={{ backgroundColor: "black" }}
            >
              <option
                value=""
                className="text-white"
                style={{ backgroundColor: "black" }}
              >
                -- Select Advisor --
              </option>
              {filteredAdvisorData.map((advisor) => (
                <option
                  className="text-white"
                  key={advisor.id}
                  value={advisor.id}
                  style={{ backgroundColor: "black" }}
                >
                  {advisor.name} (ID: {advisor.id})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bi bi-x-lg"
            variant="outline-danger"
            onClick={handleCloseModal}
          >
            {" "}
            Close
          </Button>
          <Button
            className="bi bi-bell-fill"
            variant="outline-success"
            onClick={sendNotifications}
          >
            {" "}
            Send Notification
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
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

        <div id="video-grid" style={{ display: "flex" }}></div>
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

      <div className="container text-center">
        <button
          type="button"
          className="btn btn-outline-dark"
          data-bs-toggle="modal"
          data-bs-target="#updateProfileModal"
        >
          <span className="bi bi-pencil-square"> Update Profile</span>
        </button>
      </div>

      <div
        className="modal fade"
        id="updateProfileModal"
        tabIndex="-1"
        aria-labelledby="updateProfileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="updateProfileModalLabel">
                <span className="bi bi-person-circle"> Update Profile</span>
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <dl>
                <dt>Email</dt>
                <dd>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyUp={VerifyEmail}
                    className="form-control"
                  />
                </dd>
                {useError && <div className="text-danger">{useError}</div>}

                <dt>Number</dt>
                <dd>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={(e) => {
                      handleChange(e);
                      VerifyNumber(e.target.value);
                    }}
                    className="form-control"
                  />
                </dd>
                {useErrors && <div className="text-danger">{useErrors}</div>}

                <dt>Place</dt>
                <dd>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    className="form-control"
                  />
                </dd>

                <dt>Category</dt>
                <dd>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Category
                    </option>
                    <option
                      value="Stress"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Stress
                    </option>
                    <option
                      value="Anxiety"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Anxiety
                    </option>
                    <option
                      value="Elicit"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Elicit
                    </option>
                    <option
                      value="Job"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Job
                    </option>
                    <option
                      value="Law"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Law
                    </option>
                    <option
                      value="Marriage"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Marriage
                    </option>
                    <option
                      value="Social Issues"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Social Issues
                    </option>
                    <option
                      value="Kisan"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kisan
                    </option>
                    <option
                      value="Property"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Property
                    </option>
                    <option
                      value="Education"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Education
                    </option>
                    <option
                      value="Carrer"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Carrer
                    </option>
                    <option
                      value="Medical"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Medical
                    </option>
                    <option
                      value="Love"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Love
                    </option>
                    <option
                      value="Affair"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Affair
                    </option>
                    <option
                      value="Break Up"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Break Up
                    </option>
                    <option
                      value="Ex"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Ex
                    </option>
                    <option
                      value="Hyper Thinking"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Hyper Thinking
                    </option>
                  </select>
                </dd>

                <dt>Subcategory</dt>
                <dd>
                  <select
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Subcategory
                    </option>
                    <option
                      value="Stress"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Stress
                    </option>
                    <option
                      value="Anxiety"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Anxiety
                    </option>
                    <option
                      value="Elicit"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Elicit
                    </option>
                    <option
                      value="Job"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Job
                    </option>
                    <option
                      value="Law"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Law
                    </option>
                    <option
                      value="Marriage"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Marriage
                    </option>
                    <option
                      value="Social Issues"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Social Issues
                    </option>
                    <option
                      value="Kisan"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kisan
                    </option>
                    <option
                      value="Property"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Property
                    </option>
                    <option
                      value="Education"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Education
                    </option>
                    <option
                      value="Carrer"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Carrer
                    </option>
                    <option
                      value="Medical"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Medical
                    </option>
                    <option
                      value="Love"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Love
                    </option>
                    <option
                      value="Affair"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Affair
                    </option>
                    <option
                      value="Break Up"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Break Up
                    </option>
                    <option
                      value="Ex"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Ex
                    </option>
                    <option
                      value="Hyper Thinking"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Hyper Thinking
                    </option>
                  </select>
                </dd>

                <dt>Category Strength</dt>
                <dd>
                  <select
                    name="category_strength"
                    value={formData.category_strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Category Strength
                    </option>
                    <option
                      value="1"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      1
                    </option>
                    <option
                      value="1.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      1.5
                    </option>
                    <option
                      value="2"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      2
                    </option>
                    <option
                      value="2.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      2.5
                    </option>
                    <option
                      value="3"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      3
                    </option>
                    <option
                      value="3.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      3.5
                    </option>
                    <option
                      value="4"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      4
                    </option>
                    <option
                      value="4.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      4.5
                    </option>
                    <option
                      value="5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      5
                    </option>
                    <option
                      value="5.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      5.5
                    </option>
                    <option
                      value="6"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      6
                    </option>
                    <option
                      value="6.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      6.5
                    </option>
                    <option
                      value="7"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      7
                    </option>
                    <option
                      value="7.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      7.5
                    </option>
                    <option
                      value="8"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      8
                    </option>
                    <option
                      value="8.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      8.5
                    </option>
                    <option
                      value="9"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      9
                    </option>
                    <option
                      value="9.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      9.5
                    </option>
                    <option
                      value="10"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      10
                    </option>
                  </select>
                </dd>

                <dt>Subcategory Strength</dt>
                <dd>
                  <select
                    name="subcategory_strength"
                    value={formData.subcategory_strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Subcategory Strength
                    </option>
                    <option
                      value="1"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      1
                    </option>
                    <option
                      value="1.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      1.5
                    </option>
                    <option
                      value="2"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      2
                    </option>
                    <option
                      value="2.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      2.5
                    </option>
                    <option
                      value="3"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      3
                    </option>
                    <option
                      value="3.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      3.5
                    </option>
                    <option
                      value="4"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      4
                    </option>
                    <option
                      value="4.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      4.5
                    </option>
                    <option
                      value="5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      5
                    </option>
                    <option
                      value="5.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      5.5
                    </option>
                    <option
                      value="6"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      6
                    </option>
                    <option
                      value="6.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      6.5
                    </option>
                    <option
                      value="7"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      7
                    </option>
                    <option
                      value="7.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      7.5
                    </option>
                    <option
                      value="8"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      8
                    </option>
                    <option
                      value="8.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      8.5
                    </option>
                    <option
                      value="9"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      9
                    </option>
                    <option
                      value="9.5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      9.5
                    </option>
                    <option
                      value="10"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      10
                    </option>
                  </select>
                </dd>

                <dt>Image</dt>
                <dd>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control w-50"
                  />
                </dd>

                <dt>Description</dt>
                <dd>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                  ></textarea>
                </dd>
              </dl>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="bi bi-check-lg btn btn-outline-success mt-3"
                onClick={handleSubmit}
              >
                {" "}
                Save changes
              </button>
              <button
                type="button"
                className="bi bi-x-lg btn btn-outline-danger mt-3"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                {" "}
                Cancel
              </button>
            </div>
          </div>
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
                <h5>
                  Profession:-{" "}
                  <span style={{ color: "blue" }}>{u.profasion}</span>
                </h5>
                <p className="fw-semibold" style={{ fontSize: "1.1rem" }}>
                  Category:-{" "}
                  <span style={{ color: "grey", fontSize: "1.1rem" }}>
                    {u.category}
                  </span>
                </p>
              </div>
            ))}
            <p className="fw-bold">
              {user.map((u, index) => (
                <div key={index}>
                  <span>{u.category_strength}</span>
                  <meter
                    min="1"
                    max="10"
                    value={u.category_strength}
                    low="5" // Set threshold for yellow range (5-7)
                    high="8" // Set threshold for red range (8-10)
                    optimum="4" // Optimum level considered as 4 (green range)
                    className={`w-50 ms-2 ${
                      u.category_strength <= 4
                        ? "green-meter"
                        : u.category_strength <= 7
                        ? "yellow-meter"
                        : "red-meter"
                    }`}
                  ></meter>
                </div>
              ))}
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
                // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                        onClick={handleOpenModal}
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
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
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
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                        onClick={handleOpenModal}
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
              {user.map((u, index) => (
                <p style={{ textAlign: "justify" }}>{u.description}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mb-5">
            <h3>
              Category{" "}
              {user.map((u, index) => (
                <button
                  key={index} // Add unique key for each button in map
                  className={`btn mt-3 ms-4 w-25 ${
                    u.category_strength <= 4
                      ? "btn-outline-success"
                      : u.category_strength <= 7
                      ? "btn-outline-warning"
                      : "btn-outline-danger"
                  }`}
                >
                  {u.category_strength <= 4
                    ? "Primary"
                    : u.category_strength <= 7
                    ? "Secondary"
                    : "Danger"}
                </button>
              ))}
            </h3>
            {user.map((u, index) => (
              <div>
                <p className="text-primary">{u.category}</p>
                <p className="fw-bold">
                  {user.map((u, index) => (
                    <div key={index}>
                      <span>{u.category_strength}</span>
                      <meter
                        min="1"
                        max="10"
                        value={u.category_strength}
                        low="5" // Set threshold for yellow range (5-7)
                        high="8" // Set threshold for red range (8-10)
                        optimum="4" // Optimum level considered as 4 (green range)
                        className={`w-50 ms-2 ${
                          u.category_strength <= 4
                            ? "green-meter"
                            : u.category_strength <= 7
                            ? "yellow-meter"
                            : "red-meter"
                        }`}
                      ></meter>
                    </div>
                  ))}
                </p>
                <hr className="w-75"></hr>
                <h3>
                  Sub-Category{" "}
                  {user.map((u, index) => (
                    <button
                      key={index} // Add unique key for each button in map
                      className={`btn mt-3 ms-4 w-25 ${
                        u.subcategory_strength <= 4
                          ? "btn-outline-success"
                          : u.subcategory_strength <= 7
                          ? "btn-outline-warning"
                          : "btn-outline-danger"
                      }`}
                    >
                      {u.subcategory_strength <= 4
                        ? "Primary"
                        : u.subcategory_strength <= 7
                        ? "Secondary"
                        : "Danger"}
                    </button>
                  ))}
                </h3>
                <p className="text-primary">{u.sub_category}</p>
                <p className="fw-bold">
                  {user.map((u, index) => (
                    <div key={index}>
                      <span>{u.subcategory_strength}</span>
                      <meter
                        min="1"
                        max="10"
                        value={u.subcategory_strength}
                        low="5" // Set threshold for yellow range (5-7)
                        high="8" // Set threshold for red range (8-10)
                        optimum="4" // Optimum level considered as 4 (green range)
                        className={`w-50 ms-2 ${
                          u.subcategory_strength <= 4
                            ? "green-meter"
                            : u.subcategory_strength <= 7
                            ? "yellow-meter"
                            : "red-meter"
                        }`}
                      ></meter>
                    </div>
                  ))}
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
              {user.map((u, index) => (
                <div key={index} className="user-info">
                  <img
                    className="mb-3"
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
              {user.map((u, index) => (
                <p key={index} className="bi bi-chat-quote-fill">
                  {" "}
                  {u.notification}
                </p>
              ))}

              <div className="dialog-actions">
                <button
                  className="reject-button bi bi-link"
                  onClick={HandleModalOpen}
                >
                  {" "}
                  Get Link
                </button>
                <button className="accept-button bi bi-send-check-fill">
                  {" "}
                  Send Link
                </button>
              </div>
            </div>
          </div>
        )}
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
