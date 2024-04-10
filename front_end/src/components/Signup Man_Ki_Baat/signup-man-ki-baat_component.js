import React from "react";
import "./signup-man-ki-baat_component.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from "@fortawesome/free-solid-svg-icons";

export function SignupManKiBaatComponent() {
  return (
    <>
      <div className="box" id="body">
        <form autocomplete="off">
          <FontAwesomeIcon className="icon" icon={faUserTie} />
          <h2>Sign up</h2>
          <div className="inputBox">
            <input type="text" required="required" />
            <span>Username</span>
            <i></i>
          </div>
          <div id="inputBox">
            <input type="text" required="required" />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input type="password" required="required" />
            <span>Password</span>
            <i></i>
          </div>
          <input type="submit" value="Register" />
        </form>
      </div>
    </>
  );
}