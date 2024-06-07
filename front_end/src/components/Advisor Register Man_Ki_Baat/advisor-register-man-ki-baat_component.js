import React from "react";
import "./advisor-register-man-ki-baat_component.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function AdvisorRegisterManKiBaatComponent() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="box3 mb-5" id="body">
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                Phone_number: "",
                expertise: "",
                profile_description: "",
                availability_schedule: "",
                payment_info: "",
                rating: 0,
              }}
              validationSchema={yup.object({
                name: yup.string().required("User Name Required"),
                password: yup
                  .string()
                  .required("Password Required")
                  .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/,
                    "Password must be 8 to 15 characters with an uppercase letter, special character, and number"
                  ),
                email: yup
                  .string()
                  .required("Email Required")
                  .email("Invalid Email"),
                Phone_number: yup
                  .string()
                  .required("Mobile Required")
                  .matches(
                    /^((\+91)?|91)?[6789][0-9]{9}$/g,
                    "Invalid Mobile Number"
                  ),
                expertise: yup.string().required("Expertise Is Required"),
                profile_description: yup
                  .string()
                  .required("Description Is Required"),
                availability_schedule: yup
                  .string()
                  .required("Schedule Is Required"),
                payment_info: yup.string().required("Payment Is Required"),
                rating: yup.number().required("Rating Is Required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                axios
                  .post("http://localhost:3001/Advisor_register", values)
                  .then(() => {
                    alert("Registered Successfully.");
                    navigate("/advisor-login");
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
                  <div className="inputBox">
                    <Field type="text" name="name" />
                    <span>Username</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="name" />
                  </div>
                  <div id="inputBox">
                    <Field type="text" name="Phone_number" />
                    <span>Number</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="Phone_number" />
                  </div>
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
                  <div className="inputBox">
                    <Field type="text" name="expertise" />
                    <span>Expertise</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="expertise" />
                  </div>
                  <div id="inputBox">
                    <Field type="text" name="profile_description" />
                    <span>Description</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="profile_description" />
                  </div>
                  <div className="inputBox">
                    <Field type="text" name="availability_schedule" />
                    <span>Schedule</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="availability_schedule" />
                  </div>
                  <div id="inputBox">
                    <Field type="text" name="payment_info" />
                    <span>Payment</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="payment_info" />
                  </div>
                  <div className="inputBox">
                    <Field type="number" name="rating" />
                    <span>Rating</span>
                    <i></i>
                  </div>
                  <div className="text-danger">
                    <ErrorMessage name="rating" />
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
