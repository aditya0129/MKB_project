import React, { useState } from "react";
import "./login-man-ki-baat_component.css";
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

export function LoginManKiBaatComponent() {
  const navigate = useNavigate();
  //const [cookies, setCookie] = useCookies(["token"]);
  const [cookies, setCookie] = useCookies(["auth_token"]); // 👈 match the cookie name
  const [showPassword, setShowPassword] = useState(false);

  const SignupClick = () => {
    navigate("/signup");
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
                  email: "",
                  password: "",
                }}
                validationSchema={yup.object({
                  password: yup
                    .string()
                    .required("Password Required")
                    .matches(
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/,
                      "Password 8 to 15 Chars With Uppercase Letter, Special Character & Number"
                    ),
                  email: yup
                    .string()
                    .required("Email Required")
                    .email("Invalid Email"),
                })}
                /*  onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const authResponse = await axios.post("/backend/Login", {
                      email: values.email,
                      password: values.password,
                    });
                    const token = authResponse.data.Token;
                    localStorage.setItem("token", token);
                    //setCookie("token", token, { path: "/" });
                    setCookie("auth_token", token, { path: "/" });
                    const profileResponse = await axios.get(
                      "/backend/get_user/profile",
                      {
                        headers: { "x-auth-token": token },
                      }
                    );

                    if (profileResponse.data.status) {
                      const userId = profileResponse.data.data[0]._id;
                      localStorage.setItem("userId", userId);
                      setCookie("userId", userId, { path: "/" });
                      console.log(
                        "User ID stored in localStorage:",
                        localStorage.getItem("userId")
                      );
                      console.log("User ID stored in cookie:", userId);
                    }
                    alert("Login Successfully...");
                    navigate("/");
                  } catch (error) {
                    console.error("Error:", error);
                    navigate("/invalid");
                  } finally {
                    setSubmitting(false);
                  }
                }} */
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const authResponse = await axios.post("/backend/Login", {
                      email: values.email,
                      password: values.password,
                    });

                    const token = authResponse.data.Token;
                    localStorage.setItem("token", token);

                    try {
                      setCookie("auth_token", token, { path: "/" });
                    } catch (err) {
                      console.error("Cookie set failed:", err);
                    }

                    alert("Login Successfully...");
                    navigate("/");

                    axios
                      .get("/backend/get_user/profile", {
                        headers: { "x-auth-token": token },
                      })
                      .then((profileResponse) => {
                        if (profileResponse.data.status) {
                          const userId = profileResponse.data.data[0]._id;
                          localStorage.setItem("userId", userId);
                          setCookie("userId", userId, { path: "/" });
                        }
                      })
                      .catch((err) =>
                        console.error("Profile fetch error:", err)
                      );
                  } catch (error) {
                    console.error("Login error:", error);
                    alert("Invalid email or password!");
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
                      <Field type="text" name="email" />
                      <span>Email</span>
                      <i></i>
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="email" />
                    </div>
                    <div id="inputBox" style={{ position: "relative" }}>
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
                    <div className="links">
                      <a href="forget-password">Forgot Password?</a>
                      <a href="signup" onClick={SignupClick}>
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
