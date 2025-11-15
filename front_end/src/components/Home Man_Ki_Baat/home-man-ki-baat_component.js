import React, { useState, useEffect } from "react";
import "./home-man-ki-baat_component.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPhone,
  faPowerOff,
  faComment,
  faVideo,
  faMinus,
  faPlus,
  faCircleUp,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";

export function HomeManKiBaatComponenet() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [cookies, removeCookie] = useCookies();
  const [expertise, setExpertise] = useState([]);
  const [user, setUser] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showInitialData, setShowInitialData] = useState(true); // State to control visibility of initial data
  // State to control the visibility of the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ShowModals, SetShowModals] = useState(false); // Controls modal visibility
  const [AdvisorDatas, SetAdvisorDatas] = useState([]); // Holds advisor data
  const [SelectedAdvisorId, SetSelectedAdvisorId] = useState(""); // Selected advisorId
  const [SearchTerm, SetSearchTerm] = useState("");
  const [FilteredAdvisorData, SetFilteredAdvisorData] = useState([]);
  const [roomId, setRoomId] = useState(""); // Holds the roomId
  const [wallet, setWallet] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 120, // Offset (in px) from the original trigger point
      once: true, // Ensure animations happen only once
    });
  }, []);

  useEffect(() => {
    if (cookies["token"] === undefined) {
      navigate("/register-case");
    }
  });

  useEffect(() => {
    async function fetchAdvisorExpertise() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/backend/User_Home/Advisor_detail`, {
          headers: {
            "x-auth-token": token,
          },
        });
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
        const response = await axios.get(`/backend/get_user/profile`, {
          headers: {
            "x-auth-token": token,
          },
        });
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
        const response = await axios.get(`/backend/Advisor_All_Data`);
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

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/advisor-search?name=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    } else {
      alert("Please Enter A Search Term.");
    }
  };

  // Function to fetch advisors and store their data
  const FetchAdvisors = async () => {
    try {
      const response = await axios.get("/backend/Advisor_All_Data");
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
        `/backend/sendLink/${SelectedAdvisorId}`,
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

  useEffect(() => {
    async function fetchWallet() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/backend/wallet`, {
          headers: {
            "x-auth-token": token,
          },
        });
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

  // const [link] = useState("http://127.0.0.1:3030/");
  /*  const token = localStorage.getItem("token");
  const socketServerUrl = process.env.NODE_ENV === "production"
    ? "/socket.io/"
    : "http://127.0.0.1:3030/";

  // Optionally append the token as a query parameter
  const redirectUrl = token ? `${socketServerUrl}?token=${token}` : null;

  const redirectToSocketServer = () => {
    if (!token) {
      alert("Please Login First. Token Not Found.");
      return;
    }

    if (!wallet || wallet.length === 0) {
      alert("Unable To Check Wallet Balance. Please Try Again.");
      return;
    }

    // Check if any wallet balance is 24 or below
    const hasLowBalance = wallet.some((b) => Number(b.walletBalance) <= 4);
    if (hasLowBalance) {
      alert(
        "Your Wallet Balance Is Too Low. Please Recharge Before Continuing."
      );
      return;
    }

    window.open(redirectUrl, "_blank"); // Open in new tab
  }; */
  /*   const [finalUrl, setFinalUrl] = useState(null);

  const socketServerUrl =
    process.env.NODE_ENV === "production"
      ? "https://myvideochat.space"
      : "http://127.0.0.1:3030";

  const redirectToSocketServer = async () => {
    try {
      // ✅ 1. Check wallet
      if (!wallet || wallet.length === 0) {
        alert("Unable to check wallet balance. Please try again.");
        return;
      }

      const hasLowBalance = wallet.some((b) => Number(b.walletBalance) <= 4);
      if (hasLowBalance) {
        alert(
          "Your wallet balance is too low. Please recharge before continuing."
        );
        return;
      }

      // ✅ 2. Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (!token) {
        alert("Missing token. Please log in again.");
        return;
      }

      // ✅ 3. Call backend to create a room (returns JSON)
      const response = await fetch(`${socketServerUrl}/api-b/create-room`, {
        method: "GET",
        credentials: "include", // important for cookies
        headers: {
          "x-auth-token": token, // extra safety
        },
      });

      const data = await response.json();

      if (!data.success || !data.redirectUrl || !data.roomId) {
        console.error("Invalid response from backend:", data);
        alert(data.message || "Failed to create room. Try again.");
        return;
      }

      // ✅ 4. Construct final room URL (no token in URL)
      const roomUrl = `${socketServerUrl}${data.redirectUrl}`;
      setFinalUrl(roomUrl);

      // ✅ 5. Open room in new tab
      window.open(roomUrl, "_blank");

      // ✅ 6. Connect to Socket.IO
      const socket = io(socketServerUrl, {
        path: "/socket.io/",
        transports: ["websocket"],
        withCredentials: true,
        //auth: { token },
        auth: { token: localStorage.getItem("token") }, // fallback
      });

      socket.on("connect", () => {
        console.log("✅ Connected to Socket.IO", socket.id);
        socket.emit(
          "join-room",
          data.roomId,
          socket.id,
          "User Name", // replace with actual user name if needed
          null,
          "user"
        );
      });

      socket.on("disconnect", () => {
        console.log("⚠️ Disconnected from Socket.IO server");
      });
    } catch (error) {
      console.error("Error redirecting:", error);
      alert("Something went wrong. Please try again.");
    }
  }; */

  const [finalUrl, setFinalUrl] = useState(null);

  const socketServerUrl =
    process.env.NODE_ENV === "production"
      ? "https://myvideochat.space"
      : "http://127.0.0.1:3030";

  const redirectToSocketServer = async () => {
    try {
      // ✅ 1. Check wallet
      if (!wallet || wallet.length === 0) {
        alert("Unable to check wallet balance. Please try again.");
        return;
      }

      const hasLowBalance = wallet.some((b) => Number(b.walletBalance) <= 4);
      if (hasLowBalance) {
        alert(
          "Your wallet balance is too low. Please recharge before continuing."
        );
        return;
      }

      // ✅ 2. Token check
      const token =
        localStorage.getItem("token") || localStorage.getItem("auth_token");

      if (!token) {
        alert("Missing token. Please log in again.");
        return;
      }

      // ✅ 3. Create room on backend
      const response = await fetch(`${socketServerUrl}/api-b/create-room`, {
        method: "GET",
        credentials: "include",
        headers: {
          "x-auth-token": token,
        },
      });

      const data = await response.json();

      if (!data.success || !data.redirectUrl || !data.roomId) {
        console.error("Invalid response from backend:", data);
        alert(data.message || "Failed to create room. Try again.");
        return;
      }

      // ✅ 4. Room URL
      const roomUrl = `${socketServerUrl}${data.redirectUrl}`;
      setFinalUrl(roomUrl);

      // ✅ 5. Open room page IN NEW TAB
      window.open(roomUrl, "_blank", "noopener,noreferrer");

      // ✅ NO SOCKET.IO HERE ❤️
      // ✅ NO join-room here
      // ✅ NO PeerJS here
    } catch (error) {
      console.error("Error redirecting:", error);
      alert("Something went wrong. Please try again.");
    }
  };

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

  // Convert Advisors for react-select
  const AdvisorOptions = FilteredAdvisorData.map((advisor) => ({
    value: advisor.id,
    label: advisor.name,
    image: `/backend/${advisor.image}`,
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
      {/* ***********************HEADER*************************** */}
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
                {/* {user.map((u, index) => (
                  <img
                    key={index}
                    className="ms-3 mt-2"
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
                /> */}
                <div className="profile-container">
                  {user.map((u, index) => (
                    <div key={index} className="profile-wrapper">
                      <div className="neon-ring"></div>
                      <img
                        src={`/backend/${u.image}`}
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

      {/* ***************************HOME****************************************** */}
      {/* <div className="container-fluid bg-primary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "100px" }}
        >
          <h3
            className="display-2 font-weight-bold text-white"
            style={{ fontFamily: "Edwardian  Script ITC" }}
            data-aos="zoom-in"
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
      </div> */}

      <div className="header-container mb-5">
        <div className="header-card" data-aos="zoom-in">
          <h3 className="header-title">
            <span className="header-icon">&#9884;</span> Home{" "}
            <span className="header-icon">&#9884;</span>
          </h3>
        </div>
      </div>

      {/* ********************************CONFIRM-LOGOUT************************ */}
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

      {/* *************************************GENERATE-VIDEO-LINK****************************** */}
      <Modal show={ShowModal} onHide={HandleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-link-45deg"> Room Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <p>
            Your Room Link is:{" "}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </p> */}

          <p>
            <strong>Your Room Link is: </strong>
            {finalUrl ? (
              <a
                href={finalUrl}
                onClick={(e) => {
                  e.preventDefault(); // stop normal link behaviour
                  // redirectToSocketServer();
                  window.open(finalUrl, "_blank"); // ✅ open existing room
                }}
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                Click here to open your room
              </a>
            ) : (
              <span style={{ color: "red" }}>
                Login required to generate link.
              </span>
            )}
          </p>
          <button
            className="bi bi-door-open"
            onClick={redirectToSocketServer}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {" "}
            Go to Room
          </button>
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

      {/* ******************************SEND ROOM ID NOTIFICATION******************** */}
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

      {/* ***********************************SCROLL-TO-TOP********************** */}
      {isVisible && (
        <div
          className={`scroll-to-top ${isClicked ? "animate-click" : ""}`} // Apply animation class on click
          onClick={scrollToTop}
        >
          <FontAwesomeIcon className="arrow-icon fs-2" icon={faCircleUp} />
        </div>
      )}

      {/* *************************ADVISOR-DATA************************* */}
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
                    style={
                      {
                        // borderTop: "8px solid blue",
                        // borderBottom: "8px solid cyan",
                      }
                    }
                    data-aos="zoom-in"
                    data-aos-delay="100"
                  >
                    <div className="card-body">
                      <div className="text-center">
                        <img
                          src={`/backend/${details.Image}`}
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
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
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
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
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
                    style={
                      {
                        // borderTop: "8px solid blue",
                        // borderBottom: "8px solid cyan",
                      }
                    }
                    data-aos="zoom-in"
                    data-aos-delay="200"
                  >
                    <div className="card-body">
                      <div className="text-center">
                        <img
                          src={`/backend/${details.Image}`}
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
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
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
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
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

      {/* *********************************NOTIFICATION-BOX*************************** */}
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
                    className="mb-3 m-auto"
                    src={`/backend/${u.advisorDetails.Image}`}
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
                {user.some(
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

      {/* **********************************FOOTER******************************** */}
      {/*  <div
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
      </div> */}

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
                  Made with ❤️ Idea and Concept - Deepesh, Programmed and Design
                  by Saurabh Karn and Aditya Prajapati
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
