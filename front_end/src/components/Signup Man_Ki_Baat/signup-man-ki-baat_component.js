import React, { useState, useEffect } from "react";
import "./signup-man-ki-baat_component.css";
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
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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

const animatedComponents = makeAnimated();

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

const categoryOptions = [
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

export function SignupManKiBaatComponent() {
  const navigate = useNavigate();
  const [cityOptions, setCityOptions] = useState([]);

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

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

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

  const inputStyles = {
    input: {
      width: "90%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #45f3ff",
      backgroundColor: "#45f3ff",
      color: "white",
      outline: "none",
      transition: "0.3s",
      height: "44px",
      fontSize: "1em",
      marginLeft: "35px",
      opacity: 0.8,
    },
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
      border: "1px solid #45f3ff",
      backgroundColor: "#45f3ff",
      color: "white",
      outline: "none",
      transition: "0.3s",
      height: "44px",
      fontSize: "1em",
      opacity: 0.8,
    },
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

  const [birthdate, setBirthdate] = useState(null);
  const [ageError, setAgeError] = useState("");

  function handleDateChange(date) {
    setBirthdate(date);
    const age = calculateAge(date);
    if (age < 18) {
      setAgeError("User Should Be 18+");
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="boxing mb-5" id="body">
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  number: "",
                  birthdate: "",
                  place: "",
                  gender: "",
                  category: "",
                  sub_category: "",
                  profasion: "",
                  image: null,
                }}
                validationSchema={yup.object({
                  name: yup.string().required("User Name Required"),
                  password: yup
                    .string()
                    .required("Password Required")
                    .matches(
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/,
                      "Password 8 to 15 Chars With Uppercase Letter,Special Character & Number"
                    ),
                  email: yup
                    .string()
                    .required("Email Required")
                    .email("Invalid Email"),
                  birthdate: yup.string().required("Age Required"),
                  profasion: yup.string().required("Profession Required"),
                  number: yup
                    .string()
                    .required("Mobile Required")
                    .matches(
                      /^((\+91)?|91)?[6789][0-9]{9}$/,
                      "Invalid Mobile Number"
                    ),
                  gender: yup.string().required("Gender Is Required"),
                  place: yup.string().required("Place Is Required"),
                  category: yup.string().required("Category Is Required"),
                  sub_category: yup.string().required("Sub-Category Required"),
                  image: yup
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
                    if (key === "image") {
                      formData.append("image", image);
                    } else {
                      formData.append(key, values[key]);
                    }
                  }
                  if (!isChecked) {
                    alert(
                      "Please Accept The Terms & Conditions Before Registering."
                    );
                    setSubmitting(false); // Stop submitting
                    return; // Do not proceed if checkbox is not checked
                  }
                  axios
                    .post("http://localhost:3001/Register", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((response) => {
                      alert("Registered Successfully...");
                      const { image } = response.data.user;
                      const imageUrl = `image/${image}`;
                      setFieldValue("image", imageUrl);
                      navigate("/login");
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
                {({ values, setFieldValue }) => (
                  <Form autoComplete="off">
                    <FontAwesomeIcon className="icon" icon={faUserTie} />
                    <h2>Sign up</h2>
                    <div className="arrange">
                      <div className="inputBoxing">
                        <Field type="text" name="name" />
                        <span>Name</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="name" />
                      </div>
                      <div id="inputBoxing">
                        <Field type="text" onKeyUp={VerifyEmail} name="email" />
                        <span>Email</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="email" />
                      </div>
                      {useError && (
                        <div className="text-danger">{useError}</div>
                      )}
                      <div
                        className="inputBoxing"
                        style={{ position: "relative" }}
                      >
                        {/* <Field type="password" name="password" /> */}
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
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
                        <ErrorMessage name="password" />
                      </div>
                      <div id="inputBoxing">
                        <Field type="text" name="profasion" />
                        <span>Profession</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="profasion" />
                      </div>
                      <div className="mt-3">
                        <div className="">
                          <span style={{ color: "#45f3ff", fontSize: "13px" }}>
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
                              setFieldValue("number", value);
                              VerifyNumber(value);
                            }}
                          />
                        </div>
                        <div className="text-danger">
                          <ErrorMessage name="number" />
                        </div>
                      </div>
                      {useErrors && (
                        <div className="text-danger">{useErrors}</div>
                      )}
                      <div className="mt-3">
                        <span style={{ color: "#dd033a", fontSize: "13px" }}>
                          Birthdate
                        </span>
                        <i></i>
                        <div className="">
                          <DatePicker
                            name="birthdate"
                            selected={values.birthdate}
                            onChange={(date) => {
                              setFieldValue("birthdate", date);
                              handleDateChange(date);
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Date..."
                            className="birthdate-input"
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
                          <ErrorMessage name="birthdate" />
                        </div>
                        {ageError && (
                          <div className="text-danger">{ageError}</div>
                        )}
                        <div className="mt-3">
                          <span style={{ color: "#45f3ff", fontSize: "13px" }}>
                            Place
                          </span>
                          <Select
                            components={animatedComponents}
                            options={cityOptions}
                            styles={expertiseStyles}
                            name="place"
                            className="basic-single-select"
                            classNamePrefix="select"
                            onChange={(option) =>
                              setFieldValue("place", option.value)
                            }
                          />
                        </div>
                        <div className="text-danger">
                          <ErrorMessage name="place" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span
                          style={{
                            color: "#dd033a",
                            fontSize: "13px",
                          }}
                        >
                          Gender
                        </span>
                        <Select
                          options={genderOptions}
                          classNamePrefix="react-select"
                          placeholder="Select..."
                          styles={customStyles}
                          onChange={(option) =>
                            setFieldValue("gender", option.value)
                          }
                        />
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="gender" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <span style={{ color: "#45f3ff", fontSize: "13px" }}>
                        Category
                      </span>
                      <Select
                        components={animatedComponents}
                        options={categoryOptions}
                        styles={expertiseStyles}
                        name="category"
                        className="basic-single-select"
                        classNamePrefix="select"
                        onChange={(option) =>
                          setFieldValue("category", option.value)
                        }
                      />
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="category" />
                    </div>
                    <div className="mt-3">
                      <span style={{ color: "#dd033a", fontSize: "13px" }}>
                        Sub-Category
                      </span>
                      <Select
                        components={animatedComponents}
                        options={categoryOptions}
                        styles={customStyles}
                        name="sub_category"
                        className="basic-single-select"
                        classNamePrefix="select"
                        onChange={(option) =>
                          setFieldValue("sub_category", option.value)
                        }
                      />
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="sub_category" />
                    </div>
                    <div className="mt-3">
                      <span
                        style={{
                          color: "#45f3ff",
                          fontSize: "13px",
                        }}
                      >
                        Image
                      </span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(event) => {
                          handleImageChange(event);
                          setFieldValue("image", event.currentTarget.files[0]);
                        }}
                        className="form-control"
                        style={inputImage.input}
                      />
                      <div className="text-danger">
                        <ErrorMessage name="image" />
                      </div>
                      <div className="mt-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: "pointer" }}
                          checked={isChecked} // Keep track of checkbox state
                          onChange={handleCheckboxChange} // Checkbox state change
                        />
                        <a
                          href="terms-and-conditions"
                          className="text-decoration-none text-secondary ms-2"
                          style={{ fontFamily: "fantasy" }}
                        >
                          Terms & Conditions
                        </a>
                      </div>
                    </div>
                    <button type="submit">Register</button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
