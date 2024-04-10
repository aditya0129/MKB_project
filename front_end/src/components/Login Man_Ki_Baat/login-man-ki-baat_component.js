import React from "react";
import "./login-man-ki-baat_component.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useCookies } from "react-cookie";

export function LoginManKiBaatComponent() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  const SignupClick = () => {
    navigate("/sign-up")
  }

  return (
    <>
      <div className="box" id="body">
        <Formik 
        initialValues={{
            "email":"",
            "password":""
        }}
        onSubmit={
            (values)=>{
                axios({
                    method: "get",
                    url: "http://localhost:3001/user/:userId/profile"
                })
                .then(response=>{
                    for(var user of response.data){
                        if(user.email===values.email && user.password===values.password) {
                            setCookie("userid", values.email);
                            navigate("/");
                            break;
                        } else {
                            navigate("/invalid")
                        }
                    }
                })
            }
        }
        >
            {
                <form autocomplete="off">
                <FontAwesomeIcon className="icon" icon={faUserTie} />
                <h2>Sign in</h2>
                <div className="inputBox">
                  <input type="text" required="required" />
                  <span>Email</span>
                  <i></i>
                </div>
                <div id="inputBox">
                  <input type="password" required="required" />
                  <span>Password</span>
                  <i></i>
                </div>
                <div className="links">
                  <a href="forget-password">Forgot Password ?</a>
                  <a href="sign-up" onClick={SignupClick}>Signup</a>
                </div>
                <input type="submit" value="Login" />
              </form>
            }
        </Formik>
      </div>
    </>
  );
}