import React from "react";
import "./man-ki-baat_component.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faLocationDot,faStar,faMessage,faEye,faUser } from "@fortawesome/free-solid-svg-icons";
import {  } from "@fortawesome/free-brands-svg-icons";


export function ManKiBaatComponent() {
    return(
        <>
        <div className="container">
            <div className="row">
                <div className="col-md-6 form-group mt-2 d-flex" >
                    <h1>MAN-KI-BAAT</h1>
                    <input type="" className="form-control ms-5" placeholder="Search" style={{width:"200px",height:"50px"}}/>
                </div>
                <div className="col-md-6">
                    <ul style={{listStyle:"none",margin:"0",padding:"0"}}>
                        <li className="ms-4" style={{display:"inline-block",color:"black",padding:"15px 10px",cursor:"pointer"}}>Find People</li>
                        <li className="ms-4" style={{display:"inline-block",color:"black",padding:"15px 10px",cursor:"pointer"}}>Message</li>
                        <FontAwesomeIcon icon={faEnvelope} style={{color:"blue"}}/>
                        <li className="ms-4" style={{display:"inline-block",color:"black",padding:"15px 10px",cursor:"pointer"}}>My Contacts</li>
                        <img className="ms-4" src="boy-img.jpg" alt="" style={{width:"50px",height:"50px",borderRadius:"100px"}}/>
                    </ul>
                </div>
            </div>
        </div>

        <div className="container">
            <div className="row">
                <div className="col-md-5 mt-5">
                    <img src="boy-img.jpg" alt="" style={{height:"350px",width:"350px",borderRadius:"50px"}}/>
                </div>
                <div className="col-md-7 mt-5">
                    <h3>Jeremy Rose <FontAwesomeIcon className="ms-2" icon={faLocationDot} style={{color:"darkgray",fontSize:"20px"}}/> <span style={{fontSize:"1.2rem",color:"darkgray"}}>New York City</span></h3>
                    <p style={{color:"blue"}}>Product Designer</p>
                    <p style={{color:"darkgray"}}>LOREMIPSUM</p>
                    <p>8,6 <FontAwesomeIcon className="ms-2" icon={faStar} style={{color:"blue"}}/><FontAwesomeIcon className="ms-2" icon={faStar} style={{color:"blue"}}/><FontAwesomeIcon className="ms-2" icon={faStar} style={{color:"blue"}}/><FontAwesomeIcon className="ms-2" icon={faStar} style={{color:"blue"}}/><FontAwesomeIcon className="ms-2" icon={faStar} style={{color:"darkgray"}}/></p>
                    <p><FontAwesomeIcon icon={faMessage} style={{color:"darkgray"}}/> send message <button type="button" className="btn btn-outline-primary ms-4">
                            Contacts
                    </button> <p  className="ms-3" style={{display:"inline-block",color:"darkgray"}} >Report User</p></p>
                    <p style={{color:"darkgray"}}><FontAwesomeIcon icon={faEye} /> Timeline <p  className="ms-3" style={{display:"inline-block",color:"black"}} ><FontAwesomeIcon icon={faUser} /> About</p></p>
                    
                </div>
            </div>
        </div>

        <div className="container">
            <div className="row">
                <div className="col-md-5 mt-5">
                    <h3>Spotify New York <button type="button" className="btn btn-outline-primary ms-4">Primary</button></h3>
                    <p>170 William Street</p>
                    <p style={{marginTop:"-15px"}}>New York, NY 10038.78 212.312.51</p>
                    <h3>Metropolitian Museum <button type="button" className="btn btn-outline-primary ms-4">Secondary</button></h3>
                    <p>S25 Earth Street</p>
                    <p style={{marginTop:"-15px"}}>New York, NY 10038.78 212.312.51</p>
                    <hr></hr>
                    <h5>Branding</h5>
                    <h5>UI/UX</h5>
                    <h5>Web-Design</h5>
                    <h5>Packaging</h5>
                    <h5>Print & Editorial</h5>
                </div>
                <div className="col-md-7 mt-5">
                    <p>Phone <span className="ms-5" style={{color:"blue"}}>+1 125 456 7850</span></p>
                    <p>Address <span className="ms-5">S25 Earth Street</span></p>
                    <p style={{marginLeft:"110px",marginTop:"-15px"}}>New York, NY 10038.78 212.312.51</p>
                    <p>Email <span style={{color:"blue",marginLeft:"70px"}}>hello@jeremyrose.com</span></p>
                    <p>Size <span style={{color:"blue",marginLeft:"80px"}}>www.jeremyrose.com</span></p>
                    <hr style={{marginTop:"56px"}}></hr>
                    <p>Birthday <span className="ms-5">June 5,1992</span></p>
                    <p>Gender <span style={{marginLeft:"55px"}}>Male</span></p>
                </div>
            </div>
        </div>
        </>
    )
}