import React, { useState, useEffect } from "react";
import "./signup-man-ki-baat_component.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function SignupManKiBaatComponent() {
  const navigate = useNavigate();
  // const [users, setUsers] = useState([]);
  // const [useError, setUseError] = useState('');

  // useEffect(() => {
  //   axios.get('http://localhost:3001/user/66166315a8928cdfd5941024/profile')
  //     .then(response => {
  //       setUsers(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // }, []);

  // function VerifyUserId(e) {
  //   if (!Array.isArray(users)) {
  //     return;
  //   }
  //   for (var user of users) {
  //     if (user.name === e.target.value) {
  //       setUseError('User Name Taken - Try Another');
  //       return;
  //     }
  //   }
  //   setUseError('User Name Available');
  // }

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
                  age: 0,
                  gender: "",
                }}
                validationSchema={yup.object({
                  name: yup.string().required("User Name Required"),
                  password: yup
                    .string()
                    .required("Password Required")
                    .matches(
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/,
                      "Password 8 to 15 Chars with Uppercase letter,Special character & Number"
                    ),
                  email: yup
                    .string()
                    .required("Email Required")
                    .email("Invalid Email"),
                  age: yup.number().required("Age Required"),
                  number: yup
                    .string()
                    .required("Mobile Required")
                    .matches(
                      /^((\+91)?|91)?[6789][0-9]{9}$/g,
                      "Invalid Mobile Number"
                    ),
                  gender: yup.string().required("Gender Is Required"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  axios
                    .post("http://localhost:3001/Register", values)
                    .then(() => {
                      alert("Registered Successfully..");
                      navigate("/login");
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                      alert("Registration failed. Please try again.");
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
              >
                {() => (
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
                        <Field type="text" name="email" />
                        <span>Email</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="email" />
                      </div>
                      <div className="inputBoxing">
                        <Field type="password" name="password" />
                        <span>Password</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="password" />
                      </div>
                      <div id="inputBoxing">
                        <Field type="text" name="number" />
                        <span>Number</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="number" />
                      </div>
                      <div className="inputBoxing">
                        <Field type="date" name="age" />
                        <span>Age</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="age" />
                      </div>
                      <div id="inputBoxing">
                        <Field type="text" name="gender" />
                        <span>Gender</span>
                        <i></i>
                      </div>
                      <div className="text-danger">
                        <ErrorMessage name="gender" />
                      </div>
                    </div>
                    <button type="submit">Register</button>
                    {/* {useError && <div className="text-danger">{useError}</div>} */}
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
