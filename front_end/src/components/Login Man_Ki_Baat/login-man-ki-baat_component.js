import React from "react";
import "./login-man-ki-baat_component.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useCookies } from "react-cookie";

export function LoginManKiBaatComponent() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  const SignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="box" id="body" style={{ height: "470px" }}>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const authResponse = await axios.post(
              "http://localhost:3001/Login",
              {
                email: values.email,
                password: values.password,
              }
            );

            const token = authResponse.data.token;

            setCookie("token", token);
            alert("Login Successfully..");
            navigate("/");
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
            <div id="inputBox">
              <Field type="password" name="password" />
              <span>Password</span>
              <i></i>
            </div>
            <div className="links">
              <a href="forget-password">Forgot Password ?</a>
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
  );
}
