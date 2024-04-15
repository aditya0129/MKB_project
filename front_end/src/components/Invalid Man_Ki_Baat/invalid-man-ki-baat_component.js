import React from "react";
import "./invalid-man-ki-baat_component.css"
import { Link } from "react-router-dom";

export function InvalidManKiBaatComponent(){
    return(
        <div className="text-danger mt-5 ms-5">
            <h3>Invalid Email / Password</h3>
            <div>
                <Link to="/login">Try again</Link>
            </div>
        </div>
        
    )
}