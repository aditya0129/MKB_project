import React, { useState, useEffect } from "react";
import "./advisor-profile-man-ki-baat_component.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
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
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { faStackExchange } from "@fortawesome/free-brands-svg-icons";

export function AdvisorProfileManKiBaatComponent({ advisor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [advisors, setAdvisors] = useState([]);
  const [user, setUser] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // State to store notification count
  const [formData, setFormData] = useState({
    Email: advisor?.Email || "",
    Number: advisor?.Number || "",
    City: advisor?.City || "",
    State: advisor?.State || "",
    Expertise: advisor?.Expertise || "",
    Experience: advisor?.Experience || "",
    Language: advisor?.Language || "",
    About: advisor?.About || "",
    Analytical_Strength: advisor?.Analytical_Strength || "",
    Problem_Solving_Strength: advisor?.Problem_Solving_Strength || "",
    Public_Speaking_Strength: advisor?.Public_Speaking_Strength || "",
    Adaptable_Strength: advisor?.Adaptable_Strength || "",
    Communication_Strength: advisor?.Communication_Strength || "",
    P_S_Strength: advisor?.P_S_Strength || "",
    Leadership_Experience_Strength:
      advisor?.Leadership_Experience_Strength || "",
    Goal: advisor?.Goal || "",
    Image: null,
  });
  // State to control the visibility of the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [show, setShow] = useState(false);
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
        // Set the notification count to the number of users fetched
        setNotificationCount(response.data.data.length);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      }
    }

    fetchUser();
  }, []);

  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [userDatas, setUserDatas] = useState([]); // Holds advisor data
  const [selectedUserId, setSelectedUserId] = useState(""); // Selected advisorId
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUserData, setFilteredUserData] = useState([]);

  // Function to fetch advisors and store their data
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/User_All_Data");
      const users = response.data.Data;

      if (users.length > 0) {
        // Store advisor data with id and name
        const userList = users.map((user) => ({
          id: user.userId,
          name: user.name, // Assuming name field exists
        }));
        setUserDatas(userList);
      } else {
        alert("No Users Found.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Error Fetching Users.");
    }
  };

  // Function to open the modal and fetch advisors
  const handleOpenModal = () => {
    setShowModal(true);
    fetchUsers(); // Fetch users when the modal is opened
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const acceptNotifications = async () => {
    try {
      if (!selectedUserId) {
        alert("Please Select An User Before Sending A Notification.");
        return;
      }

      const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage

      if (!token) {
        alert("Please Login To Send A Notification.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/Accept/${selectedUserId}`,
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
        setSelectedUserId(""); // Clear selected user after success
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
    const filtered = userDatas.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUserData(filtered);
  }, [searchTerm, userDatas]);

  const rejectNotifications = async () => {
    try {
      // Retrieve the token from local storage
      let token = localStorage.getItem("token");
      console.log("Token from local storage:", token);

      // Make a GET request to get the user's profile
      let profileResponse = await axios.get(
        "http://localhost:3001/get_user/profile",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log("Profile Response:", profileResponse);

      // Update the token if needed
      if (profileResponse.data.token) {
        token = profileResponse.data.token; // Update the token variable
        localStorage.setItem("token", token); // Store the new token in local storage
        console.log("Updated Token stored in local storage:", token);
      }

      // Make a POST request to send the notification
      let notificationResponse = await axios.post(
        "http://localhost:3001/Reject",
        {}, // Provide a body here if needed
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      console.log("Notification Response:", notificationResponse);

      // Show alert on successful notification send
      if (notificationResponse.status === 200) {
        alert("Successfully Sent Notification To User.");
      } else {
        alert("Notification Was Not Sent. Please Try Again.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error Sending Notification. Please Check Console For Details.");
    }
  };

  const busyNotifications = async () => {
    try {
      // Retrieve the token from local storage
      let token = localStorage.getItem("token");
      console.log("Token from local storage:", token);

      // Make a GET request to get the user's profile
      let profileResponse = await axios.get(
        "http://localhost:3001/get_user/profile",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log("Profile Response:", profileResponse);

      // Update the token if needed
      if (profileResponse.data.token) {
        token = profileResponse.data.token; // Update the token variable
        localStorage.setItem("token", token); // Store the new token in local storage
        console.log("Updated Token stored in local storage:", token);
      }

      // Make a POST request to send the notification
      let notificationResponse = await axios.post(
        "http://localhost:3001/Busy",
        {}, // Provide a body here if needed
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      console.log("Notification Response:", notificationResponse);

      // Show alert on successful notification send
      if (notificationResponse.status === 200) {
        alert("Successfully Sent Notification To User.");
      } else {
        alert("Notification Was Not Sent. Please Try Again.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error Sending Notification. Please check console For Details.");
    }
  };

  // Function to handle viewing notifications
  const handleViewNotifications = () => {
    setIsDialogOpen(true);
    setNotificationCount(0); // Reset the count when viewing notifications
  };

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, Image: e.target.files[0] }));
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
        `http://localhost:3001/AdvisorUpdateProfile`,
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

  const [numbers, setNumbers] = useState([]);
  const [useErrors, setUseErrors] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/Advisor_All_Data")
      .then((response) => {
        setNumbers(response.data.Data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function normalizePhoneNumber(inputNumber) {
    const numberStr = String(inputNumber);

    const strippedNumber = numberStr.replace(/[^\d]/g);

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
      const dbNumber = normalizePhoneNumber(user.Number);
      if (dbNumber === enteredNumber) {
        setUseErrors("Advisor Number Taken - Try Another");
        return;
      }
    }
    setUseErrors("");
  }

  const [email, setEmail] = useState([]);
  const [useError, setUseError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/Advisor_All_Data")
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
      if (user.Email === e.target.value) {
        setUseError("Advisor Email Taken - Try Another");
        return;
      }
    }
    setUseError("");
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
                >
                  <a className="dropdown-item text-center border border-1">
                    All Advisor
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Stress
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Anxiety
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Elicit
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Job
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Law
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Marriage
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Social Issues
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Kisan
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Property
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Education
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Carrer
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Medical
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Love
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Affair
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Break Up
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Ex
                  </a>
                  <a className="dropdown-item text-center border border-1">
                    Hyper Thinking
                  </a>
                </div>
                {/* <li
                  onClick={handleOpenDialog}
                  className="open-dialog-button ms-3"
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
                    className="ms-2"
                    style={{ color: "white" }}
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
                {advisors.map((advisor, index) => (
                  <img
                    key={index}
                    className="ms-3 mt-2"
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
                  onClick={handleShow}
                  style={{
                    color: "white",
                    cursor: "pointer",
                  }}
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

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-person-circle">
            {" "}
            Select User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="advisorSearch">
            <Form.Label>Search User</Form.Label>
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
            <Form.Label>Select User</Form.Label>
            <Form.Control
              as="select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="text-white"
              style={{ backgroundColor: "black" }}
            >
              <option
                value=""
                className="text-white"
                style={{ backgroundColor: "black" }}
              >
                -- Select User --
              </option>
              {filteredUserData.map((user) => (
                <option
                  className="text-white"
                  key={user.id}
                  value={user.id}
                  style={{ backgroundColor: "black" }}
                >
                  {user.name} (ID: {user.id})
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
            onClick={acceptNotifications}
          >
            {" "}
            Send Notification
          </Button>
        </Modal.Footer>
      </Modal>

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
          <span className="bi bi-pencil-square"> Update-Profile</span>
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
                    name="Email"
                    value={formData.Email}
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
                    name="Number"
                    value={formData.Number}
                    onChange={(e) => {
                      handleChange(e);
                      VerifyNumber(e.target.value);
                    }}
                    className="form-control"
                  />
                </dd>
                {useErrors && <div className="text-danger">{useErrors}</div>}

                <dt>City</dt>
                <dd>
                  <input
                    type="text"
                    name="City"
                    value={formData.City}
                    onChange={handleChange}
                    className="form-control"
                  />
                </dd>

                <dt>State</dt>
                <dd>
                  <select
                    name="State"
                    value={formData.State}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select State
                    </option>
                    <option
                      value="Andhra Pradesh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Andhra Pradesh
                    </option>
                    <option
                      value="Arunachal Pradesh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Arunachal Pradesh
                    </option>
                    <option
                      value="Assam"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Assam
                    </option>
                    <option
                      value="Bihar"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Bihar
                    </option>
                    <option
                      value="Chhattisgarh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Chhattisgarh
                    </option>
                    <option
                      value="Goa"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Goa
                    </option>
                    <option
                      value="Gujarat"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Gujarat
                    </option>
                    <option
                      value="Haryana"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Haryana
                    </option>
                    <option
                      value="Himachal Pradesh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Himachal Pradesh
                    </option>
                    <option
                      value="Jharkhand"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Jharkhand
                    </option>
                    <option
                      value="Karnataka"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Karnataka
                    </option>
                    <option
                      value="Kerala"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kerala
                    </option>
                    <option
                      value="Madhya Pradesh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Madhya Pradesh
                    </option>
                    <option
                      value="Maharashtra"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Maharashtra
                    </option>
                    <option
                      value="Manipur"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Manipur
                    </option>
                    <option
                      value="Meghalaya"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Meghalaya
                    </option>
                    <option
                      value="Mizoram"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Mizoram
                    </option>
                    <option
                      value="Nagaland"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Nagaland
                    </option>
                    <option
                      value="Odisha"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Odisha
                    </option>
                    <option
                      value="Punjab"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Punjab
                    </option>
                    <option
                      value="Rajasthan"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Rajasthan
                    </option>
                    <option
                      value="Sikkim"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Sikkim
                    </option>
                    <option
                      value="Tamil Nadu"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Tamil Nadu
                    </option>
                    <option
                      value="Telangana"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Telangana
                    </option>
                    <option
                      value="Tripura"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Tripura
                    </option>
                    <option
                      value="Uttar Pradesh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Uttar Pradesh
                    </option>
                    <option
                      value="Uttarakhand"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Uttarakhand
                    </option>
                    <option
                      value="West Bengal"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      West Bengal
                    </option>
                    <option
                      value="Andaman and Nicobar Islands"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Andaman and Nicobar Islands
                    </option>
                    <option
                      value="Chandigarh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Chandigarh
                    </option>
                    <option
                      value="Dadra and Nagar Haveli and Daman and Diu"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Dadra and Nagar Haveli and Daman and Diu
                    </option>
                    <option
                      value="Lakshadweep"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Lakshadweep
                    </option>
                    <option
                      value="Delhi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Delhi
                    </option>
                    <option
                      value="Puducherry"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Puducherry
                    </option>
                  </select>
                </dd>

                <dt>Expertise</dt>
                <dd>
                  <select
                    name="Expertise"
                    value={formData.Expertise}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Expertise
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

                <dt>Experience</dt>
                <dd>
                  <select
                    name="Experience"
                    value={formData.Experience}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Experience
                    </option>
                    <option
                      value="1 Yrs"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      1 Yrs
                    </option>
                    <option
                      value="2 Yrs"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      2 Yrs
                    </option>
                    <option
                      value="3 Yrs"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      3 Yrs
                    </option>
                    <option
                      value="4 Yrs"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      4 Yrs
                    </option>
                    <option
                      value="5 Yrs"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      5 Yrs
                    </option>
                  </select>
                </dd>

                <dt>Language</dt>
                <dd>
                  <select
                    name="Language"
                    value={formData.Language}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Language
                    </option>
                    <option
                      value="Hindi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Hindi
                    </option>
                    <option
                      value="English"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      English
                    </option>
                    <option
                      value="Bengali"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Bengali
                    </option>
                    <option
                      value="Telugu"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Telugu
                    </option>
                    <option
                      value="Marathi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Marathi
                    </option>
                    <option
                      value="Tamil"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Tamil
                    </option>
                    <option
                      value="Urdu"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Urdu
                    </option>
                    <option
                      value="Gujarati"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Gujarati
                    </option>
                    <option
                      value="Malayalam"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Malayalam
                    </option>
                    <option
                      value="Kannada"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kannada
                    </option>
                    <option
                      value="Odia"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Odia
                    </option>
                    <option
                      value="Punjabi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Punjabi
                    </option>
                    <option
                      value="Assamese"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Assamese
                    </option>
                    <option
                      value="Maithili"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Maithili
                    </option>
                    <option
                      value="Bhili/Bhilodi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Bhili/Bhilodi
                    </option>
                    <option
                      value="Santali"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Santali
                    </option>
                    <option
                      value="Kashmiri"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kashmiri
                    </option>
                    <option
                      value="Nepali"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Nepali
                    </option>
                    <option
                      value="Gondi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Gondi
                    </option>
                    <option
                      value="Sindhi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Sindhi
                    </option>
                    <option
                      value="Konkani"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Konkani
                    </option>
                    <option
                      value="Dogri"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Dogri
                    </option>
                    <option
                      value="Khandeshi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Khandeshi
                    </option>
                    <option
                      value="Kurukh"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kurukh
                    </option>
                    <option
                      value="Tulu"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Tulu
                    </option>
                    <option
                      value="Meitei (Manipuri)"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Meitei (Manipuri)
                    </option>
                    <option
                      value="Bodo"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Bodo
                    </option>
                    <option
                      value="Khasi"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Khasi
                    </option>
                    <option
                      value="Mundari"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Mundari
                    </option>
                    <option
                      value="Ho"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Ho
                    </option>
                    <option
                      value="Kui"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Kui
                    </option>
                  </select>
                </dd>

                <dt>About</dt>
                <dd>
                  <textarea
                    name="About"
                    value={formData.About}
                    onChange={handleChange}
                    className="form-control"
                  ></textarea>
                </dd>

                <dt>Analytical Strength</dt>
                <dd>
                  <select
                    name="Analytical_Strength"
                    value={formData.Analytical_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Analytical Strength
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

                <dt>Problem Solving Strength</dt>
                <dd>
                  <select
                    name="Problem_Solving_Strength"
                    value={formData.Problem_Solving_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Problem Solving Strength
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

                <dt>Public Speaking Strength</dt>
                <dd>
                  <select
                    name="Public_Speaking_Strength"
                    value={formData.Public_Speaking_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Public Speaking Strength
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

                <dt>Adaptable Strength</dt>
                <dd>
                  <select
                    name="Adaptable_Strength"
                    value={formData.Adaptable_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Adaptable Strength
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

                <dt>Communication Strength</dt>
                <dd>
                  <select
                    name="Communication_Strength"
                    value={formData.Communication_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Communication Strength
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

                <dt>P S Strength</dt>
                <dd>
                  <select
                    name="P_S_Strength"
                    value={formData.P_S_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select P S Strength
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

                <dt>Leadership Experience Strength</dt>
                <dd>
                  <select
                    name="Leadership_Experience_Strength"
                    value={formData.Leadership_Experience_Strength}
                    onChange={handleChange}
                    className="form-control w-50"
                    style={{ cursor: "pointer" }}
                  >
                    <option
                      value=""
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select Leadership Experience Strength
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
                    name="Image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control w-50"
                  />
                </dd>

                <dt>Goal</dt>
                <dd>
                  <textarea
                    name="Goal"
                    value={formData.Goal}
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
            {advisors.map((advisor, index) => (
              <p>{advisor.About}</p>
            ))}
          </div>
          <div>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <h4>PERSONALITY</h4>
                  {advisors.map((advisor, index) => (
                    <div key={index}>
                      <p>
                        Analytical{" "}
                        <progress
                          min="1"
                          max="10"
                          value={advisor.Analytical_Strength}
                          className="ms-2"
                        ></progress>
                      </p>
                      <p>
                        Problem Solving{" "}
                        <progress
                          min="1"
                          max="10"
                          value={advisor.Problem_Solving_Strength}
                          className="ms-2"
                        ></progress>
                      </p>
                      <p>
                        Public Speaking{" "}
                        <progress
                          min="1"
                          max="10"
                          value={advisor.Public_Speaking_Strength}
                          className="ms-2"
                        ></progress>
                      </p>
                      <p>
                        Adaptable{" "}
                        <progress
                          min="1"
                          max="10"
                          value={advisor.Adaptable_Strength}
                          className="ms-2"
                        ></progress>
                      </p>
                    </div>
                  ))}
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
                  {advisors.map((advisor, index) => (
                    <div key={index}>
                      <p>Communication</p>
                      <meter
                        min="1"
                        max="10"
                        value={advisor.Communication_Strength} // Dynamic value for Communication
                        className={`w-75 mb-3 ${
                          advisor.Communication_Strength <= 4
                            ? "red-meter"
                            : advisor.Communication_Strength <= 7
                            ? "yellow-meter"
                            : "green-meter"
                        }`}
                      ></meter>

                      <p>Problem Solving</p>
                      <meter
                        min="1"
                        max="10"
                        value={advisor.P_S_Strength} // Dynamic value for Problem Solving
                        className={`w-75 mb-3 ${
                          advisor.P_S_Strength <= 4
                            ? "red-meter"
                            : advisor.P_S_Strength <= 7
                            ? "yellow-meter"
                            : "green-meter"
                        }`}
                      ></meter>

                      <p>Leadership Experience</p>
                      <meter
                        min="1"
                        max="10"
                        value={advisor.Leadership_Experience_Strength} // Dynamic value for Leadership
                        className={`w-75 mb-3 ${
                          advisor.Leadership_Experience_Strength <= 4
                            ? "red-meter"
                            : advisor.Leadership_Experience_Strength <= 7
                            ? "yellow-meter"
                            : "green-meter"
                        }`}
                      ></meter>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center">
              <h4>GOAL</h4>
              <hr className="w-25 d-flex justify-content-center m-auto mb-3"></hr>
              {advisors.map((advisor, index) => (
                <p>{advisor.Goal}</p>
              ))}
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

      {/* <div className="notification-page">
        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h3>Notification</h3>
              {user.map((u, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/${u.image}`}
                  alt=""
                />
              ))}

              {advisors.map((advisor, index) => (
                <p key={index}>{advisor.Notification}</p>
              ))}
              <div className="dialog-actions">
                <button onClick={handleAccept} className="accept-button">
                  Accept
                </button>

                <button onClick={handleReject} className="reject-button">
                  Reject
                </button>

                <button onClick={handleBusy} className="busy-button">
                  Busy
                </button>
              </div>
            </div>
          </div>
        )}
      </div> */}

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

              {/* Displaying user information */}
              {advisors.map((advisor, index) => (
                <div key={index} className="user-info">
                  <img
                    className="mb-3"
                    src={`http://localhost:3001/${advisor.userDetails.image}`}
                    alt={advisor.userDetails.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                  />
                  <p>
                    <strong>Name:-</strong> {advisor.userDetails.name}
                  </p>
                  <p>
                    <strong>Gender:-</strong> {advisor.userDetails.gender}
                  </p>
                  <p>
                    <strong>Category:-</strong> {advisor.userDetails.category}
                  </p>
                  <p>
                    <strong>Sub-Category:-</strong>{" "}
                    {advisor.userDetails.sub_category}
                  </p>
                </div>
              ))}

              {/* Advisor Notifications */}
              {advisors.map((advisor, index) => (
                <p key={index}>{advisor.Notification}</p>
              ))}

              <div className="dialog-actions">
                {/* Accept Button */}
                <button onClick={handleOpenModal} className="accept-button">
                  Accept
                </button>
                {/* Reject Button */}
                <button onClick={rejectNotifications} className="reject-button">
                  Reject
                </button>
                {/* Busy Button */}
                <button onClick={busyNotifications} className="busy-button">
                  Busy
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
