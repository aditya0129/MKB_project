import React, { useState } from "react";
import "./advisor-login-man-ki-baat_component.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";

export function AdvisorLoginManKiBaatComponent() {
  const navigate = useNavigate();
  //const [cookies, setCookie] = useCookies(["token"]);
  const [cookies, setCookie] = useCookies(["auth_token"]); // 👈 match the cookie name
  const [showPassword, setShowPassword] = useState(false);

  const SignupClick = () => {
    navigate("/advisor-register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div id="fill">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="box mb-5" id="body" style={{ height: "575px" }}>
              <Formik
                initialValues={{
                  Email: "",
                  Password: "",
                }}
                validationSchema={yup.object({
                  Password: yup
                    .string()
                    .required("Password Required")
                    .matches(
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/,
                      "Password 8 to 15 Chars With Uppercase Letter, Special Character & Number"
                    ),
                  Email: yup
                    .string()
                    .required("Email Required")
                    .email("Invalid Email"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const authResponse = await axios.post(
                      "/backend/Advisor_login",
                      {
                        Email: values.Email,
                        Password: values.Password,
                      }
                    );
                    const token = authResponse.data.Token;
                    localStorage.setItem("token", token);
                    //setCookie("token", token, { path: "/" });
                    setCookie("auth_token", token, { path: "/" });
                    alert("Login Successfully...");
                    navigate("/advisor-profile");
                  } catch (error) {
                    console.error("Error:", error);
                    navigate("/invalid");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form autoComplete="off">
                    <FontAwesomeIcon className="icon" icon={faUserTie} />
                    <h2>Sign in</h2>
                    <div className="inputBox">
                      <Field type="text" name="Email" />
                      <span>Email</span>
                      <i></i>
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="Email" />
                    </div>
                    <div id="inputBox" style={{ position: "relative" }}>
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
                    <div className="links">
                      <a href="advisor-forget-password">Forgot Password?</a>
                      <a href="advisor-register" onClick={SignupClick}>
                        Signup
                      </a>
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                      Login
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
