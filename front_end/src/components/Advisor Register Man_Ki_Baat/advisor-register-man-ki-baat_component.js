import React, { useState, useEffect } from "react";
import "./advisor-register-man-ki-baat_component.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Custom input component for PhoneInput
const CustomInputComponent = (props) => {
  const { country, value, onChange, ...rest } = props;
  const countryCode = "+" + PhoneInput.getCountryCallingCode(country);

  return (
    <div className="custom-input">
      <span className={`flag ${country.toLowerCase()}`}></span>
      <span className="country-code">{countryCode}</span>
      <input
        {...rest}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const expertiseOptions = [
  { value: "All", label: "All" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Stress", label: "Stress" },
  { value: "Love", label: "Love" },
  { value: "Affair", label: "Affair" },
  { value: "Breakup", label: "Breakup" },
  { value: "Elicit", label: "Elicit" },
  { value: "Job", label: "Job" },
  { value: "Law", label: "Law" },
  { value: "Marriage", label: "Marriage" },
  { value: "Social issues", label: "Social issues" },
  { value: "Kisan", label: "Kisan" },
  { value: "Property", label: "Property" },
  { value: "Ex", label: "Ex" },
  { value: "Education", label: "Education" },
  { value: "Career", label: "Career" },
  { value: "Medical", label: "Medical" },
  { value: "Hyper thinking", label: "Hyper thinking" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const experienceOptions = [
  { value: "1 Yrs", label: "1 Yrs" },
  { value: "2 Yrs", label: "2 Yrs" },
  { value: "3 Yrs", label: "3 Yrs" },
  { value: "4 Yrs", label: "4 Yrs" },
  { value: "5 Yrs", label: "5 Yrs" },
];

const animatedComponents = makeAnimated();

// List of Indian States
const indianStates = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
  {
    value: "Andaman and Nicobar Islands",
    label: "Andaman and Nicobar Islands",
  },
  { value: "Chandigarh", label: "Chandigarh" },
  {
    value: "Dadra and Nagar Haveli and Daman and Diu",
    label: "Dadra and Nagar Haveli and Daman and Diu",
  },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "Delhi", label: "Delhi" },
  { value: "Puducherry", label: "Puducherry" },
];

// List of Cities
const cities = [
  { value: "Port Blair", label: "Port Blair" },
  { value: "Visakhapatnam", label: "Visakhapatnam" },
  { value: "Vijayawada", label: "Vijayawada" },
  { value: "Guntur", label: "Guntur" },
  { value: "Nellore", label: "Nellore" },
  { value: "Kurnool", label: "Kurnool" },
  { value: "Itanagar", label: "Itanagar" },
  { value: "Naharlagun", label: "Naharlagun" },
  { value: "Pasighat", label: "Pasighat" },
  { value: "Guwahati", label: "Guwahati" },
  { value: "Silchar", label: "Silchar" },
  { value: "Dibrugarh", label: "Dibrugarh" },
  { value: "Jorhat", label: "Jorhat" },
  { value: "Samastipur", label: "Samastipur" },
  { value: "Patna", label: "Patna" },
  { value: "Gaya", label: "Gaya" },
  { value: "Bhagalpur", label: "Bhagalpur" },
  { value: "Muzaffarpur", label: "Muzaffarpur" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Raipur", label: "Raipur" },
  { value: "Bilaspur", label: "Bilaspur" },
  { value: "Bhilai", label: "Bhilai" },
  { value: "Daman", label: "Daman" },
  { value: "Silvassa", label: "Silvassa" },
  { value: "Delhi (New Delhi)", label: "Delhi (New Delhi)" },
  { value: "Panaji", label: "Panaji" },
  { value: "Vasco da Gama", label: "Vasco da Gama" },
  { value: "Margao", label: "Margao" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Surat", label: "Surat" },
  { value: "Vadodara", label: "Vadodara" },
  { value: "Rajkot", label: "Rajkot" },
  { value: "Faridabad", label: "Faridabad" },
  { value: "Gurgaon (Gurugram)", label: "Gurgaon (Gurugram)" },
  { value: "Panipat", label: "Panipat" },
  { value: "Ambala", label: "Ambala" },
  { value: "Shimla", label: "Shimla" },
  { value: "Solan", label: "Solan" },
  { value: "Dharamshala", label: "Dharamshala" },
  { value: "Srinagar", label: "Srinagar" },
  { value: "Jammu", label: "Jammu" },
  { value: "Anantnag", label: "Anantnag" },
  { value: "Ranchi", label: "Ranchi" },
  { value: "Jamshedpur", label: "Jamshedpur" },
  { value: "Dhanbad", label: "Dhanbad" },
  { value: "Bokaro Steel City", label: "Bokaro Steel City" },
  { value: "Bangalore (Bengaluru)", label: "Bangalore (Bengaluru)" },
  { value: "Mysore (Mysuru)", label: "Mysore (Mysuru)" },
  { value: "Mangalore", label: "Mangalore" },
  { value: "Hubli-Dharwad", label: "Hubli-Dharwad" },
  { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
  { value: "Kochi (Cochin)", label: "Kochi (Cochin)" },
  { value: "Kozhikode", label: "Kozhikode" },
  { value: "Thrissur", label: "Thrissur" },
  { value: "Kavaratti", label: "Kavaratti" },
  { value: "Bhopal", label: "Bhopal" },
  { value: "Indore", label: "Indore" },
  { value: "Jabalpur", label: "Jabalpur" },
  { value: "Gwalior", label: "Gwalior" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Pune", label: "Pune" },
  { value: "Nagpur", label: "Nagpur" },
  { value: "Thane", label: "Thane" },
  { value: "Imphal", label: "Imphal" },
  { value: "Shillong", label: "Shillong" },
  { value: "Aizawl", label: "Aizawl" },
  { value: "Kohima", label: "Kohima" },
  { value: "Bhubaneswar", label: "Bhubaneswar" },
  { value: "Cuttack", label: "Cuttack" },
  { value: "Rourkela", label: "Rourkela" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Ludhiana", label: "Ludhiana" },
  { value: "Amritsar", label: "Amritsar" },
  { value: "Jalandhar", label: "Jalandhar" },
  { value: "Patiala", label: "Patiala" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Udaipur", label: "Udaipur" },
  { value: "Jodhpur", label: "Jodhpur" },
  { value: "Kota", label: "Kota" },
  { value: "Gangtok", label: "Gangtok" },
  { value: "Chennai", label: "Chennai" },
  { value: "Coimbatore", label: "Coimbatore" },
  { value: "Madurai", label: "Madurai" },
  { value: "Tiruchirappalli (Trichy)", label: "Tiruchirappalli (Trichy)" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Warangal", label: "Warangal" },
  { value: "Nizamabad", label: "Nizamabad" },
  { value: "Karimnagar", label: "Karimnagar" },
  { value: "Agartala", label: "Agartala" },
  { value: "Lucknow", label: "Lucknow" },
  { value: "Kanpur", label: "Kanpur" },
  { value: "Agra", label: "Agra" },
  { value: "Varanasi", label: "Varanasi" },
  { value: "Dehradun", label: "Dehradun" },
  { value: "Haridwar", label: "Haridwar" },
  { value: "Roorkee", label: "Roorkee" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Asansol", label: "Asansol" },
  { value: "Siliguri", label: "Siliguri" },
  { value: "Durgapur", label: "Durgapur" },
];

// List of Indian language
const languageOptions = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Bengali", label: "Bengali" },
  { value: "Telugu", label: "Telugu" },
  { value: "Marathi", label: "Marathi" },
  { value: "Tamil", label: "Tamil" },
  { value: "Urdu", label: "Urdu" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Kannada", label: "Kannada" },
  { value: "Odia", label: "Odia" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Assamese", label: "Assamese" },
  { value: "Maithili", label: "Maithili" },
  { value: "Bhili/Bhilodi", label: "Bhili/Bhilodi" },
  { value: "Santali", label: "Santali" },
  { value: "Kashmiri", label: "Kashmiri" },
  { value: "Nepali", label: "Nepali" },
  { value: "Gondi", label: "Gondi" },
  { value: "Sindhi", label: "Sindhi" },
  { value: "Konkani", label: "Konkani" },
  { value: "Dogri", label: "Dogri" },
  { value: "Khandeshi", label: "Khandeshi" },
  { value: "Kurukh", label: "Kurukh" },
  { value: "Tulu", label: "Tulu" },
  { value: "Meitei (Manipuri)", label: "Meitei (Manipuri)" },
  { value: "Bodo", label: "Bodo" },
  { value: "Khasi", label: "Khasi" },
  { value: "Mundari", label: "Mundari" },
  { value: "Ho", label: "Ho" },
  { value: "Kui", label: "Kui" },
];

export function AdvisorRegisterManKiBaatComponent() {
  const navigate = useNavigate();
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    async function fetchStates() {
      try {
        // Normally, you would fetch cities from an API or a library that provides city data.
        // Since we are using static states, we will use the list of Indian states.
        setStateOptions(indianStates);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }

    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        // Normally, you would fetch cities from an API or a library that provides city data.
        // Since we are using static states, we will use the list of Indian states.
        setCityOptions(cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }

    fetchCities();
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#dd033a",
      borderColor: state.isFocused ? "#dd033a" : "#dd033a",
      "&:hover": {
        borderColor: "#dd033a",
      },
      boxShadow: state.isFocused ? null : null,
      color: "white",
      width: "103%",
      padding: "5px",
      borderRadius: "5px",
      outline: "none",
      transition: "0.3s",
      marginBottom: "10px",
      fontSize: "1em",
      cursor: "pointer",
      opacity: 0.8,
    }),
    input: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#dd033a",
        color: "white",
        cursor: "pointer",
      },
    }),
  };

  const inputStyles = {
    input: {
      width: "90%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #dd033a",
      backgroundColor: "#dd033a",
      color: "white",
      outline: "none",
      transition: "0.3s",
      height: "44px",
      fontSize: "1em",
      marginLeft: "35px",
      opacity: 0.8,
    },
  };

  const expertiseStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#45f3ff",
      borderColor: state.isFocused ? "#45f3ff" : "#45f3ff",
      "&:hover": {
        borderColor: "#45f3ff",
      },
      boxShadow: state.isFocused ? null : null,
      color: "white",
      width: "103%",
      padding: "5px",
      borderRadius: "5px",
      outline: "none",
      transition: "0.3s",
      marginBottom: "10px",
      fontSize: "1em",
      cursor: "pointer",
      opacity: 0.8,
    }),
    input: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#45f3ff",
        color: "white",
        cursor: "pointer",
      },
    }),
  };

  const datePickerCustomClass = {
    dateInput: {
      width: "135%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #dd033a",
      backgroundColor: "#dd033a",
      color: "white",
      outline: "none",
      transition: "0.3s",
      height: "44px",
      fontSize: "1em",
      cursor: "pointer",
      opacity: 0.8,
    },
  };

  const inputImage = {
    input: {
      width: "103%",
      padding: "9px",
      borderRadius: "5px",
      border: "1px solid #dd033a",
      backgroundColor: "#dd033a",
      color: "white",
      outline: "none",
      transition: "0.3s",
      height: "44px",
      fontSize: "1em",
      opacity: 0.8,
    },
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

  const [birthdate, setBirthdate] = useState(null);
  const [ageError, setAgeError] = useState("");

  function handleDateChange(date) {
    setBirthdate(date);
    const age = calculateAge(date);
    if (age < 18) {
      setAgeError("Advisor Should Be 18+");
    } else {
      setAgeError("");
    }
  }

  function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="box3 mb-5" id="body">
            <Formik
              initialValues={{
                Name: "",
                Email: "",
                Password: "",
                Number: "",
                Expertise: "",
                DOB: "",
                Gender: "",
                Experience: "",
                City: "",
                State: "",
                Language: "",
                Image: null,
              }}
              validationSchema={yup.object({
                Name: yup.string().required("Advisor Name Required"),
                Password: yup
                  .string()
                  .required("Password Required")
                  .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/,
                    "Password Must Be 8 to 15 Characters With An Uppercase Letter, Special Character, And Number"
                  ),
                Email: yup
                  .string()
                  .required("Email Required")
                  .email("Invalid Email"),
                Number: yup
                  .string()
                  .required("Mobile Required")
                  .matches(
                    /^((\+91)?|91)?[6789][0-9]{9}$/,
                    "Invalid Mobile Number"
                  ),
                Expertise: yup
                  .string()
                  // .min(1, "At least one expertise is required")
                  // .max(5, "You can select only five expertise areas")
                  .required("Expertise Is Required"),
                DOB: yup
                  .date()
                  // .nullable()
                  .required("Date Of Birth Is Required"),
                Gender: yup
                  .string()
                  .oneOf(["Male", "Female", "Other"], "Invalid Gender")
                  .required("Gender Is Required"),
                Experience: yup.string().required("Experience Is Required"),
                City: yup.string().required("City Is Required"),
                State: yup.string().required("State Is Required"),
                Language: yup.string().required("Language Is Required"),
                Image: yup
                  .mixed()
                  .required("Image Is Required")
                  .test(
                    "fileSize",
                    "File Size is too large",
                    (value) => value && value.size <= 1024 * 1024
                  )
                  .test(
                    "fileFormat",
                    "Unsupported Format",
                    (value) =>
                      value &&
                      ["image/jpeg", "image/png", "image/gif"].includes(
                        value.type
                      )
                  ),
              })}
              onSubmit={(values, { setSubmitting, setFieldValue }) => {
                const formData = new FormData();
                for (const key in values) {
                  formData.append(key, values[key]);
                }
                formData.append("Image", image);
                axios
                  .post("http://localhost:3001/Advisor_register", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((response) => {
                    alert("Registered Successfully...");
                    const { image } = response.data.user;
                    const imageUrl = `images/${image}`;
                    setFieldValue("Image", imageUrl);
                    navigate("/advisor-login");
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    alert("Registration Failed. Please Try Again.");
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form autoComplete="off">
                  <FontAwesomeIcon className="icon" icon={faUserTie} />
                  <h2>Sign up</h2>
                  <div className="inputBoxs">
                    <Field type="text" name="Name" />
                    <span>Name</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Name" />
                  </div>
                  <div className="mt-3">
                    <div className="">
                      <span style={{ color: "#dd033a", fontSize: "13px" }}>
                        Number
                      </span>
                      <i></i>
                      <PhoneInput
                        country={"in"}
                        inputStyle={inputStyles.input}
                        containerStyle={{ width: "100%" }}
                        inputExtraProps={{
                          component: CustomInputComponent,
                        }}
                        onChange={(value) => {
                          setFieldValue("Number", value);
                          VerifyNumber(value);
                        }}
                      />
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="Number" />
                    </div>
                  </div>
                  {useErrors && <div className="text-danger">{useErrors}</div>}
                  <div className="inputBoxs">
                    <Field type="text" onKeyUp={VerifyEmail} name="Email" />
                    <span>Email</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Email" />
                  </div>
                  {useError && <div className="text-danger">{useError}</div>}
                  <div id="inputBoxs" style={{ position: "relative" }}>
                    {/* <Field type="password" name="Password" /> */}
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="Password"
                    />
                    <span>Password</span>
                    <i></i>
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "7px",
                        top: "-7",
                        fontSize: "20px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "white",
                      }}
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Password" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#45f3ff", fontSize: "13px" }}>
                      Expertise
                    </span>
                    <Select
                      components={animatedComponents}
                      options={expertiseOptions}
                      styles={expertiseStyles}
                      name="Expertise"
                      className="basic-single-select"
                      classNamePrefix="select"
                      onChange={(option) =>
                        setFieldValue("Expertise", option.value)
                      }
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Expertise" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#dd033a", fontSize: "13px" }}>
                      Date of Birth
                    </span>
                    <DatePicker
                      name="DOB"
                      selected={values.DOB}
                      onChange={(date) => {
                        setFieldValue("DOB", date);
                        handleDateChange(date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select Date..."
                      className="form-control date-picker-placeholder"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={
                        <input style={datePickerCustomClass.dateInput} />
                      }
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="DOB" />
                  </div>
                  {ageError && <div className="text-danger">{ageError}</div>}
                  <div className="mt-3">
                    <span style={{ color: "#45f3ff", fontSize: "13px" }}>
                      Gender
                    </span>
                    <Select
                      options={genderOptions}
                      classNamePrefix="react-select"
                      placeholder="Select..."
                      styles={expertiseStyles}
                      onChange={(option) =>
                        setFieldValue("Gender", option.value)
                      }
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Gender" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#dd033a", fontSize: "13px" }}>
                      Experience
                    </span>
                    <Select
                      options={experienceOptions}
                      classNamePrefix="react-select"
                      placeholder="Select..."
                      styles={customStyles}
                      onChange={(option) =>
                        setFieldValue("Experience", option.value)
                      }
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Experience" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#45f3ff", fontSize: "13px" }}>
                      City
                    </span>
                    <Select
                      components={animatedComponents}
                      options={cityOptions}
                      styles={expertiseStyles}
                      name="City"
                      className="basic-single-select"
                      classNamePrefix="select"
                      onChange={(option) => setFieldValue("City", option.value)}
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="City" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#dd033a", fontSize: "13px" }}>
                      State
                    </span>
                    <Select
                      components={animatedComponents}
                      options={stateOptions}
                      styles={customStyles}
                      name="State"
                      className="basic-single-select"
                      classNamePrefix="select"
                      onChange={(option) =>
                        setFieldValue("State", option.value)
                      }
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="State" />
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#45f3ff", fontSize: "13px" }}>
                      Language
                    </span>
                    <Select
                      components={animatedComponents}
                      options={languageOptions}
                      styles={expertiseStyles}
                      name="Language"
                      className="basic-single-select"
                      classNamePrefix="select"
                      onChange={(option) =>
                        setFieldValue("Language", option.value)
                      }
                    />
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Language" />
                  </div>
                  <div className="mt-3">
                    <span
                      style={{
                        color: "#dd033a",
                        fontSize: "13px",
                      }}
                    >
                      Image
                    </span>
                    <input
                      type="file"
                      name="Image"
                      onChange={(event) => {
                        handleImageChange(event);
                        setFieldValue("Image", event.currentTarget.files[0]);
                      }}
                      className="form-control"
                      style={inputImage.input}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="Image" />
                    </div>
                    {/* {imagePreview && (
                        <div className="image-preview mt-3">
                          <img src={imagePreview} alt="Image Preview" style={{width:"100%", height:"100%"}}/>
                        </div>
                      )} */}
                  </div>
                  <button type="submit">Register</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}