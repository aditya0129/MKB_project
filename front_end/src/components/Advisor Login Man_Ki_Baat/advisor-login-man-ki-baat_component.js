import React from "react";
import "./advisor-login-man-ki-baat_component.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";

export function AdvisorLoginManKiBaatComponent() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  const SignupClick = () => {
    navigate("/advisor-register");
  };

  return (
    <div id="fill">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="box mb-5" id="body" style={{ height: "530px" }}>
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
                      "Password 8 to 15 chars with uppercase letter, special character & number"
                    ),
                  email: yup
                    .string()
                    .required("Email Required")
                    .email("Invalid Email"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const authResponse = await axios.post(
                      "http://localhost:3001/Advisor_login",
                      {
                        email: values.email,
                        password: values.password,
                      }
                    );
                    const token = authResponse.data.Token;
                    localStorage.setItem("token", token);
                    setCookie("token", token, { path: "/" });
                    alert("Login Successfully..");
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
                      <Field type="text" name="email" />
                      <span>Email</span>
                      <i></i>
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="email" />
                    </div>
                    <div id="inputBox">
                      <Field type="password" name="password" />
                      <span>Password</span>
                      <i></i>
                    </div>
                    <div className="text-danger">
                      <ErrorMessage name="password" />
                    </div>
                    <div className="links">
                      <a href="forget-password">Forgot Password?</a>
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
