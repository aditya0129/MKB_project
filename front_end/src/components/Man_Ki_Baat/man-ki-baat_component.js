import React from "react";
import "./man-ki-baat_component.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import AdvisorModal from "../Advisor Modal Man_Ki_Baat/advisor-modal-man-ki-baat_component.js";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faMessage,
  faEye,
  faPhoneVolume,
  faVideo,
  faWallet,
  faPowerOff,
  faChevronRight,
  faChevronLeft,
  faUserTie,
  faBell,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ManKiBaatComponent({ data, users }) {
  const [msgHovered, setMsgHovered] = useState(false);
  const [callHovered, setCallHovered] = useState(false);
  const [videoHovered, setVideoHovered] = useState(false);
  const [advMsgHovered, setAdvMsgHovered] = useState(false);
  const [advCallHovered, setAdvCallHovered] = useState(false);
  const [advVideoHovered, setAdvVideoHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [advisorData, setAdvisorData] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showInitialData, setShowInitialData] = useState(true); // State to control visibility of initial data
  // State to control the visibility of the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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

  useEffect(() => {
    async function fetchAdvisorExpertise() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3001/User_Home/Advisor_detail`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
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
        const response = await axios.get(`http://localhost:3001/wallet`, {
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
          image: advisor.Image,
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

  // const [link] = useState("http://127.0.0.1:3030/");
  const token = localStorage.getItem("token");
  const socketServerUrl = "http://127.0.0.1:3030/";

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
  };

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
          background:
            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ fontSize: "30px", color: "white" }}
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
          background:
            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ fontSize: "30px", color: "white" }}
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

  function handleAdvisorClick() {
    navigate("/advisor");
  }

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/advisor-search?name=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    } else {
      alert("Please Enter A Search Term.");
    }
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  const HandleOpenModals = (advisor) => {
    setSelectedAdvisor(advisor);
    setIsModalOpen(true);
  };

  const HandleCloseModals = () => {
    setIsModalOpen(false);
    setSelectedAdvisor(null);
  };

  const [ShowsModals, SetShowsModal] = useState(false);

  // Example call details
  const callDetails = {
    duration: "15 minutes",
    date: "2024-11-04",
    advisorName: "John Doe",
  };

  const HandleShowsModal = () => SetShowsModal(true);
  const HandleClosesModal = () => SetShowsModal(false);

  const [ShowingModal, SetShowingModal] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");

  const HandleShowsModals = () => SetShowingModal(true);
  const HandleClosesModals = () => SetShowingModal(false);
  const HandleSubmit = () => {
    console.log("Review:", review);
    console.log("Rating:", rating);
    SetShowsModal(false);
  };

  const [ShowingModals, SetShowingModals] = useState(false);

  // Sample data for history
  const historyData = [
    { date: "2024-11-04", activity: "Logged in" },
    { date: "2024-11-03", activity: "Updated profile" },
    { date: "2024-11-02", activity: "Make a call" },
  ];

  const HandleShowingModal = () => SetShowingModals(true);
  const HandleClosingModal = () => SetShowingModals(false);

  const [shows, setShows] = useState(false);

  // Modal toggle handlers
  const handleShows = () => setShows(true);
  const handleCloses = () => setShows(false);

  const [showingModal, setShowingModal] = useState(false);

  // Handle modal open
  const HandleShowingModals = () => {
    setShowingModal(true);
  };

  // Handle modal close
  const HandleClosingModals = () => {
    setShowingModal(false);
  };

  const [showingsModal, setShowingsModal] = useState(false);

  // Handle modal open
  const HandleShowingsModals = () => {
    setShowingsModal(true);
  };

  // Handle modal close
  const HandleClosingsModals = () => {
    setShowingsModal(false);
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

  const advisorOptions = filteredAdvisorData.map((advisor) => ({
    value: advisor.id,
    label: advisor.name,
    image: `http://localhost:3001/${advisor.image}`, // Advisor's image URL
  }));

  // Custom Option Renderer
  const customSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={data.image}
        alt={data.label}
        style={{ width: 70, height: 70, borderRadius: "50%", marginRight: 10 }}
      />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
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
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            marginRight: 10,
          }}
        />
        {data.label}
      </div>
    );
  };

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

  useEffect(() => {
    if (!wallet || wallet.length === 0) return;

    const hasLowBalance = wallet.some((b) => Number(b.walletBalance) <= 24);
    if (hasLowBalance) {
      const timer = setTimeout(() => {
        toast.warning(
          "Your Wallet Balance Is Low, Please Recharge Your Wallet.",
          {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          }
        );
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [wallet]);

  return (
    <>
      {/* *************************HEADER************************** */}
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
                /> */}
                <div className="profile-container">
                  {user.map((u, index) => (
                    <div key={index} className="profile-wrapper">
                      <div className="neon-ring"></div>
                      <img
                        src={`http://localhost:3001/${u.image}`}
                        alt="Profile"
                        className="profile-img"
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

      {/* ******************************USER-PROFILE******************************* */}
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
      </div> */}

      <div className="header-container mb-5">
        <div className="header-card" data-aos="zoom-in">
          <h3 className="header-title">
            <span className="header-icon">&#9884;</span> User-Profile{" "}
            <span className="header-icon">&#9884;</span>
          </h3>
          <div className="breadcrumb">
            <a href="/" className="breadcrumb-link">
              Home
            </a>
            <span className="breadcrumb-separator"> / </span>
            <span className="breadcrumb-current">User-Profile</span>
          </div>
        </div>
      </div>

      {/* ************************SEND-NOTIFICATION******************* */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title className="bi bi-person-circle">
            {" "}
            Select Advisor{" "}
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
            <Select
              options={advisorOptions}
              value={advisorOptions.find(
                (opt) => opt.value === selectedAdvisorId
              )}
              onChange={(selectedOption) =>
                setSelectedAdvisorId(selectedOption.value)
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
                SingleValue: customSingleValue,
                Option: customOption,
              }}
            />
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

      {/* ***************GENERATE-VIDEO-LINK***************************** */}
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
            {redirectUrl ? (
              <a
                href={redirectUrl}
                onClick={(e) => {
                  e.preventDefault(); // stop normal link behaviour
                  redirectToSocketServer();
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

      {/* *****************************SEND ROOM ID NOTIFICATION*********************** */}
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

      {/* *************************CONFIRM-LOGOUT******************************** */}
      <Modal show={show} onHide={handleClose}>
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

      {/* ******************UPDATE-PROFILE********************* */}
      <div
        className="container d-flex justify-content-center"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <button
          type="button"
          className="animated-gradient-button"
          data-bs-toggle="modal"
          data-bs-target="#updateProfileModal"
        >
          <span className="bi bi-pencil-square"></span> Update Profile
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
                <span className="bi bi-pencil-square"> Update Profile</span>
              </h3>
              <button
                type="button"
                className="btn-close bg-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <dl>
                <dt className="bi bi-envelope-at"> Email</dt>
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

                <dt className="bi bi-phone"> Number</dt>
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

                <dt className="bi bi-shop"> Place</dt>
                <dd>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    className="form-control"
                  />
                </dd>

                <dt className="bi bi-bookmarks"> Category</dt>
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
                      disabled
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

                <dt className="bi bi-bookmark-star"> Subcategory</dt>
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
                      disabled
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

                <dt className="bi bi-bookmarks"> Category Strength</dt>
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
                      disabled
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

                <dt className="bi bi-bookmark-star"> Subcategory Strength</dt>
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
                      disabled
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

                <dt className="bi bi-image"> Image</dt>
                <dd>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control w-50"
                  />
                </dd>

                <dt className="bi bi-clipboard2-data"> Description</dt>
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

      {/* *****************************SCROLL-TO-TOP*************************** */}
      {isVisible && (
        <div
          className={`scroll-to-top ${isClicked ? "animate-click" : ""}`} // Apply animation class on click
          onClick={scrollToTop}
        >
          <FontAwesomeIcon className="arrow-icon fs-2" icon={faCircleUp} />
        </div>
      )}

      {/* *****************USER-DETAIL********************* */}
      <div className="container">
        <div className="row">
          <div
            className="col-md-4 mt-5"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            {user.map((u, index) => (
              <img
                key={index}
                className="styled-image p-1"
                src={`http://localhost:3001/${u.image}`}
                alt=""
              />
            ))}
          </div>
          <div
            className="col-md-4 mt-5"
            data-aos="zoom-in"
            data-aos-delay="300"
            style={{
              background: "linear-gradient(135deg, #f3f3f3, #e6e6e6)",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            {user.map((u, index) => (
              <div key={index}>
                <h1 style={{ fontFamily: "Brush Script MT" }}>
                  {u.name}{" "}
                  <div className="location-pulse">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: "green", fontSize: "18px", zIndex: 1 }}
                    />
                  </div>{" "}
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
            <div className="fw-bold mb-3">
              {user.map((u, index) => (
                <div key={index}>
                  <span>{u.category_strength}</span>
                  <meter
                    className={`custom-meter ms-2 mb-1 ${
                      u.category_strength <= 4
                        ? "green-meter"
                        : u.category_strength <= 7
                        ? "yellow-meter"
                        : "red-meter"
                    }`}
                    style={{ "--meter-value": u.category_strength * 10 + "%" }}
                  ></meter>
                </div>
              ))}
            </div>
            <button
              className=""
              type="button"
              style={{
                background: msgHovered
                  ? "linear-gradient(135deg, blue, cyan)" // Hover effect for Msg
                  : "linear-gradient(135deg, cyan, blue)", // Default
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
                cursor: "pointer",
              }}
              onMouseEnter={() => setMsgHovered(true)}
              onMouseLeave={() => setMsgHovered(false)}
            >
              <FontAwesomeIcon className="me-2" icon={faMessage} />
              Msg
            </button>
            <button
              className="ms-2"
              type="button"
              style={{
                background: callHovered
                  ? "linear-gradient(135deg, blue, cyan)" // Hover effect for Call
                  : "linear-gradient(135deg, cyan, blue)", // Default
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
                cursor: "pointer",
              }}
              onMouseEnter={() => setCallHovered(true)}
              onMouseLeave={() => setCallHovered(false)}
            >
              <FontAwesomeIcon className="me-2" icon={faPhoneVolume} />
              Call
            </button>
            <button
              className="ms-2"
              type="button"
              style={{
                background: videoHovered
                  ? "linear-gradient(135deg, blue, cyan)" // Hover effect for Call
                  : "linear-gradient(135deg, cyan, blue)", // Default
                border: "none",
                borderRadius: "7px",
                width: "70px",
                height: "40px",
                color: "white",
                cursor: "pointer",
              }}
              onMouseEnter={() => setVideoHovered(true)}
              onMouseLeave={() => setVideoHovered(false)}
              onClick={HandleShowsModal}
            >
              <FontAwesomeIcon className="me-2" icon={faVideo} />
              Call
            </button>

            {/* *********************************VIDEO-CALL DETAILS********************** */}
            <Modal show={ShowsModals} onHide={HandleClosesModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="bi bi-camera-reels-fill me-2"></i>Call Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <strong className="bi bi-person-circle">
                    {" "}
                    Advisor Name:
                  </strong>{" "}
                  {callDetails.advisorName}
                </p>
                <p>
                  <strong className="bi bi-calendar-week-fill">
                    {" "}
                    Call Date:
                  </strong>{" "}
                  {callDetails.date}
                </p>
                <p>
                  <strong className="bi bi-stopwatch-fill">
                    {" "}
                    Call Duration:
                  </strong>{" "}
                  {callDetails.duration}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-danger" onClick={HandleClosesModal}>
                  <i className="bi bi-x-lg me-2"></i>Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* {wallet.map((balance, index) => (
              <p key={index} className="mt-4 fw-semibold fs-5">
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
            ))} */}

            {wallet.map((balance, index) => (
              <p key={index} className="mt-4 fw-semibold fs-5">
                <FontAwesomeIcon
                  icon={faWallet}
                  onClick={handleWalletClick}
                  style={{ cursor: "pointer", color: "brown" }}
                />{" "}
                <span
                  style={{
                    color: balance.walletBalance <= 24 ? "red" : "green",
                  }}
                >
                  ₹ {balance.walletBalance}/-
                </span>
                {balance.walletBalance <= 24 && (
                  <span
                    className="bi bi-exclamation-triangle-fill"
                    style={{
                      color: "red",
                      marginLeft: "10px",
                      fontSize: "14px",
                    }}
                  >
                    (Low Balance)
                  </span>
                )}
              </p>
            ))}

            <ToastContainer />

            <button
              className="btn btn-outline-success p-1 w-25 bi bi-yelp"
              onClick={HandleShowsModals}
            >
              Review
            </button>

            {/* **************************SUBMIT-REVIEW************************** */}
            <Modal show={ShowingModal} onHide={HandleClosesModals} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bi bi-yelp">
                  {" "}
                  Submit Your Review
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <label htmlFor="reviewInput" className="form-label">
                    Your Review
                  </label>
                  <textarea
                    className="form-control"
                    id="reviewInput"
                    rows="3"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="ratingInput" className="form-label">
                    Rating
                  </label>
                  <select
                    className="form-select w-50"
                    id="ratingInput"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option
                      value=""
                      disabled
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      Select a rating
                    </option>
                    <option
                      value="5"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      5 - Excellent
                    </option>
                    <option
                      value="4"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      4 - Good
                    </option>
                    <option
                      value="3"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      3 - Average
                    </option>
                    <option
                      value="2"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      2 - Poor
                    </option>
                    <option
                      value="1"
                      className="text-white"
                      style={{ backgroundColor: "black" }}
                    >
                      1 - Very Poor
                    </option>
                  </select>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-success"
                  className="bi bi-check-lg"
                  onClick={HandleSubmit}
                >
                  {" "}
                  Submit
                </Button>
                <Button
                  variant="outline-danger"
                  className="bi bi-x-lg"
                  onClick={HandleClosesModals}
                >
                  {" "}
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <span
              className="fw-semibold fs-6 ms-4"
              style={{ cursor: "pointer" }}
              onClick={HandleShowingModal}
            >
              <FontAwesomeIcon icon={faStackExchange} /> History
            </span>

            {/* ****************************ACTIVITY-HISTORY********************* */}
            <Modal show={ShowingModals} onHide={HandleClosingModal} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bi bi-clock-history">
                  {" "}
                  Activity History
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {historyData.length > 0 ? (
                  <ul className="list-group">
                    {historyData.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: "black" }}
                      >
                        <span className="text-white">{item.activity}</span>
                        <span className="text-white small">{item.date}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No history available.</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-danger"
                  className="bi bi-x-lg"
                  onClick={HandleClosingModal}
                >
                  {" "}
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <p
              className="mt-3"
              style={{ color: "darkgray", cursor: "pointer" }}
              onClick={handleShows}
            >
              <FontAwesomeIcon icon={faEye} /> Timeline{" "}
            </p>

            {/* ****************************TIMELINE-DETAILS********************* */}
            <Modal show={shows} onHide={handleCloses} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <FontAwesomeIcon icon={faEye} /> Timeline Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ul className="list-group">
                  <li
                    className="list-group-item text-white"
                    style={{ backgroundColor: "black" }}
                  >
                    <strong className="d-flex justify-content-center">
                      Event 1
                    </strong>
                    <p className="text-center">
                      <FontAwesomeIcon icon={faMessage} /> Start the message -
                      Jan 2024 - 08:20 pm
                    </p>
                  </li>
                  <li
                    className="list-group-item text-white"
                    style={{ backgroundColor: "black" }}
                  >
                    <strong className="d-flex justify-content-center">
                      Event 2
                    </strong>
                    <p className="text-center">
                      <FontAwesomeIcon icon={faPhoneVolume} /> Start the call -
                      Jun 2023 - 10:00 am
                    </p>
                  </li>
                  <li
                    className="list-group-item text-white"
                    style={{ backgroundColor: "black" }}
                  >
                    <strong className="d-flex justify-content-center">
                      Event 3
                    </strong>
                    <p className="text-center">
                      <FontAwesomeIcon icon={faVideo} /> Start the video-call -
                      Nov 2023 - 09:30 am
                    </p>
                  </li>
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-danger"
                  className="bi bi-x-lg"
                  onClick={handleCloses}
                >
                  {" "}
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          {/* ***************************ADVISOR-SLIDER-STYLE******************** */}
          <style>
            {`
          .slick-dots li button:before {
            font-size: 20px; /* Increase dot size */
            color: #1e3c72; /* Dot color */
            opacity: 1; /* Ensure dots are visible */
          }

          .slick-dots li.slick-active button:before {
            color: rgb(224, 5, 42); /* Color of the active dot */
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

          {/* ************************************ADVISOR-SLIDER********************* */}
          <Slider
            {...settings}
            style={{ width: "380px", margin: "0 auto", cursor: "pointer" }}
          >
            {showInitialData
              ? advisors.map((details, index) => (
                  <div
                    key={index}
                    onClick={() => HandleOpenModals(details)}
                    className="d-flex justify-content-center align-items-center flex-column mt-5 user"
                    data-aos="zoom-in"
                    data-aos-delay="400"
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
                    <div className="d-flex justify-content-center mt-3 mb-3">
                      <button
                        type="button"
                        style={{
                          background: advMsgHovered
                            ? "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))" // Hover effect for Msg
                            : "linear-gradient(-135deg, rgb(4, 4, 78), rgb(224, 5, 42))", // Default
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => setAdvMsgHovered(true)}
                        onMouseLeave={() => setAdvMsgHovered(false)}
                      >
                        <FontAwesomeIcon className="me-2" icon={faMessage} />
                        Msg
                      </button>
                      <button
                        type="button"
                        style={{
                          background: advCallHovered
                            ? "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))" // Hover effect for Msg
                            : "linear-gradient(-135deg, rgb(4, 4, 78), rgb(224, 5, 42))", // Default
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => setAdvCallHovered(true)}
                        onMouseLeave={() => setAdvCallHovered(false)}
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
                          background: advVideoHovered
                            ? "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))" // Hover effect for Msg
                            : "linear-gradient(-135deg, rgb(4, 4, 78), rgb(224, 5, 42))", // Default
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => setAdvVideoHovered(true)}
                        onMouseLeave={() => setAdvVideoHovered(false)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal();
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
                    onClick={() => HandleOpenModals(details)}
                    className="d-flex justify-content-center align-items-center flex-column mt-5 user"
                    data-aos="zoom-in"
                    data-aos-delay="500"
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
                    <div className="d-flex justify-content-center mt-3 mb-3">
                      <button
                        type="button"
                        style={{
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
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
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
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
                          background:
                            "linear-gradient(-135deg, rgb(224, 5, 42), rgb(4, 4, 78))",
                          border: "none",
                          borderRadius: "7px",
                          width: "70px",
                          height: "40px",
                          color: "white",
                          margin: "0 5px",
                          // boxShadow: "0 0 3px rgb(81, 80, 82)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal();
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

      {/* **************ADVISOR-DETAILS**************** */}
      <AdvisorModal
        isOpen={isModalOpen}
        advisor={selectedAdvisor}
        onClose={HandleCloseModals}
      />

      {/* **************************DESCRIPTION*********************** */}
      {/* <div
        className="container mt-5 description-container"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <div className="row">
          <div className="col-md-12">
            <div className="text-center p-2 description-header">
              <h3>Description</h3>
              <hr className="w-25 d-flex m-auto"></hr>
            </div>
            <div className="description-text">
              {user.map((u, index) => (
                <p key={index}>{u.description}</p>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* <div
        className="container mt-5 description-container"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <div className="row">
          <div className="col-md-12">
            <div className="text-center p-3 description-header">
              <h3
                style={{
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  display: "inline-block",
                }}
              >
                Description
              </h3>
              <hr
                style={{
                  width: "100px",
                  height: "3px",
                  background: "#2575fc",
                  border: "none",
                  margin: "10px auto",
                }}
              />
            </div>

            <div
              className="description-text p-4"
              style={{
                // background: "#f8f9fa",
                // padding: "20px",
                // borderRadius: "10px",
                // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                // fontSize: "18px",
                // lineHeight: "1.6",
                // color: "#444",
                background: "linear-gradient(135deg, #20bf55, #01baef)",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(1, 186, 239, 0.3)",
                fontSize: "18px",
                lineHeight: "1.6",
                color: "#fff", // White text for strong contrast
                textAlign: "center",
              }}
            >
              {user.map((u, index) => (
                <p key={index} style={{ marginBottom: "15px" }}>
                  {u.description}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      <div
        className="description-container"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <h3 className="description-title bi bi-journal-album"> Description</h3>
        <div className="description-grid">
          {user.map((u, index) => (
            <div key={index} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h4>! Hover to Reveal !</h4>
                </div>
                <div className="flip-card-back">
                  <p>{u.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ********************************CATEGORY-STRENGTH************************* */}
      <div className="container">
        <div className="row">
          <div
            className="col-md-6 mt-5 mb-5"
            data-aos="zoom-in"
            data-aos-delay="200"
            style={{
              background: "linear-gradient(135deg, #f3f3f3, #e6e6e6)",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 className="bi bi-bookmarks">
              Category{" "}
              {user.map((u, index) => (
                <button
                  key={index} // Add unique key for each button in map
                  className={`btn mt-3 ms-4 w-25 ${
                    u.category_strength <= 4
                      ? "btn-outline-success bi bi-1-circle"
                      : u.category_strength <= 7
                      ? "btn-outline-warning bi bi-2-circle"
                      : "btn-outline-danger bi bi-radioactive"
                  }`}
                  onClick={HandleShowingModals}
                >
                  {u.category_strength <= 4
                    ? " Primary"
                    : u.category_strength <= 7
                    ? " Secondary"
                    : " Danger"}
                </button>
              ))}
            </h3>

            {/* ******************************CATEGORY-DETAILS************************ */}
            <Modal show={showingModal} onHide={HandleClosingModals} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bi bi-bookmarks">
                  {" "}
                  Category Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body
                style={{
                  padding: "20px",
                  border: "12px solid white",
                }}
              >
                {user.map((u, index) => (
                  <div key={index} className="text-center">
                    <img
                      className="mb-3 m-auto"
                      src={`http://localhost:3001/${u.image}`}
                      alt=""
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "10px",
                        border: "2px solid white",
                      }}
                    />
                    <ul className="list-group">
                      <li
                        className="list-group-item text-white"
                        style={{ background: "black" }}
                      >
                        <h5 style={{ textShadow: "2px 3px 2px blue" }}>
                          <span className="bi bi-person-fill"> Name :-</span>{" "}
                          {u.name}
                        </h5>
                      </li>
                      <li
                        className="list-group-item text-white"
                        style={{ background: "black" }}
                      >
                        <h5 style={{ textShadow: "2px 3px 2px blue" }}>
                          <span className="bi bi-bookmarks-fill">
                            {" "}
                            Category :-
                          </span>{" "}
                          {u.category}
                        </h5>
                      </li>
                      <li
                        className="list-group-item text-white"
                        style={{ background: "black" }}
                      >
                        <div className="fw-bold">
                          <span style={{ textShadow: "2px 3px 2px blue" }}>
                            {u.category_strength}
                          </span>
                          <meter
                            className={`custom-meter ms-2 mb-1 ${
                              u.category_strength <= 4
                                ? "green-meter"
                                : u.category_strength <= 7
                                ? "yellow-meter"
                                : "red-meter"
                            }`}
                            value={u.category_strength}
                            max="10" // Assuming the maximum strength is 10
                            style={{
                              "--meter-value": `${u.category_strength * 10}%`,
                            }}
                          ></meter>
                          <span
                            className={`ms-2 ${
                              u.category_strength <= 4
                                ? "bi bi-1-circle text-success"
                                : u.category_strength <= 7
                                ? "bi bi-2-circle text-warning"
                                : "bi bi-radioactive text-danger"
                            }`}
                            style={{ fontSize: "1.2rem" }} // Adjust size as needed
                          ></span>
                        </div>
                      </li>
                    </ul>
                  </div>
                ))}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-danger"
                  className="bi bi-x-lg"
                  onClick={HandleClosingModals}
                >
                  {" "}
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            {user.map((u, index) => (
              <div key={index}>
                <p className="text-primary">{u.category}</p>
                {/* Wrap the next section in a div instead of p */}
                <div className="fw-bold">
                  {user.map((u, index) => (
                    <div key={index}>
                      <span>{u.category_strength}</span>
                      <meter
                        className={`custom-meter ms-2 mb-1 ${
                          u.category_strength <= 4
                            ? "green-meter"
                            : u.category_strength <= 7
                            ? "yellow-meter"
                            : "red-meter"
                        }`}
                        style={{
                          "--meter-value": u.category_strength * 10 + "%",
                        }}
                      ></meter>
                    </div>
                  ))}
                </div>
                <hr className="w-75"></hr>
                <h3 className="bi bi-bookmark-star">
                  Sub-Category{" "}
                  {user.map((u, index) => (
                    <button
                      key={index} // Add unique key for each button in map
                      className={`btn mt-3 ms-4 w-25 ${
                        u.subcategory_strength <= 4
                          ? "btn-outline-success bi bi-1-circle"
                          : u.subcategory_strength <= 7
                          ? "btn-outline-warning bi bi-2-circle"
                          : "btn-outline-danger bi bi-radioactive"
                      }`}
                      onClick={HandleShowingsModals}
                    >
                      {u.subcategory_strength <= 4
                        ? " Primary"
                        : u.subcategory_strength <= 7
                        ? " Secondary"
                        : " Danger"}
                    </button>
                  ))}
                </h3>

                {/* *****************************SUB-CATEGORY-DETAILS*************************** */}
                <Modal
                  show={showingsModal}
                  onHide={HandleClosingsModals}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="bi bi-bookmark-star">
                      {" "}
                      Sub-Category Details
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{
                      padding: "20px",
                      border: "12px solid white",
                    }}
                  >
                    {user.map((u, index) => (
                      <div key={index} className="text-center">
                        <img
                          className="mb-3 m-auto"
                          src={`http://localhost:3001/${u.image}`}
                          alt=""
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "10px",
                            border: "2px solid white",
                          }}
                        />
                        <ul className="list-group">
                          <li
                            className="list-group-item text-white"
                            style={{ background: "black" }}
                          >
                            <h5 style={{ textShadow: "2px 3px 2px blue" }}>
                              <span className="bi bi-person-fill">
                                {" "}
                                Name :-
                              </span>{" "}
                              {u.name}
                            </h5>
                          </li>
                          <li
                            className="list-group-item text-white"
                            style={{ background: "black" }}
                          >
                            <h5 style={{ textShadow: "2px 3px 2px blue" }}>
                              <span className="bi bi-bookmark-star">
                                {" "}
                                Sub-Category :-
                              </span>{" "}
                              {u.sub_category}
                            </h5>
                          </li>
                          <li
                            className="list-group-item text-white"
                            style={{ background: "black" }}
                          >
                            <div className="fw-bold">
                              <span style={{ textShadow: "2px 3px 2px blue" }}>
                                {u.subcategory_strength}
                              </span>
                              <meter
                                className={`custom-meter ms-2 mb-1 ${
                                  u.subcategory_strength <= 4
                                    ? "green-meter"
                                    : u.subcategory_strength <= 7
                                    ? "yellow-meter"
                                    : "red-meter"
                                }`}
                                value={u.subcategory_strength}
                                max="10" // Assuming the maximum strength is 10
                                style={{
                                  "--meter-value": `${
                                    u.subcategory_strength * 10
                                  }%`,
                                }}
                              ></meter>
                              <span
                                className={`ms-2 ${
                                  u.subcategory_strength <= 4
                                    ? "bi bi-1-circle text-success"
                                    : u.subcategory_strength <= 7
                                    ? "bi bi-2-circle text-warning"
                                    : "bi bi-radioactive text-danger"
                                }`}
                                style={{ fontSize: "1.2rem" }} // Adjust size as needed
                              ></span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="outline-danger"
                      className="bi bi-x-lg"
                      onClick={HandleClosingsModals}
                    >
                      {" "}
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <p className="text-primary">{u.sub_category}</p>
                {/* Again, wrap the next section in a div instead of p */}
                <div className="fw-bold">
                  {user.map((u, index) => (
                    <div key={index}>
                      <span>{u.subcategory_strength}</span>
                      <meter
                        className={`custom-meter ms-2 mb-1 ${
                          u.subcategory_strength <= 4
                            ? "green-meter"
                            : u.subcategory_strength <= 7
                            ? "yellow-meter"
                            : "red-meter"
                        }`}
                        style={{
                          "--meter-value": u.subcategory_strength * 10 + "%",
                        }}
                      ></meter>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ***********************************USER-DETAIL********************* */}
          {/* <div
            className="col-md-6 mt-5"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
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
      </div> */}

          <div
            className="col-md-6 mt-5"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            {user.map((u, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(135deg, #f3f3f3, #e6e6e6)",
                  padding: "23px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUserTie}
                    style={{
                      fontSize: "24px",
                      color: "#4A90E2",
                      marginRight: "10px",
                    }}
                  />
                  <h4 style={{ margin: 0, color: "#333" }}>About</h4>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px auto",
                    rowGap: "10px",
                    columnGap: "10px",
                    fontSize: "16px",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Phone:
                  </span>
                  <span style={{ color: "#007bff" }}>{u.number}</span>

                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Address:
                  </span>
                  <span>{u.place}</span>

                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Email:
                  </span>
                  <span style={{ color: "#007bff" }}>{u.email}</span>

                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Age:
                  </span>
                  <span style={{ color: "#007bff" }}>{u.age}</span>

                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Birthday:
                  </span>
                  <span>{u.birthdate}</span>

                  <span style={{ fontWeight: "bold", color: "#555" }}>
                    Gender:
                  </span>
                  <span>{u.gender}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* **************************NOTIFICATION-BOX********************* */}
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

      {/* ****************************************FOOTER************************** */}
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
